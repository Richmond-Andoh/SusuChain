# SusuChain Smart Contracts

Solidity smart contracts for the SusuChain micro-savings DApp, built with Hardhat.

## Setup

Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in this directory:
```
PRIVATE_KEY=your_private_key_here
SCROLL_SEPOLIA_RPC_URL=https://sepolia-rpc.scroll.io/
```

## Development

Compile contracts:
```bash
npm run compile
```

Run tests:
```bash
npm test
```

Deploy to local network:
```bash
npm run deploy
```

Deploy to Scroll Sepolia:
```bash
npm run deploy:scroll
```

## Project Structure

```
contracts/
├── contracts/       # Solidity smart contracts
├── scripts/         # Deployment scripts
├── test/           # Contract tests
└── hardhat.config.js
```

## Tech Stack

- Solidity 0.8.20
- Hardhat
- OpenZeppelin Contracts
- Scroll (Layer 2)
