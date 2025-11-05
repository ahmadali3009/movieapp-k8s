# 🔧 Fix Kubeconfig Certificate Error

## ❌ Error

```
unable to read client-cert /home/***/.minikube/profiles/minikube/client.crt
unable to read client-key /home/***/.minikube/profiles/minikube/client.key
unable to read certificate-authority /home/***/.minikube/ca.crt
```

## 🔍 Problem

The kubeconfig has **file path references** to certificates on EC2, but GitHub Actions can't access those files. Even with SSH tunnel, kubectl needs the certificates **embedded in the kubeconfig**.

## ✅ Solution: Embed Certificates in Kubeconfig

### On Your EC2 Instance, Run:

```bash
# Run the embed-certificates script
chmod +x k8s/embed-certificates.sh
./k8s/embed-certificates.sh
```

### Or Run These Commands Manually:

```bash
# Embed CA certificate
kubectl config set clusters.minikube.certificate-authority-data "$(cat ~/.minikube/ca.crt | base64 -w 0)"
kubectl config unset clusters.minikube.certificate-authority

# Embed client certificate
kubectl config set users.minikube.client-certificate-data "$(cat ~/.minikube/profiles/minikube/client.crt | base64 -w 0)"
kubectl config unset users.minikube.client-certificate

# Embed client key
kubectl config set users.minikube.client-key-data "$(cat ~/.minikube/profiles/minikube/client.key | base64 -w 0)"
kubectl config unset users.minikube.client-key

# Verify certificates are embedded (should show -data fields)
kubectl config view --raw | grep -E "certificate-authority-data|client-certificate-data|client-key-data"

# Generate base64 kubeconfig
cat ~/.kube/config | base64 -w 0
```

## 📋 Step-by-Step

### Step 1: SSH into EC2

```bash
ssh ubuntu@16.16.89.200
```

### Step 2: Check Current Kubeconfig

```bash
# See if it has file paths
kubectl config view --raw | grep -E "certificate-authority:|client-certificate:|client-key:"
```

If you see file paths (like `/home/ubuntu/.minikube/...`), you need to embed them.

### Step 3: Embed Certificates

```bash
# Make sure certificates exist
ls -la ~/.minikube/ca.crt
ls -la ~/.minikube/profiles/minikube/client.crt
ls -la ~/.minikube/profiles/minikube/client.key

# Embed them
kubectl config set clusters.minikube.certificate-authority-data "$(cat ~/.minikube/ca.crt | base64 -w 0)"
kubectl config unset clusters.minikube.certificate-authority

kubectl config set users.minikube.client-certificate-data "$(cat ~/.minikube/profiles/minikube/client.crt | base64 -w 0)"
kubectl config unset users.minikube.client-certificate

kubectl config set users.minikube.client-key-data "$(cat ~/.minikube/profiles/minikube/client.key | base64 -w 0)"
kubectl config unset users.minikube.client-key
```

### Step 4: Verify

```bash
# Should show -data fields (not file paths)
kubectl config view --raw | grep -E "certificate-authority-data|client-certificate-data|client-key-data"

# Should show base64 strings
```

### Step 5: Generate Base64 Kubeconfig

```bash
cat ~/.kube/config | base64 -w 0
```

### Step 6: Update GitHub Secret

1. Copy the base64 output from Step 5
2. Go to **GitHub** → **Settings** → **Secrets** → **Actions**
3. Update **`KUBE_CONFIG`** with the new base64 string
4. Save

## ✅ After Fixing

The workflow should show:
- ✅ SSH tunnel started
- ✅ Kubeconfig updated to use SSH tunnel
- ✅ Cluster connection successful
- ✅ `kubectl get nodes` works

## 🔍 Verify Before/After

### Before (has file paths):
```yaml
certificate-authority: /home/ubuntu/.minikube/ca.crt
client-certificate: /home/ubuntu/.minikube/profiles/minikube/client.crt
client-key: /home/ubuntu/.minikube/profiles/minikube/client.key
```

### After (has embedded data):
```yaml
certificate-authority-data: LS0tLS1CRUdJTi... (base64 string)
client-certificate-data: LS0tLS1CRUdJTi... (base64 string)
client-key-data: LS0tLS1CRUdJTi... (base64 string)
```

## 🆘 If Still Failing

1. **Check certificates exist**:
   ```bash
   ls -la ~/.minikube/ca.crt
   ls -la ~/.minikube/profiles/minikube/client.crt
   ```

2. **Check Minikube is running**:
   ```bash
   minikube status
   ```

3. **Verify kubeconfig**:
   ```bash
   kubectl config view --raw
   ```

