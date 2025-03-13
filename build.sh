#!/bin/bash

# Settings
PCX_BUILD_ID=48f32j
PCX_SUBVERSION=4586
PCX_IDENTIFIER=com.iairu.popclip.extension.gemini
PCX_NAME=Gemini-Chat

# Create build folder
mkdir -p build

# Remove existing build contents
rm -rf build/*

# Create extension folder
mkdir -p build/@${PCX_BUILD_ID}.${PCX_IDENTIFIER}.popclipext

# Copy source files
cp -r src/* build/@${PCX_BUILD_ID}.${PCX_IDENTIFIER}.popclipext/

# Zip the extension
pushd build
zip -r ${PCX_NAME}-${PCX_BUILD_ID}-${PCX_SUBVERSION}.zip @${PCX_BUILD_ID}.${PCX_IDENTIFIER}.popclipext
popd

# Rename to .popclipextz
mv build/${PCX_NAME}-${PCX_BUILD_ID}-${PCX_SUBVERSION}.zip build/${PCX_NAME}-${PCX_BUILD_ID}-${PCX_SUBVERSION}.popclipextz

# Remove the build folder
rm -rf build/@${PCX_BUILD_ID}.${PCX_IDENTIFIER}.popclipext