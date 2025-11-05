#!/bin/bash
# Complete fix for kubeconfig: Embed certificates and set localhost for SSH tunnel
# Run this on EC2, then update GitHub KUBE_CONFIG secret

set -e

echo "🔧 Fixing kubeconfig for GitHub Actions SSH tunnel..."
echo ""

# Check if running on correct system
if [ ! -f ~/.kube/config ]; then
  echo "❌ ERROR: ~/.kube/config not found!"
  echo "   Make sure you're running this on EC2 where Minikube is installed"
  exit 1
fi

# Backup original
cp ~/.kube/config ~/.kube/config.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created: ~/.kube/config.backup.$(date +%Y%m%d_%H%M%S)"

# Step 1: Embed CA certificate
echo "📝 Embedding CA certificate..."
if [ -f ~/.minikube/ca.crt ]; then
  kubectl config set clusters.minikube.certificate-authority-data "$(cat ~/.minikube/ca.crt | base64 -w 0)"
  kubectl config unset clusters.minikube.certificate-authority 2>/dev/null || true
  echo "✅ CA certificate embedded"
else
  echo "❌ CA certificate not found: ~/.minikube/ca.crt"
  exit 1
fi

# Step 2: Embed client certificate
echo "📝 Embedding client certificate..."
if [ -f ~/.minikube/profiles/minikube/client.crt ]; then
  kubectl config set users.minikube.client-certificate-data "$(cat ~/.minikube/profiles/minikube/client.crt | base64 -w 0)"
  kubectl config unset users.minikube.client-certificate 2>/dev/null || true
  echo "✅ Client certificate embedded"
else
  echo "❌ Client certificate not found: ~/.minikube/profiles/minikube/client.crt"
  exit 1
fi

# Step 3: Embed client key
echo "📝 Embedding client key..."
if [ -f ~/.minikube/profiles/minikube/client.key ]; then
  kubectl config set users.minikube.client-key-data "$(cat ~/.minikube/profiles/minikube/client.key | base64 -w 0)"
  kubectl config unset users.minikube.client-key 2>/dev/null || true
  echo "✅ Client key embedded"
else
  echo "❌ Client key not found: ~/.minikube/profiles/minikube/client.key"
  exit 1
fi

# Step 4: Set server to localhost (GitHub Actions will use SSH tunnel)
echo "📝 Setting cluster server to localhost:6443..."
kubectl config set-cluster minikube --server=https://127.0.0.1:6443

# Step 5: Verify
echo ""
echo "✅ Verification:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if certificates are embedded
CA_DATA=$(kubectl config view --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}' 2>/dev/null || echo "")
if [ -n "$CA_DATA" ]; then
  echo "✅ CA certificate is embedded (data field exists)"
else
  echo "❌ CA certificate NOT embedded (still has file path)"
  exit 1
fi

CLIENT_CERT_DATA=$(kubectl config view --raw -o jsonpath='{.users[0].user.client-certificate-data}' 2>/dev/null || echo "")
if [ -n "$CLIENT_CERT_DATA" ]; then
  echo "✅ Client certificate is embedded (data field exists)"
else
  echo "❌ Client certificate NOT embedded (still has file path)"
  exit 1
fi

CLIENT_KEY_DATA=$(kubectl config view --raw -o jsonpath='{.users[0].user.client-key-data}' 2>/dev/null || echo "")
if [ -n "$CLIENT_KEY_DATA" ]; then
  echo "✅ Client key is embedded (data field exists)"
else
  echo "❌ Client key NOT embedded (still has file path)"
  exit 1
fi

# Check server URL
SERVER_URL=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}' 2>/dev/null || echo "")
echo "✅ Cluster server: $SERVER_URL"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Kubeconfig is ready!"
echo ""
echo "📋 Generating clean base64 (no line breaks, no spaces)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 6: Final verification of kubeconfig
echo ""
echo "🔍 Final kubeconfig verification..."
if kubectl config view > /dev/null 2>&1; then
  echo "✅ Kubeconfig is valid YAML"
else
  echo "❌ ERROR: Kubeconfig is invalid!"
  kubectl config view 2>&1 | head -20
  exit 1
fi

# Step 7: Generate base64
echo ""
echo "📋 Generating base64..."
BASE64_OUTPUT=$(cat ~/.kube/config | base64 -w 0)

# Verify base64 is valid by decoding it
echo "🔍 Verifying base64 is valid..."
DECODED=$(echo "$BASE64_OUTPUT" | base64 -d 2>&1)
if [ $? -eq 0 ]; then
  # Check if decoded output is valid YAML
  if echo "$DECODED" | grep -q "apiVersion:" && echo "$DECODED" | grep -q "clusters:"; then
    echo "✅ Base64 is valid and decodes to valid kubeconfig"
  else
    echo "❌ ERROR: Base64 decodes but kubeconfig is invalid!"
    echo "$DECODED" | head -10
    exit 1
  fi
else
  echo "❌ ERROR: Base64 is invalid - cannot decode!"
  echo "$DECODED"
  exit 1
fi

# Clean base64 (remove any accidental line breaks/spaces)
BASE64_CLEAN=$(echo "$BASE64_OUTPUT" | tr -d '\n' | tr -d ' ' | tr -d '\r')

# Verify cleaned version is still valid
echo "$BASE64_CLEAN" | base64 -d > /tmp/final-verify.yaml 2>&1
if [ $? -ne 0 ]; then
  echo "⚠️  Warning: Cleaning broke base64, using original"
  BASE64_CLEAN="$BASE64_OUTPUT"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SUCCESS! Kubeconfig is ready"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Copy the ENTIRE string below (it's ONE continuous line):"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$BASE64_CLEAN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Stats:"
echo "   Length: ${#BASE64_CLEAN} characters"
echo "   First 50 chars: ${BASE64_CLEAN:0:50}..."
echo "   Last 50 chars: ...${BASE64_CLEAN: -50}"
echo ""
echo "📝 Instructions:"
echo "   1. Select the ENTIRE string between the separator lines above"
echo "   2. Copy it (Ctrl+C or right-click → Copy)"
echo "   3. Go to GitHub → Settings → Secrets → Actions"
echo "   4. Update KUBE_CONFIG secret"
echo "   5. Paste the ENTIRE string (should be one line in the text box)"
echo "   6. Click Update secret"
echo ""
echo "⚠️  CRITICAL: Make sure you copy from the first character to the last"
echo "   No line breaks, no spaces, no extra characters"
echo ""
echo "💡 Alternative: Save to file to avoid copy issues:"
echo "$BASE64_CLEAN" > /tmp/kubeconfig-base64.txt
echo "   ✅ Saved to: /tmp/kubeconfig-base64.txt"
echo "   View it: cat /tmp/kubeconfig-base64.txt"
echo "   Copy from file to avoid terminal issues"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Script completed successfully!"
echo "   Next: Update GitHub KUBE_CONFIG secret"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

