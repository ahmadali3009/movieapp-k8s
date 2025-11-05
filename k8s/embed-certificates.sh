#!/bin/bash
# Embed Minikube certificates inline in kubeconfig for GitHub Actions
# This makes kubeconfig self-contained (no external file references)

ELASTIC_IP="16.16.89.200"

echo "🔧 Embedding certificates in kubeconfig..."

# Backup
cp ~/.kube/config ~/.kube/config.backup
echo "✅ Backup saved to ~/.kube/config.backup"

# Set server to Elastic IP
kubectl config set-cluster minikube --server="https://$ELASTIC_IP:6443"

# Embed CA certificate
if [ -f ~/.minikube/ca.crt ]; then
  kubectl config set clusters.minikube.certificate-authority-data "$(cat ~/.minikube/ca.crt | base64 -w 0)"
  kubectl config unset clusters.minikube.certificate-authority
  echo "✅ CA certificate embedded"
else
  echo "❌ CA certificate not found: ~/.minikube/ca.crt"
fi

# Embed client certificate
if [ -f ~/.minikube/profiles/minikube/client.crt ]; then
  kubectl config set users.minikube.client-certificate-data "$(cat ~/.minikube/profiles/minikube/client.crt | base64 -w 0)"
  kubectl config unset users.minikube.client-certificate
  echo "✅ Client certificate embedded"
else
  echo "❌ Client certificate not found"
fi

# Embed client key
if [ -f ~/.minikube/profiles/minikube/client.key ]; then
  kubectl config set users.minikube.client-key-data "$(cat ~/.minikube/profiles/minikube/client.key | base64 -w 0)"
  kubectl config unset users.minikube.client-key
  echo "✅ Client key embedded"
else
  echo "❌ Client key not found"
fi

echo ""
echo "✅ Kubeconfig updated!"
echo ""
echo "📋 Generate base64 for GitHub:"
echo "cat ~/.kube/config | base64 -w 0"

