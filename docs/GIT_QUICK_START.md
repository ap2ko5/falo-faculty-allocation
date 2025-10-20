# Git Quick Start Guide for Windows

## 1. Install Git

Download and install Git from: https://git-scm.com/download/win

During installation, select: **"Git from the command line and also from 3rd-party software"**

## 2. Verify Installation

Open Command Prompt and run:
```cmd
git --version
```

## 3. Configure Git

```cmd
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 4. Clone This Repository

```cmd
git clone https://github.com/ap2ko5/falo-faculty-allocation.git
cd falo-faculty-allocation
```

## Need Help?

- **Windows PATH Issues**: See [WINDOWS_GIT_SETUP.md](../WINDOWS_GIT_SETUP.md)
- **Project Setup**: See [README.new.md](../README.new.md)

## Common Commands

```cmd
# Check status
git status

# Pull latest changes
git pull

# Create a new branch
git checkout -b my-feature

# Add files
git add .

# Commit changes
git commit -m "Your message"

# Push changes
git push origin my-feature
```
