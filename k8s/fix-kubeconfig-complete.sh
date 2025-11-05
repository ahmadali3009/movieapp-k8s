#!/bin/bash
# Complete fix for kubeconfig: Embed certificates and set localhost for SSH tunnel
# Run this on EC2, then update GitHub KUBE_CONFIG secret

set -e

echo "🔧 Fixing kubeconfig for GitHub Actions SSH tunnel..."
echo ""

# Backup original
cp ~/.kube/config ~/.kube/config.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created"

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
echo "📋 Next step - Generate base64:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cat ~/.kube/config | base64 -w 0
echo ""
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Copy the base64 string above"
echo "   Then update GitHub secret KUBE_CONFIG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

