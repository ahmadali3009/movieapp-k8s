#!/bin/bash
# Setup Minikube on EC2 for GitHub Actions Deployment
# Elastic IP: 16.16.89.200

set -e

# Elastic IP for EC2 instance
ELASTIC_IP="16.16.89.200"

echo "🚀 Setting up Minikube for GitHub Actions Deployment"
echo "📍 Using Elastic IP: $ELASTIC_IP"
echo ""

# Get current public IP (should match Elastic IP)
CURRENT_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "📊 Current EC2 Public IP: $CURRENT_IP"

if [ "$CURRENT_IP" != "$ELASTIC_IP" ]; then
  echo "⚠️  Warning: Current IP ($CURRENT_IP) doesn't match Elastic IP ($ELASTIC_IP)"
  echo "   Using Elastic IP for configuration..."
fi

# Stop Minikube if running
echo ""
echo "🛑 Stopping Minikube (if running)..."
minikube stop || true

# Start Minikube with localhost binding (for SSH tunnel from GitHub Actions)
echo ""
echo "▶️  Starting Minikube with localhost binding (for SSH tunnel)..."
minikube start \
  --apiserver-ips=127.0.0.1 \
  --apiserver-port=6443 \
  --extra-config=apiserver.advertise-address=127.0.0.1

# Wait a moment for Minikube to be ready
sleep 5

# Update kubeconfig (GitHub Actions will override to use SSH tunnel)
echo ""
echo "⚙️  Kubeconfig configured (GitHub Actions will use SSH tunnel)..."
kubectl config set-cluster minikube --server=https://127.0.0.1:6443

# Verify configuration
echo ""
echo "✅ Verifying configuration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Cluster server URL:"
kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}'
echo ""
echo ""

# Test connection
echo "🔌 Testing Kubernetes connection..."
if kubectl cluster-info && kubectl get nodes; then
  echo "✅ Connection successful!"
else
  echo "❌ Connection failed!"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Minikube configured successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Generate base64 kubeconfig:"
echo "   cat ~/.kube/config | base64 -w 0"
echo ""
echo "2. Update GitHub secret:"
echo "   - Go to GitHub → Settings → Secrets → Actions"
echo "   - Update KUBE_CONFIG with the base64 string"
echo ""
echo "3. Configure GitHub Secrets:"
echo "   - EC2_HOST = $ELASTIC_IP"
echo "   - EC2_USER = ubuntu"
echo "   - EC2_SSH_KEY = Your SSH private key"
echo "   - KUBE_CONFIG = Base64 kubeconfig (from step 1)"
echo ""
echo "4. EC2 Security Group:"
echo "   - Only needs SSH (port 22) - no need for port 6443!"
echo ""
echo "5. Test deployment:"
echo "   - Push to master branch, or"
echo "   - Manually trigger 'Deploy to Kubernetes' workflow"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

