// #popclip
// name: Gemini Chat
// icon: octicon--sparkles-fill-24.svg
// identifier: com.iairu.popclip.extension.gemini
// description: Send the selected text to Gemini's Chat API.
// app: { name: Gemini API, link: 'https://ai.google.dev/gemini-api/docs/quickstart?lang=rest' }
// popclipVersion: 001
// keywords: gemini google ai
// entitlements: [network]

import axios from "axios";

export const options = [
	{
		identifier: "apikey",
		label: "API Key",
		type: "string",
		description:
			"Obtain an API key from: https://aistudio.google.com/app/apikey",
	},
	{
		identifier: "model",
		label: "Model",
		type: "multiple",
		defaultValue: "gemini-2.0-flash-exp",
		values: ["gemini-2.0-flash-thinking-exp-01-21", "gemini-2.0-pro-exp-02-05", "gemini-2.0-flash-exp", "gemini-2.0-flash", "gemini-1.5-flash"],
	},
	{
		identifier: "systemMessage",
		label: "System Message",
		type: "string",
		description:
			"Optional system message to specify the behaviour of the AI assistant.",
	},
	{
		identifier: "domain",
		label: "API Base Domain",
		type: "string",
		defaultValue: "generativelanguage.googleapis.com",
		description: "Leave as default unless you use a custom server.",
	},
	{
		identifier: "textMode",
		label: "Response Handling",
		type: "multiple",
		values: ["append", "replace", "copy"],
		valueLabels: ["Append", "Replace", "Copy"],
		defaultValue: "append",
		description:
			"Append the response, replace the selected text, or copy to clipboard.",
	},
	{
		identifier: "resetMinutes",
		label: "Reset Timer (minutes)",
		type: "string",
		description:
			"Reset the conversation if idle for this many minutes. Set blank to disable.",
		defaultValue: "15",
	},
	{
		identifier: "showReset",
		label: "Show Reset Button",
		type: "boolean",
		icon: "game-icons--broom.svg",
		description: "Show a button to reset the conversation.",
	},
] as const;

type Options = InferOptions<typeof options>;

// typescript interfaces for OpenAI API
interface Message {
	role: "user" | "system" | "assistant";
	content: string;
}
interface ResponseData {
	candidates: [{ content: { parts: [{ text: string }] } }];
}
interface Response {
	data: ResponseData;
}

// the extension keeps the message history in memory
const messages: Array<Message> = [];

// the last chat date
let lastChat: Date = new Date();

// reset the history
function reset() {
	print("Resetting chat history");
	messages.length = 0;
}

// get the content of the last `n` messages from the chat, trimmed and separated by double newlines
function getTranscript(n: number): string {
	return messages
		.slice(-n)
		.map((m) => m.content.trim())
		.join("\n\n");
}

// the main chat action
const chat: ActionFunction<Options> = async (input, options) => {
	const gemini = axios.create({
		baseURL: `https://${options.domain}/v1beta/models/${options.model}:generateContent?key=${options.apikey}`,
		//headers: { Authorization: `Bearer ${options.apikey}` }, //not needed for gemini
	});

	// if the last chat was long enough ago, reset the history
	if (options.resetMinutes.length > 0) {
		const resetInterval = parseInt(options.resetMinutes) * 1000 * 60;
		if (new Date().getTime() - lastChat.getTime() > resetInterval) {
			reset();
		}
	}

	// Build the content array, starting with the system message if present.
	const contents: any[] = [];
	let systemMessage = options.systemMessage.trim();

	// Combine system message and user input into a single parts array for Gemini
	const parts: any[] = [];
	if (systemMessage) {
		parts.push({ text: systemMessage });
	}
	parts.push({ text: input.text.trim() });


	contents.push({ parts: parts });



	// send the message history to Gemini
	try {
		const { data }: Response = await gemini.post(``, {
			contents,
		});

		const responseText = data.candidates[0].content.parts[0].text;

		// add the response to the history
		messages.push({ role: "assistant", content: responseText });
		lastChat = new Date();

		// copy?
		let copy = options.textMode === "copy" || popclip.modifiers.shift;

		// append or replace?
		let replace = options.textMode === "replace";
		if (popclip.modifiers.option) {
			// if holding option, toggle append mode
			replace = !replace;
		}

		if (copy) {
			popclip.copyText(getTranscript(1));
		} else if (replace) {
			popclip.pasteText(getTranscript(1));
		} else {
			popclip.pasteText(getTranscript(2));
			popclip.showSuccess();
		}
	} catch (e) {
		popclip.showText(getErrorInfo(e));
	}
};

export function getErrorInfo(error: unknown): string {
	if (typeof error === "object" && error !== null && "response" in error) {
		const response = (error as any).response;
		return `Message from Gemini (code ${response.status}): ${response.data.error.message}`;
	} else {
		return String(error);
	}
}

// export the actions
export const actions: Action<Options>[] = [
	{
		title: "Chat",
		code: chat,
	},
	{
		title: "Reset Chat",
		icon: "game-icons--broom.svg",
		stayVisible: true,
		requirements: ["option-showReset=1"],
		code: reset,
	},
];
