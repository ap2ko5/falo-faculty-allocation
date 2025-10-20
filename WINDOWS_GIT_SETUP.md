# Adding Git to System PATH for Windows

This guide will help you add Git to your Windows system PATH after installation, enabling you to use Git commands from any command prompt or terminal.

## Prerequisites

- Git for Windows must be installed on your system
- If you haven't installed Git yet, download it from: https://git-scm.com/download/win

## What is PATH?

The PATH environment variable tells Windows where to look for executable programs. Adding Git to PATH allows you to run Git commands from any directory in Command Prompt, PowerShell, or other terminals.

## Method 1: Verify Git Installation (Recommended First Step)

Before adding Git to PATH manually, check if Git is already in your PATH:

1. Open Command Prompt (Press `Win + R`, type `cmd`, press Enter)
2. Type `git --version` and press Enter
3. If you see a version number (e.g., `git version 2.43.0`), Git is already in PATH - **you're done!**
4. If you see an error like `'git' is not recognized as an internal or external command`, continue with the methods below

## Method 2: Reinstall Git with PATH Option (Easiest)

If Git is not in your PATH, the easiest solution is to reinstall Git:

1. Download the latest Git installer from https://git-scm.com/download/win
2. Run the installer
3. **IMPORTANT**: During installation, select the option:
   - "Git from the command line and also from 3rd-party software" (This is usually the default)
   - OR "Use Git and optional Unix tools from the Command Prompt"
4. Complete the installation with default options
5. Restart any open Command Prompt or PowerShell windows
6. Verify by running `git --version` in a new Command Prompt

## Method 3: Manually Add Git to PATH

If you prefer not to reinstall, follow these steps to manually add Git to your PATH:

### Step-by-Step Instructions

#### 1. Find Your Git Installation Directory

The default installation paths are:
- **64-bit system**: `C:\Program Files\Git\cmd`
- **32-bit system**: `C:\Program Files (x86)\Git\cmd`

To verify your Git location:
1. Open File Explorer
2. Navigate to `C:\Program Files\Git\cmd`
3. Check if `git.exe` exists in this folder
4. If not found, check `C:\Program Files (x86)\Git\cmd`
5. Copy the full path where you find Git

#### 2. Open System Environment Variables

**Windows 11:**
1. Right-click the Start button
2. Select "System"
3. Click "Advanced system settings" on the right
4. Click "Environment Variables..." button at the bottom

**Windows 10:**
1. Right-click "This PC" or "My Computer"
2. Select "Properties"
3. Click "Advanced system settings" on the left
4. Click "Environment Variables..." button at the bottom

**Alternative Method (All Windows versions):**
1. Press `Win + R` to open Run dialog
2. Type `sysdm.cpl` and press Enter
3. Go to "Advanced" tab
4. Click "Environment Variables..." button

#### 3. Edit the PATH Variable

1. In the "Environment Variables" window, you'll see two sections:
   - **User variables** (for your account only)
   - **System variables** (for all users)

2. **Recommended**: Edit User variables PATH:
   - Under "User variables", find and select "Path"
   - Click "Edit..."

3. **Alternative**: Edit System variables PATH (requires admin rights):
   - Under "System variables", find and select "Path"
   - Click "Edit..."

#### 4. Add Git to PATH

**Windows 10/11 (Visual Editor):**
1. Click "New"
2. Add these two paths (one at a time):
   - `C:\Program Files\Git\cmd`
   - `C:\Program Files\Git\bin` (optional, for Unix-like tools)
3. Click "OK" on all windows

**Windows 7/8 (Text Editor):**
1. You'll see a single text field with paths separated by semicolons
2. Go to the end of the existing text
3. Add a semicolon (`;`) if there isn't one
4. Add: `;C:\Program Files\Git\cmd`
5. Optionally add: `;C:\Program Files\Git\bin`
6. Click "OK" on all windows

#### 5. Apply Changes

1. Close ALL open Command Prompt, PowerShell, or terminal windows
2. Open a NEW Command Prompt or PowerShell window
3. The PATH changes only take effect in new windows

#### 6. Verify Git is in PATH

Open a new Command Prompt and run:
```cmd
git --version
```

You should see output like:
```
git version 2.43.0.windows.1
```

## Method 4: Add Git to PATH for Current Session Only (Temporary)

If you need Git immediately without permanent changes:

Open Command Prompt and run:
```cmd
set PATH=%PATH%;C:\Program Files\Git\cmd
```

Or in PowerShell:
```powershell
$env:Path += ";C:\Program Files\Git\cmd"
```

**Note**: This is temporary and only works for the current window session.

## Common Issues and Troubleshooting

### Issue 1: "git is still not recognized" after adding to PATH

**Solutions:**
- Make sure you closed and reopened your Command Prompt/PowerShell
- Verify the path you added is correct (check if git.exe exists there)
- Make sure there are no typos in the path
- Restart your computer if changes still don't apply
- Check if there are any spaces in the path - it should be exact

### Issue 2: "Access Denied" when editing System PATH

**Solutions:**
- Edit "User variables" PATH instead (doesn't require admin rights)
- Right-click Command Prompt and select "Run as Administrator"
- Ask your system administrator for permissions

### Issue 3: Git works in Git Bash but not in Command Prompt

**Solutions:**
- This means Git is not in your system PATH
- Follow Method 3 to add Git to PATH manually
- Or reinstall Git with the correct PATH option (Method 2)

### Issue 4: Multiple Git versions or conflicts

**Solutions:**
- Check which Git is being used: `where git` (cmd) or `Get-Command git` (PowerShell)
- Remove older Git installations
- Ensure only one Git path is in your PATH variable
- The first matching path in PATH takes precedence

### Issue 5: PATH is too long (Windows limitation)

**Solutions:**
- PATH has a maximum length (2047 characters on modern Windows)
- Remove unused paths from your PATH variable
- Use shorter folder names if possible
- Consider using symbolic links for long paths

## Verify Your Setup

After setting up Git, verify everything works:

```cmd
# Check Git version
git --version

# Check Git configuration
git config --list

# Test basic Git command
git help

# Clone a test repository (optional)
git clone https://github.com/ap2ko5/falo-faculty-allocation.git
```

## Next Steps

Once Git is properly set up in your PATH:

1. Configure your Git identity:
   ```cmd
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. Set up SSH keys for GitHub (optional but recommended):
   - Follow GitHub's guide: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

3. Clone this repository:
   ```cmd
   git clone https://github.com/ap2ko5/falo-faculty-allocation.git
   cd falo-faculty-allocation
   ```

4. Follow the setup instructions in [README.md](README.md) to run the project

## Additional Resources

- **Git Official Documentation**: https://git-scm.com/doc
- **Git for Windows**: https://gitforwindows.org/
- **GitHub Git Guides**: https://github.com/git-guides
- **Pro Git Book (Free)**: https://git-scm.com/book/en/v2

## Need More Help?

If you're still experiencing issues:
- Check the [Git for Windows FAQ](https://github.com/git-for-windows/git/wiki/FAQ)
- Visit [Stack Overflow](https://stackoverflow.com/questions/tagged/git) for community support
- Review the project's [README.md](README.md) for project-specific setup instructions

---

**Last Updated**: October 2025  
**Tested On**: Windows 10, Windows 11
