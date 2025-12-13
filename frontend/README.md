# SusuChain Frontend

Mobile-first Next.js web application for the SusuChain micro-savings DApp.

## Setup

Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env.local` file in this directory:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_SCROLL_SEPOLIA_RPC=https://sepolia-rpc.scroll.io/
```

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Project Structure

```
frontend/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utility functions and Web3 logic
├── public/          # Static assets
└── styles/          # Global styles
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- TailwindCSS 4
- ethers.js 6
- Mobile-first responsive design

## Features

- Connect wallet (MetaMask)
- Create savings vault
- Deposit micro-amounts
- Emergency withdrawal
- View savings progress
