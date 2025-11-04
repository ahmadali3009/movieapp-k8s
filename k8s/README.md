# Kubernetes Setup Guide for Movie App

This guide will walk you through setting up your movie application on Kubernetes.

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Kubernetes Cluster** (choose one):
   - Local: [Minikube](https://minikube.sigs.k8s.io/docs/start/), [Docker Desktop with Kubernetes](https://docs.docker.com/desktop/kubernetes/), or [kind](https://kind.sigs.k8s.io/)
   - Cloud: AWS EKS, Google GKE, Azure AKS, or DigitalOcean Kubernetes

2. **kubectl** - Kubernetes command-line tool
   - Install: https://kubernetes.io/docs/tasks/tools/

3. **Docker** - For building container images

4. **Docker Registry** (optional for cloud):
   - Docker Hub, Google Container Registry, AWS ECR, etc.

## 🚀 Step-by-Step Setup

### Step 1: Build Docker Images

First, build your Docker images:

#### Build Backend Image:
```bash
docker build -f Dockerfile -t movieapp-backend:latest .
```

#### Build Frontend Image:
```bash
docker build -f Dockerfile.frontend -t movieapp-frontend:latest .
```

#### For Local Kubernetes (Minikube/Docker Desktop):
If using Minikube, you need to use the Minikube Docker daemon:
```bash
# For Minikube
eval $(minikube docker-env)
docker build -f Dockerfile -t movieapp-backend:latest .
docker build -f Dockerfile.frontend -t movieapp-frontend:latest .

# Set image pull policy to Never (already done in manifests)
```

#### For Cloud Kubernetes:
Tag and push images to your registry:
```bash
# Example for Docker Hub
docker tag movieapp-backend:latest yourusername/movieapp-backend:latest
docker tag movieapp-frontend:latest yourusername/movieapp-frontend:latest
docker push yourusername/movieapp-backend:latest
docker push yourusername/movieapp-frontend:latest

# Update image names in deployment files
```

### Step 2: Update Configuration Files

#### Update Secrets (IMPORTANT - Change these values!)

Edit `k8s/secret-backend.yaml` with your actual values:
```bash
kubectl create secret generic backend-secrets \
  --from-literal=MONGODB_URI='your-mongodb-uri' \
  --from-literal=JWT_SECRET='your-secret-key' \
  --from-literal=NODE_ENV='production' \
  --from-literal=PORT='5000' \
  --namespace=movieapp \
  --dry-run=client -o yaml | kubectl apply -f -
```

Or edit the file directly and apply:
```bash
# Edit k8s/secret-backend.yaml with your values
kubectl apply -f k8s/secret-backend.yaml
```

#### Update Frontend Environment Variables:
Edit `k8s/configmap-frontend-env.yaml` if needed (especially API_URL for external access).

### Step 3: Apply Kubernetes Manifests

Apply all manifests in order:

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Create ConfigMaps
kubectl apply -f k8s/configmap-nginx.yaml
kubectl apply -f k8s/configmap-frontend-env.yaml
kubectl apply -f k8s/configmap-frontend-script.yaml

# 3. Create Secrets
kubectl apply -f k8s/secret-backend.yaml

# 4. Create Backend resources
kubectl apply -f k8s/deployment-backend.yaml
kubectl apply -f k8s/service-backend.yaml

# 5. Create Frontend resources
kubectl apply -f k8s/deployment-frontend.yaml
kubectl apply -f k8s/service-frontend.yaml

# 6. Create Ingress (optional, requires ingress controller)
kubectl apply -f k8s/ingress.yaml
```

Or apply all at once:
```bash
kubectl apply -f k8s/
```

### Step 4: Verify Deployment

Check if everything is running:

```bash
# Check pods
kubectl get pods -n movieapp

# Check services
kubectl get services -n movieapp

# Check deployments
kubectl get deployments -n movieapp

# View logs
kubectl logs -f deployment/backend-deployment -n movieapp
kubectl logs -f deployment/frontend-deployment -n movieapp
```

### Step 5: Access Your Application

#### Option 1: Using Port Forward (Quick Testing)
```bash
# Forward frontend service
kubectl port-forward service/frontend-service 8080:80 -n movieapp

# Access at http://localhost:8080
```

#### Option 2: Using LoadBalancer Service
If you're using a cloud provider, the LoadBalancer will get an external IP:
```bash
kubectl get service frontend-service -n movieapp
# Use the EXTERNAL-IP to access your app
```

#### Option 3: Using Ingress
If you set up an Ingress Controller (like nginx-ingress):

```bash
# Install nginx ingress controller (example)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Get ingress IP
kubectl get ingress -n movieapp

# Add to /etc/hosts (or use the IP directly)
# <ingress-ip> movieapp.local
```

### Step 6: Update Image References (for Cloud)

If using a cloud registry, update the image names in:
- `k8s/deployment-backend.yaml`
- `k8s/deployment-frontend.yaml`

Replace `movieapp-backend:latest` with `your-registry/movieapp-backend:latest`

## 🔧 Common Operations

### Scale Deployments
```bash
# Scale backend to 3 replicas
kubectl scale deployment backend-deployment --replicas=3 -n movieapp

# Scale frontend to 3 replicas
kubectl scale deployment frontend-deployment --replicas=3 -n movieapp
```

### Update Application
```bash
# Build new image
docker build -f Dockerfile -t movieapp-backend:v1.1.0 .

# Update deployment (change image tag in deployment file)
kubectl set image deployment/backend-deployment backend=movieapp-backend:v1.1.0 -n movieapp

# Or restart deployment
kubectl rollout restart deployment/backend-deployment -n movieapp
kubectl rollout restart deployment/frontend-deployment -n movieapp
```

### View Resources
```bash
# Describe resources
kubectl describe pod <pod-name> -n movieapp
kubectl describe service backend-service -n movieapp

# Get all resources
kubectl get all -n movieapp
```

### Delete Everything
```bash
# Delete all resources in namespace
kubectl delete namespace movieapp

# Or delete individual resources
kubectl delete -f k8s/
```

## 🐛 Troubleshooting

### Pods Not Starting
```bash
# Check pod status
kubectl describe pod <pod-name> -n movieapp

# Check logs
kubectl logs <pod-name> -n movieapp
```

### Services Not Accessible
```bash
# Verify service endpoints
kubectl get endpoints -n movieapp

# Test connectivity from a pod
kubectl run -it --rm debug --image=busybox --restart=Never -- sh
# Inside the debug pod:
# wget -O- http://backend-service:5000
```

### Image Pull Errors
- For local clusters, ensure `imagePullPolicy: Never` or `IfNotPresent`
- For cloud, ensure images are pushed to registry
- Check image name and tag are correct

### Frontend Can't Connect to Backend
- Verify backend-service name matches in nginx config
- Check both services are in the same namespace
- Verify backend pods are running

## 📚 Learning Resources

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

## 🔐 Security Notes

1. **Never commit secrets** - Use Kubernetes Secrets or external secret managers
2. **Update default passwords** - Change JWT_SECRET and other sensitive values
3. **Use RBAC** - Set up proper role-based access control
4. **Enable network policies** - Restrict pod-to-pod communication
5. **Use TLS/SSL** - Enable HTTPS for production

## 📝 Next Steps

1. Set up CI/CD pipeline (GitHub Actions, GitLab CI, etc.)
2. Configure monitoring (Prometheus, Grafana)
3. Set up logging (ELK stack, Loki)
4. Implement auto-scaling (HPA - Horizontal Pod Autoscaler)
5. Set up persistent volumes if needed
6. Configure resource quotas and limits
7. Implement blue-green or canary deployments

## 🎯 Quick Start (All-in-One)

```bash
# 1. Build images (if using local k8s)
eval $(minikube docker-env)  # For Minikube only
docker build -f Dockerfile -t movieapp-backend:latest .
docker build -f Dockerfile.frontend -t movieapp-frontend:latest .

# 2. Update secrets in secret-backend.yaml

# 3. Apply all manifests
kubectl apply -f k8s/

# 4. Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=backend -n movieapp --timeout=300s
kubectl wait --for=condition=ready pod -l app=frontend -n movieapp --timeout=300s

# 5. Port forward to access
kubectl port-forward service/frontend-service 8080:80 -n movieapp

# Access at http://localhost:8080
```

Happy Kubernetes learning! 🚀

