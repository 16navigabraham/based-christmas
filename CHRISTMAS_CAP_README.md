# 🎄 Christmas Cap PFP - Web3 Mini App

A festive Web3 application on Base that lets users add a blue Christmas cap overlay to their profile pictures and mint them on-chain for 0.1 USDC.

## Features

- 🖼️ **Upload & Transform**: Drag-and-drop image upload with automatic Christmas cap overlay
- 🎨 **Blue Christmas Theme**: Beautiful festive blue and white design
- 📤 **IPFS Storage**: Images stored permanently on IPFS via Pinata
- ⛓️ **On-Chain Minting**: Smart contract stores your PFP with 0.1 USDC payment
- 💳 **USDC Payment**: Seamless payment flow with USDC approval
- 📱 **Responsive**: Works perfectly on mobile and desktop
- 🔗 **Base Network**: Built on Base for fast, cheap transactions

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **Wagmi** - React hooks for Ethereum
- **Reown AppKit** - Wallet connection
- **TailwindCSS** - Styling
- **TypeScript** - Type safety

### Smart Contract
- **Solidity 0.8.20** - Smart contract language
- **OpenZeppelin** - Security and standards
- **Hardhat** - Development environment

### Services
- **Pinata** - IPFS file storage
- **Base Network** - L2 blockchain

## Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- A wallet with ETH on Base (for gas)
- USDC on Base (for minting)
- Pinata account (for IPFS)

## Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <your-repo>
cd based-christmas
pnpm install
\`\`\`

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update `.env.local` with:
- `NEXT_PUBLIC_PINATA_JWT`: Your Pinata JWT token
- `NEXT_PUBLIC_PINATA_GATEWAY`: Your Pinata gateway URL
- `PRIVATE_KEY`: Your wallet private key (for deployment)
- `BASE_RPC_URL`: Base RPC endpoint (optional)

### 3. Deploy Smart Contract

\`\`\`bash
# Install Hardhat dependencies
pnpm add --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Deploy to Base mainnet
npx hardhat run scripts/deploy-contract.ts --network base

# Or deploy to Base Sepolia testnet
npx hardhat run scripts/deploy-contract.ts --network baseSepolia
\`\`\`

After deployment, update `.env.local`:
\`\`\`
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed_contract_address>
\`\`\`

### 4. Verify Contract (Optional)

\`\`\`bash
npx hardhat verify --network base <CONTRACT_ADDRESS> 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
\`\`\`

### 5. Run Development Server

\`\`\`bash
pnpm dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## Smart Contract

### ChristmasCapPFP Contract

**Address on Base**: `<will be added after deployment>`

**Key Functions**:
- `addChristmasCap(string originalImage, string cappedImage)` - Mint a Christmas PFP for 0.1 USDC
- `userPFP(address user)` - Get user's latest Christmas PFP URL
- `withdraw()` - Owner only: withdraw collected USDC

**Events**:
- `PFPCapped(address user, string originalImage, string cappedImage, uint256 timestamp)`

### Contract Architecture

\`\`\`solidity
contract ChristmasCapPFP is Ownable {
    IERC20 public usdc;
    uint256 public constant PRICE = 100000; // 0.1 USDC (6 decimals)
    mapping(address => string) public userPFP;
    // ... functions
}
\`\`\`

## User Flow

1. **Connect Wallet** - User connects their wallet via Reown AppKit
2. **Upload Image** - Drag and drop or select profile picture
3. **Preview** - See the image with blue Christmas cap overlay
4. **Upload to IPFS** - Original and capped images uploaded to Pinata
5. **Approve USDC** - User approves contract to spend 0.1 USDC
6. **Mint** - Call smart contract to store PFP on-chain
7. **Download** - Download final Christmas PFP
8. **View Dashboard** - See all your minted Christmas PFPs

## Project Structure

\`\`\`
based-christmas/
├── contracts/
│   └── ChristmasCapPFP.sol      # Main smart contract
├── public/
│   └── christmas-cap.svg        # Blue Christmas cap overlay
├── scripts/
│   └── deploy-contract.ts       # Deployment script
├── src/
│   ├── app/                     # Next.js app directory
│   ├── components/
│   │   ├── christmas/           # Christmas PFP components
│   │   │   ├── ImageUpload.tsx  # Image upload UI
│   │   │   ├── CapPreview.tsx   # Preview with cap
│   │   │   ├── MintFlow.tsx     # Main minting flow
│   │   │   └── UserDashboard.tsx # User's PFPs
│   │   └── ui/                  # UI components
│   └── lib/
│       ├── contracts.ts         # Contract ABIs and addresses
│       ├── imageProcessing.ts   # Cap overlay logic
│       └── ipfs.ts              # IPFS upload functions
├── hardhat.config.ts            # Hardhat configuration
└── .env.local                   # Environment variables
\`\`\`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed contract address | Yes |
| `NEXT_PUBLIC_PINATA_JWT` | Pinata JWT token | Yes |
| `NEXT_PUBLIC_PINATA_GATEWAY` | Pinata gateway URL | Yes |
| `PRIVATE_KEY` | Wallet private key (deployment) | Deploy only |
| `BASE_RPC_URL` | Base RPC endpoint | Optional |
| `BASESCAN_API_KEY` | BaseScan API key (verification) | Optional |

## Configuration

### Pinata Setup

1. Create account at [pinata.cloud](https://pinata.cloud)
2. Generate JWT token in API Keys section
3. Add to `.env.local` as `NEXT_PUBLIC_PINATA_JWT`
4. Get gateway URL (e.g., `https://gateway.pinata.cloud`)

### USDC on Base

**Mainnet**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

Get USDC:
- Bridge from Ethereum using [Base Bridge](https://bridge.base.org)
- Buy on Base DEXs
- Use faucet for testnet

## Development

### Running Tests

\`\`\`bash
# Run Hardhat tests
npx hardhat test

# Run with coverage
npx hardhat coverage
\`\`\`

### Building for Production

\`\`\`bash
pnpm build
\`\`\`

### Deployment Options

#### Vercel
\`\`\`bash
pnpm run deploy
\`\`\`

#### Manual
\`\`\`bash
pnpm build
pnpm start
\`\`\`

## Troubleshooting

### "Insufficient USDC balance"
- Ensure you have at least 0.1 USDC in your wallet
- Check you're on Base network

### "Approval failed"
- Make sure you're approving the correct contract address
- Check USDC contract address is correct for your network

### "Image upload failed"
- Verify Pinata JWT is correct and active
- Check Pinata gateway URL
- Ensure image is under 10MB

### "Contract call failed"
- Verify contract address is correct
- Ensure contract is deployed on current network
- Check you have enough ETH for gas

## Security

- ✅ Uses OpenZeppelin audited contracts
- ✅ Owner-only withdraw function
- ✅ Fixed price prevents manipulation
- ✅ No upgradeable contracts (immutable)
- ✅ Events for all state changes

## Gas Costs (Approximate)

- Deploy contract: ~0.002 ETH
- Mint PFP: ~0.0001 ETH + 0.1 USDC
- Approve USDC: ~0.00005 ETH

## Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file

## Support

- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Base Discord**: Join [Base Discord](https://base.org/discord)

## Credits

Built with:
- [Next.js](https://nextjs.org)
- [Wagmi](https://wagmi.sh)
- [Reown AppKit](https://reown.com)
- [OpenZeppelin](https://openzeppelin.com)
- [Pinata](https://pinata.cloud)
- [Base](https://base.org)

---

Made with 🎄 for the holidays

## Roadmap

- [ ] Add more cap styles (red, green, gold)
- [ ] NFT minting option
- [ ] Social sharing features
- [ ] Gallery of all minted PFPs
- [ ] Frame for Farcaster
