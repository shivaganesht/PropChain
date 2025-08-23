# 🚀 Upload PropChain to GitHub - 3 Simple Steps

## Option 1: Automated Script (Recommended) ✨

Just run this single command in PowerShell:

```powershell
.\upload-to-github.ps1
```

This will:
1. Open browser for GitHub login
2. Create the repository
3. Upload all code
4. Add topics
5. Open your new repo

## Option 2: Manual Commands 📝

Run these commands one by one:

### Step 1: Login to GitHub
```powershell
& "C:\Program Files\GitHub CLI\gh.exe" auth login
```
- Choose: GitHub.com
- Choose: HTTPS
- Choose: Login with a web browser
- Copy the code and press Enter
- Authorize in browser

### Step 2: Create & Push Repository
```powershell
& "C:\Program Files\GitHub CLI\gh.exe" repo create PropChain --public --description "Decentralized Real Estate Platform - Fractional ownership on Avalanche blockchain with Chainlink integration" --source=. --remote=origin --push
```

### Step 3: View Your Repository
```powershell
& "C:\Program Files\GitHub CLI\gh.exe" repo view --web
```

## Option 3: Web Browser Method 🌐

### 1. Create Repository
- Go to: https://github.com/new
- Name: `PropChain`
- Description: `Decentralized Real Estate Platform - Fractional ownership on Avalanche blockchain with Chainlink integration`
- Public repository
- DON'T initialize with README

### 2. Push Code (in PowerShell)
```powershell
git push -u origin main
```

## 📍 Your Repository URL

After uploading, your project will be at:
**https://github.com/shivaganesht/PropChain**

## ✅ What Gets Uploaded

- **Smart Contracts** - ERC1155 with Chainlink
- **Backend API** - Node.js + MongoDB  
- **Frontend** - Next.js + Web3
- **Documentation** - README, Quick Start
- **Scripts** - Deployment automation
- **46 files** ready for hackathon!

## 🏆 After Upload

1. **Star** your repository ⭐
2. **Add topics**: blockchain, avalanche, chainlink, web3
3. **Create release**: v1.0.0
4. **Share link** in hackathon submission

## 🆘 Troubleshooting

If authentication fails:
1. Create Personal Access Token: https://github.com/settings/tokens
2. Use token as password when pushing

If push fails:
```powershell
git remote set-url origin https://github.com/shivaganesht/PropChain.git
git push -u origin main --force
```

## 🎉 Success!

Once uploaded, you'll have a complete hackathon-ready project on GitHub!
