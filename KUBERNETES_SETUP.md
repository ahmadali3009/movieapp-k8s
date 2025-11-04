# Kubernetes Setup Summary

## ✅ What Has Been Created

I've set up a complete Kubernetes configuration for your movie application. Here's what was added:

### 📦 Docker Files
- **`Dockerfile.frontend`** - Multi-stage build for React frontend with Nginx

### 🎯 Kubernetes Manifests (in `k8s/` directory)

1. **Namespace**
   - `namespace.yaml` - Creates isolated namespace for your app

2. **ConfigMaps**
   - `configmap-nginx.yaml` - Nginx reverse proxy configuration
   - `configmap-frontend-env.yaml` - Frontend environment variables
   - `configmap-frontend-script.yaml` - Runtime environment injection script

3. **Secrets**
   - `secret-backend.yaml` - **⚠️ UPDATE THIS** with your actual MongoDB URI and JWT secret

4. **Backend Resources**
   - `deployment-backend.yaml` - Backend deployment (2 replicas, health checks)
   - `service-backend.yaml` - Internal service for backend

5. **Frontend Resources**
   - `deployment-frontend.yaml` - Frontend deployment (2 replicas, health checks)
   - `service-frontend.yaml` - External service for frontend (LoadBalancer)

6. **Ingress**
   - `ingress.yaml` - Optional ingress for domain-based routing

7. **Documentation & Scripts**
   - `README.md` - Comprehensive setup guide
   - `k8s-quick-start.md` - Quick reference guide
   - `deploy.sh` - Automated deployment script

## 🚀 Quick Start Steps

### Step 1: Prerequisites
- Install Kubernetes (Docker Desktop with K8s OR Minikube)
- Install kubectl
- Install Docker

### Step 2: Update Secrets
**IMPORTANT:** Edit `k8s/secret-backend.yaml` with your actual:
- MongoDB URI
- JWT Secret
- Other sensitive values

### Step 3: Build Docker Images

**For Local Kubernetes:**
```bash
# If using Minikube
eval $(minikube docker-env)

# Build images
docker build -f Dockerfile -t movieapp-backend:latest .
docker build -f Dockerfile.frontend -t movieapp-frontend:latest .
```

**For Cloud Kubernetes:**
```bash
# Build and push to your registry
docker build -f Dockerfile -t your-registry/movieapp-backend:latest .
docker build -f Dockerfile.frontend -t your-registry/movieapp-frontend:latest .
docker push your-registry/movieapp-backend:latest
docker push your-registry/movieapp-frontend:latest

# Update image names in deployment files
```

### Step 4: Deploy

**Option A: Use the deployment script**
```bash
chmod +x k8s/deploy.sh
./k8s/deploy.sh
```

**Option B: Manual deployment**
```bash
kubectl apply -f k8s/
```

### Step 5: Access Your App

```bash
# Port forward to access locally
kubectl port-forward service/frontend-service 8080:80 -n movieapp

# Open http://localhost:8080 in your browser
```

### Step 6: Verify

```bash
# Check status
kubectl get pods -n movieapp
kubectl get services -n movieapp
kubectl get deployments -n movieapp

# View logs
kubectl logs -f deployment/backend-deployment -n movieapp
kubectl logs -f deployment/frontend-deployment -n movieapp
```

## 📚 Documentation

- **Full Guide**: See `k8s/README.md` for detailed instructions
- **Quick Reference**: See `k8s/k8s-quick-start.md` for common commands

## 🎓 What You'll Learn

By working with this Kubernetes setup, you'll practice:
- ✅ Kubernetes Deployments and Replicas
- ✅ Services (ClusterIP, LoadBalancer)
- ✅ ConfigMaps for configuration
- ✅ Secrets for sensitive data
- ✅ Namespaces for resource isolation
- ✅ Health checks (liveness & readiness probes)
- ✅ Resource limits and requests
- ✅ Ingress for external routing
- ✅ Container orchestration

## 🔧 Key Features

- **High Availability**: 2 replicas each for frontend and backend
- **Health Checks**: Automated pod health monitoring
- **Resource Management**: CPU and memory limits
- **Environment Configuration**: ConfigMaps for easy updates
- **Security**: Secrets for sensitive data
- **Scalability**: Easy to scale up/down

## 🐛 Troubleshooting

See the troubleshooting section in `k8s/README.md` for common issues and solutions.

## 📝 Next Steps

1. Update secrets in `k8s/secret-backend.yaml`
2. Build and deploy using the steps above
3. Experiment with scaling: `kubectl scale deployment backend-deployment --replicas=3 -n movieapp`
4. Try updating deployments and rolling back
5. Explore monitoring and logging options

Happy learning! 🚀

