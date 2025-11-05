# 🔐 SSH Tunnel Setup for Kubernetes Deployment

## ✅ What's Configured

The workflows now use **SSH tunnel** to securely connect to Minikube on EC2. This is more secure than exposing port 6443 publicly.

## 📋 Required GitHub Secrets

Make sure these secrets are set:

1. **`EC2_HOST`** = `16.16.89.200` (Elastic IP)
2. **`EC2_USER`** = `ubuntu`
3. **`EC2_SSH_KEY`** = Your EC2 private SSH key
4. **`KUBE_CONFIG`** = Base64-encoded kubeconfig (can use original with file paths)

## 🔄 How It Works

```
GitHub Actions Runner
    ↓ SSH Tunnel (port 6443)
EC2 Instance (localhost:6443)
    ↓
Minikube API Server
```

1. **SSH tunnel** forwards `localhost:6443` on GitHub Actions → `localhost:6443` on EC2
2. **kubeconfig** is updated to point to `https://127.0.0.1:6443`
3. All `kubectl` commands go through the tunnel
4. **Tunnel closes automatically** when workflow finishes

## 🔧 EC2 Configuration

### Minikube should be configured to listen on localhost:

```bash
# On EC2, make sure Minikube listens on localhost
minikube start \
  --apiserver-ips=127.0.0.1 \
  --apiserver-port=6443
```

### Or if already running, update it:

```bash
# Stop and restart with localhost binding
minikube stop
minikube start \
  --apiserver-ips=127.0.0.1 \
  --apiserver-port=6443
```

## 🔒 Security Benefits

- ✅ **No need to expose port 6443** publicly
- ✅ **No need to embed certificates** in kubeconfig
- ✅ **Uses existing SSH access** (port 22)
- ✅ **Tunnel closes automatically** after deployment

## 📝 Notes

- **EC2 Security Group**: Only needs port 22 (SSH) open, not 6443
- **Kubeconfig**: Can use original file paths (certificates stay on EC2)
- **Tunnel**: Automatically closes when workflow finishes (success or failure)

## 🆘 Troubleshooting

### Tunnel fails to start?
- Check `EC2_SSH_KEY` secret format
- Verify `EC2_HOST` and `EC2_USER` secrets
- Ensure EC2 security group allows SSH (port 22)

### Connection timeout?
- Check if Minikube is running on EC2
- Verify Minikube listens on `localhost:6443`
- Check SSH connection: `ssh ubuntu@16.16.89.200`

### kubectl commands fail?
- Check tunnel is running: `ps aux | grep ssh`
- Verify kubeconfig points to `127.0.0.1:6443`

