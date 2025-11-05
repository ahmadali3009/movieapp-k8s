# 🔧 Minikube on EC2 Setup for GitHub Actions

## 📍 EC2 Configuration

- **Elastic IP**: `16.16.89.200`
- **Private IP**: `172.31.1.98`
- **Purpose**: Public endpoint for SSH, Minikube, and CI/CD deployment

## 🚀 Quick Setup

### Step 1: SSH into EC2

```bash
ssh -i your-key.pem ec2-user@16.16.89.200
```

### Step 2: Run Setup Script

```bash
# Make script executable
chmod +x k8s/setup-minikube-ec2.sh

# Run the setup script
./k8s/setup-minikube-ec2.sh
```

Or run the commands manually:

```bash
# Elastic IP
ELASTIC_IP="16.16.89.200"

# Stop Minikube
minikube stop

# Start Minikube with Elastic IP
minikube start \
  --apiserver-ips=$ELASTIC_IP \
  --apiserver-port=6443 \
  --extra-config=apiserver.advertise-address=$ELASTIC_IP

# Update kubeconfig
kubectl config set-cluster minikube --server=https://$ELASTIC_IP:6443

# Verify
kubectl cluster-info
kubectl get nodes
```

### Step 3: Generate Base64 Kubeconfig

```bash
cat ~/.kube/config | base64 -w 0
```

Copy the entire output.

### Step 4: Update GitHub Secret

1. Go to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Find `KUBE_CONFIG` secret
3. Click **Update**
4. Paste the base64 string from Step 3
5. Click **Update secret**

### Step 5: Configure EC2 Security Group

1. Go to **AWS Console** → **EC2** → **Security Groups**
2. Select your EC2 instance's security group
3. Click **Edit inbound rules**
4. Add rule:
   - **Type**: Custom TCP
   - **Port**: `6443`
   - **Source**: `0.0.0.0/0` (or restrict to GitHub Actions IPs)
   - **Description**: "Kubernetes API for GitHub Actions"
5. Click **Save rules**

## ✅ Verification

### Test from EC2:
```bash
kubectl cluster-info
# Should show: Kubernetes control plane is running at https://16.16.89.200:6443

kubectl get nodes
# Should show your Minikube node
```

### Test from GitHub Actions:

1. Push to `master` branch, or
2. Manually trigger "Deploy to Kubernetes" workflow
3. Check the workflow logs for:
   - ✅ "Checking kubeconfig..." should show `https://16.16.89.200:6443`
   - ✅ "Attempting to connect to cluster..." should succeed
   - ✅ Deployment should complete

## 🔄 Workflow Configuration

### EC2 Deployment (`deploy-ec2.yml`)
- Default EC2 host: `16.16.89.200` (Elastic IP)
- Can be overridden when manually triggering

### Kubernetes Deployment (`deploy-k8s.yml`)
- Uses `KUBE_CONFIG` secret
- Kubeconfig should point to: `https://16.16.89.200:6443`

## 🐛 Troubleshooting

### Issue: "no such host" error
**Solution**: Make sure Minikube is configured with Elastic IP:
```bash
kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}'
# Should show: https://16.16.89.200:6443
```

### Issue: Connection timeout
**Solutions**:
1. Check EC2 security group allows port 6443
2. Verify Minikube is running: `minikube status`
3. Check firewall rules: `sudo ufw status`

### Issue: Minikube not starting
**Solution**: Check Minikube logs:
```bash
minikube logs
minikube status
```

### Issue: Wrong IP in kubeconfig
**Solution**: Update kubeconfig:
```bash
kubectl config set-cluster minikube --server=https://16.16.89.200:6443
```

## 📝 Notes

- **Elastic IP** (`16.16.89.200`) is static and won't change
- This is better than using dynamic public IP
- Make sure Elastic IP is associated with your EC2 instance
- Port 6443 must be open in security group for GitHub Actions to connect

## 🔒 Security Recommendations

1. **Restrict Security Group**: Instead of `0.0.0.0/0`, consider:
   - GitHub Actions IP ranges (if known)
   - Your office/home IP
   - VPN IP range

2. **Use SSH Tunnel** (Alternative): More secure but requires workflow changes

3. **Enable TLS**: Ensure Minikube uses proper certificates

## 📚 Related Files

- `k8s/setup-minikube-ec2.sh` - Automated setup script
- `.github/workflows/deploy-k8s.yml` - Kubernetes deployment workflow
- `.github/workflows/deploy-ec2.yml` - EC2 deployment workflow

