# 🔧 Step-by-Step Fix for Kubeconfig (6th Time!)

## 🎯 Complete Solution - Follow These Steps Exactly

Since you've tried 6 times, let's do this step-by-step with verification at each step.

---

## Step 1: SSH into EC2

```bash
ssh ubuntu@16.16.89.200
```

---

## Step 2: Verify Minikube is Running

```bash
# Check Minikube status
minikube status

# Should show: Running
# If not, start it:
minikube start --apiserver-ips=127.0.0.1 --apiserver-port=6443
```

---

## Step 3: Check Certificate Files Exist

```bash
# Verify all certificate files exist
ls -la ~/.minikube/ca.crt
ls -la ~/.minikube/profiles/minikube/client.crt
ls -la ~/.minikube/profiles/minikube/client.key

# All should show files (not "No such file")
```

---

## Step 4: Run the Fix Script

```bash
# Make executable
chmod +x k8s/fix-kubeconfig-complete.sh

# Run it
./k8s/fix-kubeconfig-complete.sh
```

**What to look for:**
- ✅ "CA certificate embedded"
- ✅ "Client certificate embedded"  
- ✅ "Client key embedded"
- ✅ "Base64 is valid and decodes to valid kubeconfig"
- ✅ "SUCCESS! Kubeconfig is ready"

**If you see errors**, stop and check what's missing.

---

## Step 5: Copy Base64 String

### Option A: Copy from Terminal Output

The script will output the base64 between separator lines:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[LONG BASE64 STRING HERE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**IMPORTANT:**
1. Select from the first character after the first separator
2. Select to the last character before the second separator
3. Copy (Ctrl+Shift+C or right-click → Copy)
4. **Verify length** - should be thousands of characters

### Option B: Copy from File (RECOMMENDED - Avoids Copy Issues)

The script saves it to a file:

```bash
# View the file
cat /tmp/kubeconfig-base64.txt

# Copy from file (more reliable)
# Select all text in the file and copy
```

---

## Step 6: Update GitHub Secret

1. Go to **GitHub** → Your Repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Find **`KUBE_CONFIG`**
4. Click **Update**
5. **DELETE the old value completely** (select all, delete)
6. **Paste the new base64 string**
7. **Verify in the text box:**
   - Should be **one continuous line**
   - **No line breaks visible**
   - **No spaces at start/end**
8. Click **Update secret**

---

## Step 7: Verify Secret Was Updated

After updating, check the workflow will show:
- ✅ "Kubeconfig has embedded certificates"
- ✅ "Kubeconfig updated to use SSH tunnel"
- ✅ "Cluster connection successful"

---

## 🆘 Troubleshooting

### If Script Fails

**Error: "certificate not found"**
```bash
# Check Minikube is running
minikube status

# Check files exist
ls -la ~/.minikube/ca.crt
ls -la ~/.minikube/profiles/minikube/

# If files missing, restart Minikube
minikube stop
minikube start
```

**Error: "Base64 is invalid"**
```bash
# Check kubeconfig is valid
kubectl config view

# If errors, restore backup
cp ~/.kube/config.backup.* ~/.kube/config
```

### If Base64 Copy Fails

**Use the file method:**
```bash
# Script saves to file automatically
cat /tmp/kubeconfig-base64.txt | wc -c  # Shows character count

# Copy from file using a text editor or:
cat /tmp/kubeconfig-base64.txt | xclip -selection clipboard  # If xclip installed
```

### If GitHub Secret Still Fails

**Check the secret value:**
1. The workflow will show what it received
2. Look for "illegal base64 data" error
3. If still failing, the base64 in secret is corrupted

**Regenerate and try again:**
```bash
# Run script again
./k8s/fix-kubeconfig-complete.sh

# Use the file output this time
cat /tmp/kubeconfig-base64.txt
```

---

## ✅ Final Checklist

Before running workflow:
- [ ] Minikube is running on EC2
- [ ] Certificate files exist (~/.minikube/ca.crt, etc.)
- [ ] Script ran successfully with all ✅ checks
- [ ] Base64 string copied (from file or terminal)
- [ ] GitHub secret updated with new base64
- [ ] Secret shows as one line (no breaks)
- [ ] EC2_HOST and EC2_USER secrets are set
- [ ] EC2_SSH_KEY secret is set (with BEGIN/END lines)

---

## 🎯 Why This Will Work

The script now:
1. ✅ **Validates certificates exist** before embedding
2. ✅ **Verifies embedding worked** (checks for -data fields)
3. ✅ **Validates base64** by decoding it
4. ✅ **Validates decoded kubeconfig** is valid YAML
5. ✅ **Saves to file** to avoid copy/paste issues
6. ✅ **Shows stats** (length, first/last chars) for verification

This should fix it on the first try if you follow the steps exactly!

