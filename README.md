# Gemini Chat Extension for PopClip

A custom PopClip extension for Google Gemini AI, forked from the official PopClip OpenAI chat extension.

## Features

- Send selected text to Google Gemini AI
- Two action buttons: Generate response and Clear conversation history
- SVG icons are from https://icon-sets.iconify.design/

## Installation

This extension was last updated 2025-03-13. Make sure you are running PopClip 2024.12 or later.

1. Clone this repository and `cd` into it
2. Run `bash build.sh` to create the extension package from source (quick zip process)
3. The packaged unsigned extension will be in `build/Gemini-Chat-*.popclipextz`
4. Double-click the extension file in Finder to install it in PopClip
5. Add your Gemini API key to the extension preferences

## Files

- `build.sh` - Build script to package the extension for installation
- `src/Config.plist` - Extension configuration and metadata
- `src/Config.ts` - TypeScript configuration and API handling
- `src/*.svg` - Icon assets for the extension buttons

## Credits

Based on the official [OpenAI Chat extension for PopClip](https://github.com/pilotmoon/PopClip-Extensions)

## License

MIT License. See LICENSE file for details.