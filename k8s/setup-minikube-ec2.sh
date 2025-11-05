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

# Start Minikube with Elastic IP binding
echo ""
echo "▶️  Starting Minikube with Elastic IP: $ELASTIC_IP"
minikube start \
  --apiserver-ips=$ELASTIC_IP \
  --apiserver-port=6443 \
  --extra-config=apiserver.advertise-address=$ELASTIC_IP

# Wait a moment for Minikube to be ready
sleep 5

# Update kubeconfig to use Elastic IP
echo ""
echo "⚙️  Updating kubeconfig to use Elastic IP..."
kubectl config set-cluster minikube --server=https://$ELASTIC_IP:6443

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
echo "3. Open EC2 Security Group:"
echo "   - Allow inbound port 6443 (TCP) from 0.0.0.0/0"
echo "   - Or restrict to GitHub Actions IP ranges"
echo ""
echo "4. Test deployment:"
echo "   - Push to master branch, or"
echo "   - Manually trigger 'Deploy to Kubernetes' workflow"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

