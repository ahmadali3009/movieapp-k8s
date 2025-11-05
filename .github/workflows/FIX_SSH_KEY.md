# 🔧 Fix SSH Key Format Error

## ❌ Error

```
Load key "/home/runner/.ssh/ec2_key.pem": error in libcrypto
Permission denied (publickey).
```

## 🔍 Problem

The `EC2_SSH_KEY` secret in GitHub has formatting issues. The SSH key must be properly formatted.

## ✅ Solution

### Step 1: Get Your SSH Private Key

On your local machine, get the SSH private key file (usually `~/.ssh/id_rsa` or the key you use to connect to EC2):

```bash
# On Windows (PowerShell)
cat C:\Users\YourUsername\.ssh\your-key-file

# Or if you have the key file path
cat path\to\your-key.pem
```

### Step 2: Check Key Format

The key should start with one of these:
- `-----BEGIN OPENSSH PRIVATE KEY-----`
- `-----BEGIN RSA PRIVATE KEY-----`
- `-----BEGIN PRIVATE KEY-----`

### Step 3: Copy Entire Key

Copy the **entire** key including:
- The `-----BEGIN...-----` line
- All the key content (middle lines)
- The `-----END...-----` line

**Important:** 
- Copy **all lines** (including BEGIN/END headers)
- No extra spaces
- No line breaks in the middle
- Keep the original line structure

### Step 4: Update GitHub Secret

1. Go to **GitHub** → **Settings** → **Secrets and variables** → **Actions**
2. Find **`EC2_SSH_KEY`** secret
3. Click **Update**
4. **Paste the entire key** (all lines)
5. Click **Update secret**

### Step 5: Verify Format

After updating, the workflow should show:
- ✅ "SSH key format verified"
- ✅ "SSH tunnel started"

## 📋 Example Key Format

Your key should look like this:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAYEAyZ7x... (many lines) ...
-----END OPENSSH PRIVATE KEY-----
```

Or:

```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA... (many lines) ...
-----END RSA PRIVATE KEY-----
```

## ⚠️ Common Mistakes

1. **Missing BEGIN/END lines** - Must include both
2. **Extra spaces** - No leading/trailing spaces
3. **Line breaks removed** - Keep original line structure
4. **Only part of key** - Copy the entire key
5. **Wrong key** - Use private key, not public key

## 🔍 How to Verify Locally

Test your key works:

```bash
# Test SSH connection
ssh -i your-key.pem ubuntu@16.16.89.200

# If this works, the key format is correct
```

## 🆘 If Still Failing

1. **Regenerate key** (if needed):
   ```bash
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/ec2_deploy_key
   ```

2. **Copy public key to EC2**:
   ```bash
   ssh-copy-id -i ~/.ssh/ec2_deploy_key.pub ubuntu@16.16.89.200
   ```

3. **Use the private key** (`ec2_deploy_key`) in GitHub secret

## ✅ After Fixing

The workflow should now:
1. ✅ Verify SSH key format
2. ✅ Start SSH tunnel successfully
3. ✅ Connect to Minikube through tunnel

