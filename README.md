# PanPal

PanPal is a React Native application developed using Expo. This guide provides instructions on how to install, start, and run the app on a device or simulator.

## Table of Contents

- [PanPal](#panpal)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
    - [Running on a Simulator](#running-on-a-simulator)
      - [Android Emulator](#android-emulator)
      - [Running on a Physical Device](#running-on-a-physical-device)
  - [Configuration](#configuration)
  - [Additional Resources](#additional-resources)
  - [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed. You can download it from [Node.js official website](https://nodejs.org/).
- Expo CLI installed. If not, you can install it by running:
  ```sh
  npm install -g expo-cli
  ```
- An Android or iOS device, or an emulator/simulator installed on your machine.

## Installation

1. Clone the repository:

```sh
git clone https://github.com/JensErven/PanPal.git
```

2. Navigate to the project directory:

```sh
cd panpal
```

3. Install the dependencies:

```sh
npm install
```

4. Add .env file in the root of the project. Add the correct credentials to connect to firebase and openai api.

Your env file should have these variable names (make sure to add credentials):

```sh
EXPO_PUBLIC_API_KEY=
EXPO_PUBLIC_AUTH_DOMAIN=
EXPO_PUBLIC_PROJECT_ID=
EXPO_PUBLIC_STORAGE_BUCKET=
EXPO_PUBLIC_MESSAGING_SENDER_ID=
EXPO_PUBLIC_APP_ID=
EXPO_PUBLIC_OPENAI_API_KEY=
```

## Running the App

### Running on a Simulator

#### Android Emulator

1. Ensure you have Android Studio installed.
2. Open Android Studio and start an Android Virtual Device (AVD).
3. Start the Android emulator:

```sh
npx expo --android
```

#### Running on a Physical Device

1. Download the Expo Go app from the App Store (iOS) or Google Play Store (Android).
2. Start the Expo development server:

```sh
npx expo
```

3. Scan the QR code displayed in the terminal or in the Expo Developer Tools using the Expo Go app on your device.

## Configuration

The project configuration is managed in the app.json file. Here you can set the app name, slug, version, orientation, splash screen, and other properties.

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Cli](https://docs.expo.dev/more/expo-cli/)
- [OpenAI Documentation](https://platform.openai.com/docs/api-reference/introduction)

## License

This project is privately licensed and the intellectual property of its owner. No part of this repository may be distributed, or used for other purposes without the explicit permission of the owner.
