# Presale-Token

Welcome to the `presale-token` repository! This project is a Next.js application designed to demo interacting with the PresaleERC20 contract on Facet. Before running the application, make sure to set up the environment variables properly.

## Prerequisites

Ensure you have Node.js and Yarn installed on your machine. This project uses Yarn for dependency management.

## Environment Setup

This project requires several environment variables to be set for proper operation. An `.sample.env` file is included in the repository with example values:

```env
NEXT_PUBLIC_NETWORK="sepolia"
NEXT_PUBLIC_API_BASE_URI="https://sepolia-api.facet.org"
NEXT_PUBLIC_BRIDGE_API_BASE_URL="https://sepolia-bridge-api.facet.org"
NEXT_PUBLIC_FACET_SWAP_API_BASE_URI="https://sepolia-api.facetswap.com"
NEXT_PUBLIC_ROUTER_ADDRESS="0xc5c93c9553437bf94cf07ad2e8659197c094d5b4"
NEXT_PUBLIC_BRIDGED_ETHER_ADDRESS="0x1673540243e793b0e77c038d4a88448eff524dce"
NEXT_PUBLIC_FACET_CARDS_ADDRESS="0xfa222788f938b893af6b72196d0f2627f0939196"
NEXT_PUBLIC_BUDDY_FACTORY="0x27205363b4b0375c8bf24c64bba2d4ef3d2ba07e"
# CHANGE THIS
NEXT_PUBLIC_PROJECT_ID=""
NEXT_PUBLIC_TOKEN_ADDRESS=""
```

To set up your environment:

1. Copy the `.sample.env` file to a new file named `.env.local` in the root directory of your project.
2. Modify the `NEXT_PUBLIC_PROJECT_ID` and `NEXT_PUBLIC_TOKEN_ADDRESS` in your `.env.local` file with the actual values required for your Wallet Connect project ID and token contract address.

## Installation

To install the necessary dependencies, run the following command:

```bash
yarn install
```

## Running the Application

Start the development server by running:

```bash
yarn dev
```

This will launch the Next.js application in development mode. Visit `http://localhost:3000` in your browser to see the application. It will automatically reload if you make changes to the code.

## License

This project is licensed under the [MIT License](LICENSE.md). You are free to use, modify, and distribute it under the terms of this license.

## Learn More

To learn more about this stack, take a look at the following resources:

- [Facet Documentation](https://docs.facet.org) - Learn how to build on Facet.
- [Facet Discord](https://discord.gg/facet) - Join our community of builders!
