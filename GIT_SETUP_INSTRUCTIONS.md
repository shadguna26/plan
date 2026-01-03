# Git Setup Instructions

Before committing, you need to configure your Git identity. Run these commands in your terminal:

## Step 1: Configure Git (Required)

Replace with your actual name and email:

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

Or set globally (for all repositories):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 2: Commit Your Files

After configuring Git, run:

```bash
git commit -m "Initial commit: Feedback Intelligence Dashboard with deployment configuration"
```

## Step 3: Create GitHub Repository and Push

1. Go to [github.com](https://github.com) and create a new repository
2. Then run these commands (replace with your repository URL):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Alternative: Quick Setup Script

You can also configure and commit in one go, but you'll need to provide your name and email first.

---

**Note:** If you've already configured Git globally before, you can skip Step 1 and just run the commit command.

