# Kubernetes Quick Start Guide

## 🎯 Quick Setup Steps

### 1. Prerequisites Check
```bash
# Install kubectl
# Install Docker Desktop (includes Kubernetes) OR Minikube
```

### 2. Enable Kubernetes
- **Docker Desktop**: Settings → Kubernetes → Enable Kubernetes
- **Minikube**: `minikube start`

### 3. Build and Deploy

#### Option A: Using the deployment script (Easiest)
```bash
chmod +x k8s/deploy.sh
./k8s/deploy.sh
```

#### Option B: Manual steps

**For Local Kubernetes (Minikube/Docker Desktop):**
```bash
# Set Docker environment for Minikube
eval $(minikube docker-env)  # Skip if using Docker Desktop

# Build images
docker build -f Dockerfile -t movieapp-backend:latest .
docker build -f Dockerfile.frontend -t movieapp-frontend:latest .

# Update secrets in k8s/secret-backend.yaml
# Then apply all manifests
kubectl apply -f k8s/
```

**For Cloud Kubernetes:**
```bash
# Tag and push to registry
docker tag movieapp-backend:latest your-registry/movieapp-backend:latest
docker tag movieapp-frontend:latest your-registry/movieapp-frontend:latest
docker push your-registry/movieapp-backend:latest
docker push your-registry/movieapp-frontend:latest

# Update image names in deployment files, then:
kubectl apply -f k8s/
```

### 4. Access Application

```bash
# Port forward
kubectl port-forward service/frontend-service 8080:80 -n movieapp

# Open browser: http://localhost:8080
```

### 5. Verify Status

```bash
# Check pods
kubectl get pods -n movieapp

# Check services
kubectl get services -n movieapp

# Check logs
kubectl logs -f deployment/backend-deployment -n movieapp
```

## 📁 Kubernetes Files Overview

- `namespace.yaml` - Creates the movieapp namespace
- `configmap-nginx.yaml` - Nginx configuration
- `configmap-frontend-env.yaml` - Frontend environment variables
- `configmap-frontend-script.yaml` - Environment injection script
- `secret-backend.yaml` - **⚠️ UPDATE THIS** with your MongoDB URI and secrets
- `deployment-backend.yaml` - Backend deployment configuration
- `service-backend.yaml` - Backend service (ClusterIP)
- `deployment-frontend.yaml` - Frontend deployment configuration
- `service-frontend.yaml` - Frontend service (LoadBalancer)
- `ingress.yaml` - Ingress for external access (optional)

## 🔑 Important Notes

1. **Update Secrets**: Edit `secret-backend.yaml` with your actual MongoDB URI and JWT secret
2. **Image Names**: For cloud, update image names in deployment files
3. **Health Checks**: Update health check paths if your API has different endpoints

## 🛠️ Common Commands

```bash
# Scale deployments
kubectl scale deployment backend-deployment --replicas=3 -n movieapp

# Update deployment
kubectl rollout restart deployment/backend-deployment -n movieapp

# View logs
kubectl logs -f deployment/backend-deployment -n movieapp

# Delete everything
kubectl delete namespace movieapp
```

For detailed information, see [README.md](./README.md)

