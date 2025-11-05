# GitHub Actions CI/CD Pipeline

This directory contains GitHub Actions workflows for automated CI/CD of the movie application.

## 📋 Workflows Overview

### 1. **CI - Build and Test** (`ci.yml`)
- Runs on: Push/PR to `main` or `develop` branches
- Jobs:
  - Lint and test frontend/backend
  - Build Docker images
  - Push images to Docker Hub

### 2. **Deploy to Kubernetes** (`deploy-k8s.yml`)
- Runs on: Push to `main` branch or manual trigger
- Jobs:
  - Deploys to Kubernetes cluster
  - Updates deployment manifests with new images
  - Waits for deployment rollout
  - Shows deployment status

### 3. **Deploy to EC2** (`deploy-ec2.yml`)
- Runs on: Manual trigger only
- Jobs:
  - Deploys Docker containers to EC2 instance
  - Pulls latest images from Docker Hub
  - Manages containers with restart policies

### 4. **Full CI/CD Pipeline** (`full-pipeline.yml`)
- Runs on: Push to `main`/`develop` or manual trigger
- Jobs:
  - Complete pipeline: Test → Build → Deploy to K8s

## 🔐 Required GitHub Secrets

Add these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

### Docker Hub Secrets
- `DOCKER_USERNAME`: Your Docker Hub username (e.g., `ahmedbutt3009`)
- `DOCKER_PASSWORD`: Your Docker Hub access token or password

### Kubernetes Secrets
- `KUBE_CONFIG`: Base64-encoded kubeconfig file
  ```bash
  # Generate base64 kubeconfig
  cat ~/.kube/config | base64 -w 0
  ```

### EC2 Secrets (for EC2 deployment)
- `EC2_SSH_KEY`: Private SSH key for EC2 access
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret key
- `NODE_ENV`: Environment (production/staging)
- `API_URL`: Backend API URL
- `APP_ENV`: Application environment

## 🚀 Usage

### Automatic Deployment (Recommended)
1. Push to `main` branch → Automatically triggers CI/CD
2. Images are built and pushed to Docker Hub
3. Kubernetes deployment runs automatically

### Manual Deployment
1. Go to Actions tab in GitHub
2. Select the workflow you want to run
3. Click "Run workflow"
4. For EC2: Provide EC2 host, user, and environment

### Workflow Triggers

**CI Pipeline:**
```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

**K8s Deployment:**
```yaml
on:
  push:
    branches: [ main ]
  workflow_dispatch:  # Manual trigger
```

**EC2 Deployment:**
```yaml
on:
  workflow_dispatch:  # Manual trigger only
```

## 📝 Configuration

### Docker Image Names
Update in workflow files if needed:
```yaml
env:
  DOCKER_USERNAME: ahmedbutt3009
  BACKEND_IMAGE: movieapp-backend
  FRONTEND_IMAGE: movieapp-frontend
```

### Kubernetes Namespace
Default namespace is `movieapp`. Update in `deploy-k8s.yml`:
```yaml
env:
  K8S_NAMESPACE: movieapp
```

## 🔧 Troubleshooting

### Docker Hub Authentication Failed
- Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets are correct
- Use Docker Hub access token instead of password

### Kubernetes Deployment Failed
- Verify `KUBE_CONFIG` secret is valid and base64 encoded
- Check cluster connectivity: `kubectl cluster-info`
- Ensure namespace exists: `kubectl get namespace movieapp`
- **For Minikube on EC2**: See [MINIKUBE_EC2_SETUP.md](./MINIKUBE_EC2_SETUP.md)
  - Elastic IP: `16.16.89.200`
  - Run setup script: `k8s/setup-minikube-ec2.sh`
  - Ensure EC2 security group allows port 6443

### EC2 Deployment Failed
- Verify SSH key format (should be private key)
- Check EC2 security group allows SSH (port 22)
- Ensure Docker is installed on EC2 instance
- Verify EC2 user has Docker permissions

## 📊 Monitoring

### View Workflow Runs
- Go to Actions tab in GitHub
- Click on workflow to see run history
- Click on a run to see detailed logs

### Check Deployment Status
```bash
# Kubernetes
kubectl get pods -n movieapp
kubectl get services -n movieapp
kubectl logs -f deployment/backend-deployment -n movieapp

# EC2
ssh user@ec2-host "docker ps | grep movieapp"
ssh user@ec2-host "docker logs movieapp-backend"
```

## 🎯 Best Practices

1. **Use branch protection**: Require CI checks before merging
2. **Tag releases**: Use semantic versioning for production releases
3. **Monitor deployments**: Set up alerts for failed deployments
4. **Review logs**: Check workflow logs regularly
5. **Test locally**: Run docker builds locally before pushing

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Kubernetes Deployment Guide](./../k8s/README.md)

