# 🔧 Fix Base64 Encoding Error

## ❌ Error

```
error: error loading config file: illegal base64 data at input byte 2060
```

## 🔍 Problem

The base64 string in `KUBE_CONFIG` GitHub secret is **corrupted** or has **invalid characters**. This happens when:
- Copy/paste added extra characters
- Line breaks were included
- Special characters corrupted the string
- Base64 encoding was incomplete

## ✅ Solution: Regenerate Base64 Kubeconfig

### Step 1: On EC2, Fix Kubeconfig First

```bash
# Run the fix script to embed certificates
chmod +x k8s/fix-kubeconfig-complete.sh
./k8s/fix-kubeconfig-complete.sh
```

This will output a clean base64 string at the end.

### Step 2: Copy Base64 String Correctly

**IMPORTANT**: When copying the base64 string:

1. **Copy the ENTIRE string** (it's one long line)
2. **No line breaks** - should be continuous
3. **No spaces** - remove any spaces
4. **Start to end** - copy from first character to last
5. **No extra characters** - only the base64 characters

### Step 3: Verify Base64 String

Before pasting into GitHub, verify it's valid:

```bash
# On EC2, after generating base64
BASE64_STRING=$(cat ~/.kube/config | base64 -w 0)

# Verify it's valid base64
echo "$BASE64_STRING" | base64 -d > /tmp/test-config.yaml 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Base64 is valid"
else
  echo "❌ Base64 is invalid"
  exit 1
fi
```

### Step 4: Update GitHub Secret

1. Go to **GitHub** → **Settings** → **Secrets** → **Actions**
2. Find **`KUBE_CONFIG`**
3. Click **Update**
4. **Delete the old value completely**
5. **Paste the new base64 string** (one continuous line)
6. **Verify no line breaks** (should be all on one line in the text box)
7. Click **Update secret**

## 🔍 Common Issues

### Issue 1: Line Breaks in Base64
- **Problem**: Base64 string has `\n` or line breaks
- **Fix**: Remove all line breaks, make it one continuous line

### Issue 2: Extra Spaces
- **Problem**: Spaces in the base64 string
- **Fix**: Remove all spaces

### Issue 3: Incomplete Copy
- **Problem**: Only copied part of the string
- **Fix**: Copy the entire output from the script

### Issue 4: Special Characters
- **Problem**: Copy/paste added invisible characters
- **Fix**: Use the script output directly, don't edit it

## 📋 Quick Fix Script

Run this on EC2 to generate a clean base64:

```bash
#!/bin/bash
# Generate clean base64 kubeconfig

# First, make sure kubeconfig is fixed
./k8s/fix-kubeconfig-complete.sh

# Then generate clean base64 (no line breaks, no spaces)
BASE64_OUTPUT=$(cat ~/.kube/config | base64 -w 0 | tr -d '\n' | tr -d ' ')

# Verify it's valid
echo "$BASE64_OUTPUT" | base64 -d > /tmp/verify-config.yaml 2>&1
if [ $? -eq 0 ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ Valid base64 kubeconfig:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "$BASE64_OUTPUT"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 Copy the ENTIRE string above (no line breaks)"
else
  echo "❌ Invalid base64 - check kubeconfig file"
  exit 1
fi
```

## ✅ After Fixing

The workflow should show:
```
✅ Kubeconfig has embedded certificates
✅ Kubeconfig updated to use SSH tunnel (127.0.0.1:6443)
✅ Cluster connection successful
```

## 🆘 If Still Failing

1. **Check kubeconfig file on EC2**:
   ```bash
   cat ~/.kube/config | head -20
   # Should show valid YAML
   ```

2. **Regenerate base64**:
   ```bash
   cat ~/.kube/config | base64 -w 0 > kubeconfig-base64.txt
   cat kubeconfig-base64.txt
   # Copy this entire output
   ```

3. **Test base64 locally** (if you have kubectl):
   ```bash
   echo "your-base64-string" | base64 -d | kubectl config view
   # Should show valid config
   ```

