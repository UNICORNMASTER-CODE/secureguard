# SecureGuard - Educational Security Tool Generator

A web application that generates customizable Python security tools for educational purposes. Users can configure parameters like target directories, backup locations, scan profiles, and operation modes to create downloadable Python scripts that combine encryption, decryption, and network scanning capabilities.

## Features

- **Configurable Target Directories**: Support for Windows, Mac, and Linux file system paths
- **Backup Options**: Optional file backup with customizable locations or no backup
- **Network Scanning**: Stealth network scanning with configurable timing profiles
- **File Encryption/Decryption**: Password-based file encryption using Fernet encryption
- **Educational Interface**: Clear legal disclaimers and safety warnings
- **Dark Security Theme**: Professional security-focused UI design

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **UI Framework**: Shadcn/UI components with Tailwind CSS
- **Validation**: Zod schemas for type safety
- **State Management**: React Hook Form + TanStack Query

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/secureguard.git
cd secureguard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5000`

## Deployment Options

### Option 1: GitHub Pages (Static Frontend Only)

For GitHub Pages deployment, you'll need to build a static version of the frontend:

1. Build the frontend:
```bash
npm run build:frontend
```

2. Deploy the `dist` folder to GitHub Pages

**Note**: GitHub Pages only supports static files, so the backend code generation won't work. Users will need to run the backend locally or deploy it separately.

### Option 2: Full Stack Deployment (Recommended)

For full functionality, deploy to platforms that support Node.js:

- **Vercel**: `npm run build && vercel deploy`
- **Netlify**: `npm run build && netlify deploy`
- **Heroku**: Follow Heroku Node.js deployment guide
- **Railway**: `railway deploy`
- **Render**: Connect your GitHub repository

### Option 3: Self-Hosted

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

3. Configure reverse proxy (nginx/Apache) if needed

## Environment Variables

Create a `.env` file for configuration:

```env
NODE_ENV=production
PORT=5000
```

## File Structure

```
secureguard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Application pages
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── services/          # Code generation logic
│   └── routes.ts          # API endpoints
├── shared/                # Shared types and schemas
└── package.json
```

## API Endpoints

- `POST /api/generate` - Generate and download customized security tool

## Generated Tool Features

The generated Python tools include:

- **Network Scanner**: Stealth network scanning with configurable timing
- **File Encryption**: Secure file encryption with password protection
- **File Decryption**: Safe file decryption with validation
- **Backup System**: Optional file backup before encryption
- **Safety Exclusions**: Automatic exclusion of system and script files

## Legal Notice

This tool is provided for **educational and defensive security purposes only**. Users must:

- Only use on systems they own or have explicit permission to test
- Comply with all applicable laws and regulations
- Not use for malicious purposes or unauthorized access
- Take full responsibility for their actions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Security

- All generated tools include safety exclusions for critical files
- Input validation prevents malicious configuration
- Clear legal disclaimers protect against misuse
- Educational focus with defensive security emphasis

## Support

For issues and questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce any problems

## Roadmap

- [ ] Additional encryption algorithms
- [ ] Advanced network scanning options
- [ ] Custom exclusion patterns
- [ ] Multi-language support
- [ ] Docker containerization