# 🎄 Based Christmas - Christmas Cap PFP Mini App

A festive Web3 Farcaster Mini App built on Base that lets users add a blue Christmas cap to their profile picture, mint it as an on-chain PFP, and earn points!

## ✨ Features

- 🎅 **Upload & Transform**: Upload your PFP and automatically add a festive blue Christmas cap
- 🔗 **IPFS Storage**: Securely store your capped PFP on IPFS via Pinata
- ⛓️ **On-Chain Minting**: Mint your Christmas PFP on Base blockchain for 0.1 USDC
- 🎯 **Points System**: Earn 2 points for every PFP minted
- 📊 **User Dashboard**: View your stats, points, and minted PFPs
- 🔐 **Farcaster Auth**: Seamless authentication using Farcaster accounts
- 💰 **Multi-Wallet Support**: Compatible with EVM and Solana wallets
- 📱 **Mobile Responsive**: Works perfectly on all devices

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom festive theme
- **Blockchain**: Base (Ethereum L2)
- **Wallet Connection**: Wagmi v2, Reown AppKit
- **Authentication**: Farcaster Quick Auth, NextAuth.js
- **Storage**: IPFS via Pinata
- **Smart Contract**: Solidity 0.8.20 with OpenZeppelin
- **Image Processing**: Canvas API for overlay rendering

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Farcaster account
- Neynar API key
- Pinata account (for IPFS)
- Base wallet with USDC (for minting)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/16navigabraham/based-christmas.git
   cd based-christmas
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Fill in your credentials:
   ```env
   # Neynar API Configuration
   NEYNAR_API_KEY=your_neynar_api_key_here
   NEXT_PUBLIC_NEYNAR_CLIENT_ID=your_client_id_here

   # Reown (WalletConnect) Configuration
   NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id_here

   # Pinata (IPFS) Configuration
   NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_here
   NEXT_PUBLIC_PINATA_GATEWAY_URL=your_gateway_url_here

   # Base Configuration (Mainnet)
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   NEXT_PUBLIC_CHRISTMAS_CAP_CONTRACT=0xYourContractAddress

   # Redis (Upstash) for KV Storage
   UPSTASH_REDIS_REST_URL=your_upstash_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Getting API Keys

### Neynar API
1. Go to [Neynar Dashboard](https://dev.neynar.com/)
2. Create a new app
3. Copy your API key and Client ID

### Reown (WalletConnect)
1. Visit [Reown Cloud](https://cloud.reown.com/)
2. Create a new project
3. Copy your Project ID

### Pinata
1. Sign up at [Pinata](https://pinata.cloud/)
2. Go to API Keys section
3. Create a new API key with pinning permissions
4. Copy the JWT token
5. Set up a gateway and copy the gateway URL

### Upstash Redis
1. Create account at [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and token

## 📝 Smart Contract

The `ChristmasCapPFP` contract is deployed on Base mainnet:

### Contract Features
- **Price**: 0.1 USDC per mint
- **Points**: 2 points awarded per mint
- **Storage**: Stores capped image IPFS URL
- **Events**: Emits `PFPMinted` and `PointsAwarded` events
- **Owner Functions**: `withdraw()` to collect USDC

### Contract Address
Update `NEXT_PUBLIC_CHRISTMAS_CAP_CONTRACT` in `.env.local` with your deployed contract address.

### Contract Functions

```solidity
// Mint a Christmas PFP (requires 0.1 USDC approval first)
function mintChristmasCap(string memory _cappedImage) external

// View user stats
function getUserStats(address _user) external view returns (
    string memory pfp,
    uint256 points,
    uint256 mintCount
)

// Owner withdraw collected USDC
function withdraw() external onlyOwner
```

## 🎨 How It Works

1. **Upload**: User uploads their profile picture
2. **Preview**: App generates preview with blue Christmas cap overlay
3. **Connect Wallet**: User connects their wallet (EVM or Solana)
4. **IPFS Upload**: Capped image is uploaded to IPFS via Pinata
5. **Approve USDC**: User approves 0.1 USDC to the contract
6. **Mint**: Contract mints the PFP and awards 2 points
7. **Success**: User can download and share their festive PFP!

## 🏛️ Project Structure

```
based-christmas/
├── contract/              # Smart contract source
│   └── PFP.SOL           # ChristmasCapPFP contract
├── src/
│   ├── app/              # Next.js app routes
│   │   ├── api/          # API endpoints
│   │   └── share/        # Share page for FIDs
│   ├── components/       # React components
│   │   ├── christmas/    # Christmas-specific components
│   │   │   ├── UserDashboard.tsx
│   │   │   └── ...
│   │   └── ui/          # UI components
│   │       └── christmas/
│   │           ├── ImageUpload.tsx
│   │           ├── CapPreview.tsx
│   │           └── MintFlow.tsx
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and helpers
│   │   ├── contracts.ts    # Contract ABI & config
│   │   ├── imageProcessing.ts
│   │   ├── ipfs.ts
│   │   └── ...
│   └── auth.ts          # NextAuth configuration
├── public/
│   └── assets/
│       └── christmas-cap.svg
└── scripts/             # Build and deployment scripts
```

## 🎯 Key Components

### ImageUpload
Handles drag-and-drop or click-to-upload functionality for user PFPs.

### CapPreview
Renders the uploaded image with the blue Christmas cap overlay using Canvas API.

### MintFlow
Manages the complete minting process:
1. IPFS upload
2. USDC approval
3. Contract interaction
4. Success state with download option

### UserDashboard
Displays user statistics:
- Total points earned
- Number of PFPs minted
- Latest minted PFP preview

## 🔧 Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm cleanup      # Clean up build files
pnpm deploy:vercel # Deploy to Vercel
```

### Testing Locally

1. Use Base Sepolia testnet for testing
2. Get test USDC from faucets
3. Update contract address in `.env.local`
4. Test the complete flow before mainnet deployment

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.local`
4. Deploy!

Or use the CLI:
```bash
pnpm deploy:vercel
```

### Update Contract Address

After deploying your smart contract to Base:
1. Copy the contract address
2. Update `NEXT_PUBLIC_CHRISTMAS_CAP_CONTRACT` in Vercel environment variables
3. Redeploy the app

## 🌐 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEYNAR_API_KEY` | Neynar API key for Farcaster | Yes |
| `NEXT_PUBLIC_NEYNAR_CLIENT_ID` | Neynar client ID | Yes |
| `NEXT_PUBLIC_REOWN_PROJECT_ID` | Reown/WalletConnect project ID | Yes |
| `NEXT_PUBLIC_PINATA_JWT` | Pinata JWT for IPFS uploads | Yes |
| `NEXT_PUBLIC_PINATA_GATEWAY_URL` | Pinata gateway URL | Yes |
| `NEXT_PUBLIC_BASE_RPC_URL` | Base RPC endpoint | Yes |
| `NEXT_PUBLIC_CHRISTMAS_CAP_CONTRACT` | Deployed contract address | Yes |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | Yes |

## 🎨 Design System

The app uses a festive blue and white Christmas theme:
- Primary: Blue (#3b82f6)
- Accent: Light blue
- Background: White with subtle gradients
- Cards: Glassmorphism effect
- Buttons: Rounded with hover effects

## 🐛 Troubleshooting

### Common Issues

**"Payment failed" error**
- Ensure you have sufficient USDC in your wallet
- Check USDC approval was successful
- Verify contract address is correct

**IPFS upload fails**
- Check Pinata JWT is valid
- Ensure Pinata account has sufficient storage
- Verify image size is under limits

**Wallet won't connect**
- Clear browser cache
- Try different wallet provider
- Check network is set to Base

**Transaction pending forever**
- Check Base network status
- Increase gas price if needed
- Verify RPC endpoint is responding

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

- Create an issue for bug reports
- Join our Farcaster channel for discussions
- Check existing issues before creating new ones

## 🎉 Acknowledgments

- Built for the Farcaster ecosystem
- Powered by Base blockchain
- Using Pinata for decentralized storage
- Styled with Tailwind CSS

---

Made with ❤️ for the festive season 🎄

**Happy Holidays!** 🎅🎁
