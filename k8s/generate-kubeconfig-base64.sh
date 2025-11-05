#!/bin/bash
# Alternative: Just generate base64 from existing kubeconfig
# Use this if fix-kubeconfig-complete.sh doesn't work

set -e

echo "📋 Generating base64 from current kubeconfig..."
echo ""

# Check kubeconfig exists
if [ ! -f ~/.kube/config ]; then
  echo "❌ ERROR: ~/.kube/config not found!"
  exit 1
fi

# Verify kubeconfig is valid
echo "🔍 Verifying kubeconfig..."
if kubectl config view > /dev/null 2>&1; then
  echo "✅ Kubeconfig is valid"
else
  echo "❌ ERROR: Kubeconfig is invalid!"
  exit 1
fi

# Check if certificates are embedded
echo "🔍 Checking certificate format..."
if kubectl config view --raw | grep -q "certificate-authority-data"; then
  echo "✅ Certificates are embedded (good for GitHub Actions)"
else
  echo "⚠️  WARNING: Certificates are NOT embedded!"
  echo "   Run ./k8s/fix-kubeconfig-complete.sh first to embed certificates"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Generate base64
echo ""
echo "📋 Generating base64..."
BASE64_OUTPUT=$(cat ~/.kube/config | base64 -w 0)

# Verify
echo "🔍 Verifying base64..."
if echo "$BASE64_OUTPUT" | base64 -d > /tmp/test-config.yaml 2>&1; then
  echo "✅ Base64 is valid"
  rm /tmp/test-config.yaml
else
  echo "❌ ERROR: Base64 is invalid!"
  exit 1
fi

# Output
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 BASE64 KUBECONFIG:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "$BASE64_OUTPUT"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Length: ${#BASE64_OUTPUT} characters"
echo "📝 Copy the ENTIRE string above"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

