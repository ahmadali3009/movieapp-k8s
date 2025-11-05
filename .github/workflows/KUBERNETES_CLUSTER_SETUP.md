# 🔧 Fixing Kubernetes Cluster Connection Issue

## ❌ Current Problem

Your kubeconfig is pointing to a **local Docker Desktop Kubernetes cluster** (`kubernetes.docker.internal:6443`), which GitHub Actions cannot access.

**Error:**
```
dial tcp: lookup kubernetes.docker.internal on 127.0.0.53:53: no such host
```

## ✅ Solution: Use a Remote/Cloud Kubernetes Cluster

GitHub Actions needs to connect to a **remote/cloud Kubernetes cluster** that is publicly accessible. Here are your options:

---

## 🚀 Option 1: AWS EKS (Elastic Kubernetes Service) - Recommended

### Step 1: Create EKS Cluster
```bash
# Install AWS CLI and eksctl
# Create cluster
eksctl create cluster \
  --name movieapp-cluster \
  --region us-east-1 \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 3
```

### Step 2: Get kubeconfig
```bash
# Update kubeconfig
aws eks update-kubeconfig --name movieapp-cluster --region us-east-1

# Verify
kubectl cluster-info
# Should show: https://xxx.xxx.eks.amazonaws.com
```

### Step 3: Generate Base64 kubeconfig
```bash
# On Linux/Mac
cat ~/.kube/config | base64 -w 0

# On Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("$env:USERPROFILE\.kube\config"))
```

### Step 4: Update GitHub Secret
- Go to GitHub → Settings → Secrets → Actions
- Update `KUBE_CONFIG` with the new base64 string

---

## 🚀 Option 2: Google Cloud GKE

### Step 1: Create GKE Cluster
```bash
gcloud container clusters create movieapp-cluster \
  --zone us-central1-a \
  --num-nodes 2 \
  --machine-type n1-standard-2
```

### Step 2: Get kubeconfig
```bash
gcloud container clusters get-credentials movieapp-cluster --zone us-central1-a
kubectl cluster-info
```

### Step 3: Generate Base64 and update GitHub secret
(Same as EKS steps 3-4)

---

## 🚀 Option 3: Azure AKS

### Step 1: Create AKS Cluster
```bash
az aks create \
  --resource-group movieapp-rg \
  --name movieapp-cluster \
  --node-count 2 \
  --enable-addons monitoring
```

### Step 2: Get kubeconfig
```bash
az aks get-credentials --resource-group movieapp-rg --name movieapp-cluster
kubectl cluster-info
```

### Step 3: Generate Base64 and update GitHub secret
(Same as EKS steps 3-4)

---

## 🚀 Option 4: DigitalOcean Kubernetes

### Step 1: Create Cluster
- Go to DigitalOcean Dashboard → Kubernetes → Create Cluster
- Choose region, node size, and node count

### Step 2: Get kubeconfig
```bash
# Download kubeconfig from DigitalOcean dashboard
# Or use doctl
doctl kubernetes cluster kubeconfig save movieapp-cluster
kubectl cluster-info
```

### Step 3: Generate Base64 and update GitHub secret
(Same as EKS steps 3-4)

---

## 🚀 Option 5: Minikube with Port Forwarding (NOT Recommended for Production)

⚠️ **This is only for testing and is NOT recommended for production CI/CD**

If you want to test with a local cluster, you'd need to:
1. Set up port forwarding/SSH tunnel
2. Expose your local cluster
3. Use a dynamic DNS service

**This is complex and unreliable. Use a cloud cluster instead.**

---

## ✅ Verification Steps

After updating the `KUBE_CONFIG` secret:

1. **Check the cluster server URL:**
   ```bash
   # The workflow will now show the cluster server
   # It should NOT be "kubernetes.docker.internal"
   # It should be something like:
   # - https://xxx.xxx.xxx.eks.amazonaws.com (EKS)
   # - https://xxx.xxx.xxx.xxx:6443 (GKE/AKS)
   ```

2. **Test locally:**
   ```bash
   kubectl cluster-info
   kubectl get nodes
   ```

3. **Push to trigger workflow:**
   ```bash
   git push origin master
   ```

4. **Check GitHub Actions:**
   - Go to Actions tab
   - Look for "🔍 Checking kubeconfig..." message
   - Verify the cluster server URL is a remote/public URL

---

## 💰 Cost Considerations

### Free/Cheap Options:
- **DigitalOcean**: ~$12/month for smallest cluster
- **AWS EKS**: Free cluster, pay for nodes (~$30-50/month for 2 small nodes)
- **Google GKE**: Free tier available, then pay per use
- **Azure AKS**: Free cluster, pay for nodes

### For Testing:
- Use the smallest node sizes
- Delete clusters when not in use
- Use cloud provider free tiers

---

## 🔒 Security Notes

1. **Kubeconfig contains sensitive credentials** - Never commit it to git
2. **Use GitHub Secrets** - Always store kubeconfig as a secret
3. **Rotate credentials** - Regularly update your kubeconfig
4. **Limit access** - Use RBAC to restrict what the CI/CD can do

---

## 📝 Quick Checklist

- [ ] Create a cloud Kubernetes cluster (EKS/GKE/AKS/DigitalOcean)
- [ ] Get kubeconfig: `kubectl config view`
- [ ] Generate base64: `cat ~/.kube/config | base64 -w 0`
- [ ] Update GitHub secret `KUBE_CONFIG`
- [ ] Verify cluster server is NOT `kubernetes.docker.internal`
- [ ] Test connection: `kubectl cluster-info`
- [ ] Push to trigger workflow
- [ ] Check GitHub Actions logs

---

## 🆘 Troubleshooting

### Still getting "no such host" error?
- ✅ Verify kubeconfig points to a remote cluster (not local)
- ✅ Check the cluster server URL in the workflow logs
- ✅ Ensure cluster is running and accessible
- ✅ Verify firewall/security groups allow access

### Connection timeout?
- Check network security groups/firewalls
- Verify cluster API server is publicly accessible
- Check if VPN is required (some clusters need VPN)

### Authentication failed?
- Regenerate kubeconfig
- Check if credentials expired
- Verify RBAC permissions

---

## 📚 Resources

- [AWS EKS Setup](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html)
- [Google GKE Setup](https://cloud.google.com/kubernetes-engine/docs/quickstart)
- [Azure AKS Setup](https://docs.microsoft.com/azure/aks/kubernetes-walkthrough)
- [DigitalOcean Kubernetes](https://docs.digitalocean.com/products/kubernetes/)

