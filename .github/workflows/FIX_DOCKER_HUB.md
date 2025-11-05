# 🔧 Fix Docker Hub Authentication Error

## ❌ Error

```
Error: Error response from daemon: Get "https://registry-1.docker.io/v2/": unauthorized: incorrect username or password
```

## 🔍 Problem

Docker Hub **no longer accepts passwords** for CLI/GitHub Actions. You must use an **Access Token** instead.

## ✅ Solution: Create Docker Hub Access Token

### Step 1: Create Access Token on Docker Hub

1. Go to **Docker Hub**: https://hub.docker.com
2. Click your **username** (top right) → **Account Settings**
3. Click **Security** (left sidebar)
4. Click **New Access Token**
5. Fill in:
   - **Description**: `GitHub Actions CI/CD` (or any name)
   - **Permissions**: `Read & Write` (for push/pull)
6. Click **Generate**
7. **Copy the token immediately** (you won't see it again!)

The token will look like: `dckr_pat_xxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Update GitHub Secret

1. Go to **GitHub** → **Settings** → **Secrets and variables** → **Actions**
2. Find **`DOCKER_PASSWORD`** secret
3. Click **Update**
4. **Paste the access token** (not your password!)
5. Click **Update secret**

### Step 3: Verify Username

Make sure **`DOCKER_USERNAME`** secret is:
- **Value**: `ahmedbutt3009` (your Docker Hub username)

## 📋 Quick Checklist

- [ ] Created Docker Hub Access Token
- [ ] Updated `DOCKER_PASSWORD` secret with access token (not password)
- [ ] Verified `DOCKER_USERNAME` = `ahmedbutt3009`
- [ ] Tested workflow

## 🔒 Security Notes

- **Access tokens** are safer than passwords
- **Tokens can be revoked** if compromised
- **Each token has specific permissions**
- **Keep tokens secret** (never commit to git)

## 🆘 If Still Failing

### Check Token Permissions:
- Make sure token has **Read & Write** permissions
- If read-only, you can't push images

### Check Username:
- Verify username is correct: `ahmedbutt3009`
- No extra spaces or typos

### Test Locally (Optional):
```bash
# Test login with token
echo "your-access-token" | docker login -u ahmedbutt3009 --password-stdin

# If this works, the token is correct
```

## 📚 Reference

- [Docker Hub Access Tokens](https://docs.docker.com/docker-hub/access-tokens/)
- [GitHub Actions Docker Login](https://github.com/docker/login-action)

