# GitHub Repository Setup Instructions

Follow these steps to push your PropChain project to GitHub:

## 1. Create a New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `PropChain`
3. Description: `Decentralized Real Estate Platform - Fractional ownership on Avalanche blockchain with Chainlink integration`
4. Make it Public
5. DO NOT initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## 2. Push Your Code

After creating the repository, run these commands in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/shivaganesht/PropChain.git

# Push to main branch
git branch -M main
git push -u origin main
```

## 3. Alternative: Using Personal Access Token

If you get authentication errors:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use the token as password when pushing

```bash
git remote set-url origin https://shivaganesht@github.com/shivaganesht/PropChain.git
git push -u origin main
# Enter your personal access token when prompted for password
```

## 4. Quick Setup Commands

Run this complete sequence:

```powershell
# Set remote
git remote add origin https://github.com/shivaganesht/PropChain.git

# Rename branch to main
git branch -M main

# Push all code
git push -u origin main
```

## 5. Verify Upload

After pushing, your repository will be available at:
https://github.com/shivaganesht/PropChain

## Features Included in This Repository:

- ✅ Smart Contracts (ERC1155 with Chainlink)
- ✅ Backend API (Node.js + MongoDB)
- ✅ Frontend (Next.js + Web3)
- ✅ Complete Documentation
- ✅ Deployment Scripts
- ✅ Environment Templates

## Next Steps After GitHub Upload:

1. Add a LICENSE file (MIT recommended)
2. Set up GitHub Actions for CI/CD
3. Add badges to README
4. Enable GitHub Pages for documentation
5. Create releases for major versions
