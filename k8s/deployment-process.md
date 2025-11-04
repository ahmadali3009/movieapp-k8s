# 🚀 Kubernetes Deployment Process Guide

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Build Process](#build-process)
3. [Deployment Steps](#deployment-steps)
4. [Verification & Testing](#verification--testing)
5. [Post-Deployment Tasks](#post-deployment-tasks)
6. [Rollback Procedure](#rollback-procedure)
7. [Troubleshooting](#troubleshooting)
8. [Common Scenarios](#common-scenarios)

---

## ✅ Pre-Deployment Checklist

### 1. Prerequisites Installation

#### Required Tools
```bash
# Check if tools are installed
kubectl version --client
docker --version

# Install kubectl (if not installed)
# Windows: Download from https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
# macOS: brew install kubectl
# Linux: curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

#### Kubernetes Cluster Setup
```bash
# Option 1: Docker Desktop (Easiest for Windows/Mac)
# Enable Kubernetes in Docker Desktop: Settings → Kubernetes → Enable Kubernetes

# Option 2: Minikube (Local development)
minikube start
minikube status

# Option 3: Cloud Provider (AWS, GCP, Azure)
# Follow provider-specific setup instructions

# Verify cluster connection
kubectl cluster-info
kubectl get nodes
```

### 2. Code Preparation

#### Verify Application Code
```bash
# Check backend
cd backend
npm install  # Ensure dependencies are up to date
npm test     # Run tests if available

# Check frontend
cd ..
npm install
npm run build  # Verify build works

# Check environment variables
# Ensure all required env vars are documented
```

#### Health Check Endpoint
⚠️ **Important**: The Kubernetes deployment expects a health check endpoint at `/api/health`. 

Currently, your backend has `/api/test`. You have two options:

**Option 1: Update Backend** (Recommended)
Add a health check endpoint to `backend/index.js`:
```javascript
// Health check endpoint for Kubernetes
server.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

**Option 2: Update Deployment Files**
Change health check path in `deployment-backend.yaml`:
```yaml
livenessProbe:
  httpGet:
    path: /api/test  # Change from /api/health
    port: 5000
readinessProbe:
  httpGet:
    path: /api/test  # Change from /api/health
    port: 5000
```

**Note**: Without a proper health endpoint, Kubernetes may restart pods incorrectly.

#### Security Review
- [ ] No hardcoded secrets in code
- [ ] Secrets file (`secret-backend.yaml`) ready (with real values)
- [ ] MongoDB connection string verified
- [ ] JWT secret is strong and secure
- [ ] API keys stored securely

### 3. Docker Images Preparation

#### Update Image Names (if using cloud registry)
```bash
# If deploying to cloud, update image names in:
# - k8s/deployment-backend.yaml
# - k8s/deployment-frontend.yaml

# Replace: movieapp-backend:latest
# With: your-registry/movieapp-backend:latest
```

---

## 🔨 Build Process

### Step 1: Build Docker Images

#### For Local Kubernetes (Minikube/Docker Desktop)

```bash
# If using Minikube, set Docker environment
eval $(minikube docker-env)

# Build Backend Image
docker build -f Dockerfile -t movieapp-backend:latest .

# Verify backend image
docker images | grep movieapp-backend

# Build Frontend Image
docker build -f Dockerfile.frontend -t movieapp-frontend:latest .

# Verify frontend image
docker images | grep movieapp-frontend

# List all images
docker images
```

#### For Cloud Kubernetes (AWS EKS, GCP GKE, Azure AKS)

```bash
# Tag images with your registry
docker tag movieapp-backend:latest your-registry/movieapp-backend:v1.0.0
docker tag movieapp-frontend:latest your-registry/movieapp-frontend:v1.0.0

# Login to your registry
docker login your-registry-url

# Push images
docker push your-registry/movieapp-backend:v1.0.0
docker push your-registry/movieapp-frontend:v1.0.0

# Verify images pushed
docker images | grep your-registry
```

**Important Notes:**
- Use version tags (v1.0.0) instead of `latest` in production
- Update deployment YAML files with the correct image names
- Ensure registry is accessible from your Kubernetes cluster

### Step 2: Verify Docker Images

```bash
# Test backend image locally
docker run -p 5000:5000 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-secret" \
  -e PORT="5000" \
  movieapp-backend:latest

# Test frontend image locally
docker run -p 8080:80 \
  -e API_URL="http://localhost:5000" \
  movieapp-frontend:latest
```

---

## 📦 Deployment Steps

### Step 1: Update Configuration Files

#### Update Secrets
```bash
# ⚠️ CRITICAL: Update secret-backend.yaml with your actual values
# Edit k8s/secret-backend.yaml

# Or create secret via command line (more secure)
kubectl create secret generic backend-secrets \
  --from-literal=MONGODB_URI='your-mongodb-uri' \
  --from-literal=JWT_SECRET='your-jwt-secret' \
  --from-literal=NODE_ENV='production' \
  --from-literal=PORT='5000' \
  --namespace=movieapp \
  --dry-run=client -o yaml > k8s/secret-backend.yaml
```

#### Verify All YAML Files
```bash
# Check for syntax errors
kubectl apply --dry-run=client -f k8s/namespace.yaml
kubectl apply --dry-run=client -f k8s/configmap-*.yaml
kubectl apply --dry-run=client -f k8s/secret-backend.yaml
kubectl apply --dry-run=client -f k8s/deployment-*.yaml
kubectl apply --dry-run=client -f k8s/service-*.yaml
```

### Step 2: Create Namespace

```bash
# Apply namespace
kubectl apply -f k8s/namespace.yaml

# Verify namespace created
kubectl get namespace movieapp

# Set default namespace (optional, for convenience)
kubectl config set-context --current --namespace=movieapp
```

### Step 3: Deploy ConfigMaps

```bash
# Apply all ConfigMaps
kubectl apply -f k8s/configmap-nginx.yaml
kubectl apply -f k8s/configmap-frontend-env.yaml
kubectl apply -f k8s/configmap-frontend-script.yaml

# Verify ConfigMaps
kubectl get configmap -n movieapp

# View ConfigMap contents
kubectl describe configmap nginx-config -n movieapp
kubectl describe configmap frontend-env -n movieapp
```

### Step 4: Deploy Secrets

```bash
# Apply secrets
kubectl apply -f k8s/secret-backend.yaml

# Verify secrets created (values will be base64 encoded)
kubectl get secret backend-secrets -n movieapp

# Verify secret keys exist
kubectl get secret backend-secrets -n movieapp -o jsonpath='{.data}' | jq

# Decode to verify (replace with your secret key)
kubectl get secret backend-secrets -n movieapp -o jsonpath='{.data.MONGODB_URI}' | base64 -d
```

**Security Note:** Never log or display secret values in production!

### Step 5: Deploy Backend

```bash
# Deploy backend deployment
kubectl apply -f k8s/deployment-backend.yaml

# Deploy backend service
kubectl apply -f k8s/service-backend.yaml

# Watch pods being created
kubectl get pods -n movieapp -w

# Check deployment status
kubectl rollout status deployment/backend-deployment -n movieapp
```

**Expected Output:**
```
deployment "backend-deployment" successfully rolled out
```

### Step 6: Deploy Frontend

```bash
# Deploy frontend deployment
kubectl apply -f k8s/deployment-frontend.yaml

# Deploy frontend service
kubectl apply -f k8s/service-frontend.yaml

# Watch pods being created
kubectl get pods -n movieapp -w

# Check deployment status
kubectl rollout status deployment/frontend-deployment -n movieapp
```

### Step 7: Deploy Ingress (Optional)

```bash
# Check if ingress controller is installed
kubectl get ingressclass

# Install nginx ingress controller (if not installed)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Wait for ingress controller to be ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

# Apply ingress
kubectl apply -f k8s/ingress.yaml

# Verify ingress
kubectl get ingress -n movieapp
```

### Step 8: Verify All Resources

```bash
# Get all resources in namespace
kubectl get all -n movieapp

# Expected output should show:
# - 2 backend pods (Running)
# - 2 frontend pods (Running)
# - 1 backend service (ClusterIP)
# - 1 frontend service (LoadBalancer or ClusterIP)
```

---

## ✅ Verification & Testing

### 1. Check Pod Status

```bash
# Get all pods
kubectl get pods -n movieapp

# Detailed pod information
kubectl describe pod <pod-name> -n movieapp

# Check pod logs
kubectl logs <pod-name> -n movieapp

# Follow logs in real-time
kubectl logs -f deployment/backend-deployment -n movieapp
kubectl logs -f deployment/frontend-deployment -n movieapp
```

**Expected Status:**
```
NAME                                    READY   STATUS    RESTARTS   AGE
backend-deployment-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
backend-deployment-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
frontend-deployment-xxxxxxxxxx-xxxxx    1/1     Running   0          1m
frontend-deployment-xxxxxxxxxx-xxxxx    1/1     Running   0          1m
```

**If pods show `CrashLoopBackOff` or `Error`:**
- Check logs: `kubectl logs <pod-name> -n movieapp`
- Verify health endpoint exists: The deployment uses `/api/health` but your backend may have `/api/test`
- See troubleshooting section below

### 2. Check Service Status

```bash
# Get all services
kubectl get services -n movieapp

# Get service details
kubectl describe service backend-service -n movieapp
kubectl describe service frontend-service -n movieapp

# Get service endpoints
kubectl get endpoints -n movieapp
```

**Expected Output:**
```
NAME                TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
backend-service     ClusterIP      10.96.x.x      <none>        5000/TCP       2m
frontend-service    LoadBalancer   10.96.x.x      <pending>     80:3xxxx/TCP   1m
```

### 3. Test Backend Service

```bash
# Port forward to backend service
kubectl port-forward service/backend-service 5000:5000 -n movieapp

# In another terminal, test the API
# Test health endpoint (if you added it)
curl http://localhost:5000/api/health

# Or test the existing endpoint
curl http://localhost:5000/api/test

# Test specific endpoint
curl http://localhost:5000/api/some-endpoint
```

### 4. Test Frontend Service

```bash
# Port forward to frontend service
kubectl port-forward service/frontend-service 8080:80 -n movieapp

# Access in browser
# http://localhost:8080

# Test API calls from frontend
# Open browser console and check for API calls
```

### 5. Test Internal Connectivity

```bash
# Run a temporary pod to test internal connectivity
kubectl run -it --rm debug --image=busybox --restart=Never -- sh -n movieapp

# Inside the debug pod:
wget -O- http://backend-service:5000/api/health
wget -O- http://frontend-service:80

# Exit the pod
exit
```

### 6. Verify Health Checks

```bash
# Check if liveness probes are working
kubectl get pods -n movieapp -o wide

# Watch events
kubectl get events -n movieapp --sort-by='.lastTimestamp'

# Check deployment rollout history
kubectl rollout history deployment/backend-deployment -n movieapp
kubectl rollout history deployment/frontend-deployment -n movieapp
```

### 7. Load Testing (Optional)

```bash
# Test with multiple requests
for i in {1..10}; do
  curl http://localhost:5000/api/health
  echo "Request $i"
done

# Watch pod resource usage
kubectl top pods -n movieapp
```

---

## 🔧 Post-Deployment Tasks

### 1. Monitor Application

```bash
# Set up monitoring (if available)
kubectl get pods -n movieapp -w

# Monitor resource usage
kubectl top pods -n movieapp
kubectl top nodes

# Check for errors in logs
kubectl logs -l app=backend -n movieapp --tail=100 | grep -i error
kubectl logs -l app=frontend -n movieapp --tail=100 | grep -i error
```

### 2. Document Deployment

```bash
# Save current state
kubectl get all -n movieapp -o yaml > deployment-state-$(date +%Y%m%d).yaml

# Save configuration
kubectl get configmap,secret -n movieapp -o yaml > config-$(date +%Y%m%d).yaml
```

### 3. Set Up Alerts (Optional)

- Configure monitoring tools (Prometheus, Datadog, etc.)
- Set up log aggregation (ELK, Loki, etc.)
- Configure alerting rules

### 4. Access External IP (if LoadBalancer)

```bash
# Get external IP for frontend service
kubectl get service frontend-service -n movieapp

# If EXTERNAL-IP is pending, wait a few minutes
# Cloud providers need time to provision load balancer

# Once IP is available, access:
# http://<EXTERNAL-IP>
```

---

## 🔄 Rollback Procedure

### Scenario 1: Rollback Deployment

```bash
# Check rollout history
kubectl rollout history deployment/backend-deployment -n movieapp
kubectl rollout history deployment/frontend-deployment -n movieapp

# Rollback to previous version
kubectl rollout undo deployment/backend-deployment -n movieapp
kubectl rollout undo deployment/frontend-deployment -n movieapp

# Rollback to specific revision
kubectl rollout undo deployment/backend-deployment --to-revision=2 -n movieapp

# Monitor rollback
kubectl rollout status deployment/backend-deployment -n movieapp
```

### Scenario 2: Quick Fix - Scale to Zero

```bash
# Temporarily stop all pods
kubectl scale deployment backend-deployment --replicas=0 -n movieapp
kubectl scale deployment frontend-deployment --replicas=0 -n movieapp

# Scale back up when ready
kubectl scale deployment backend-deployment --replicas=2 -n movieapp
kubectl scale deployment frontend-deployment --replicas=2 -n movieapp
```

### Scenario 3: Complete Rollback - Delete Deployment

```bash
# ⚠️ Use with caution - this will delete everything
kubectl delete -f k8s/deployment-backend.yaml
kubectl delete -f k8s/deployment-frontend.yaml

# Redeploy previous version
# Rebuild old image or use previous deployment YAML
```

---

## 🐛 Troubleshooting

### Problem 1: Pods Not Starting

**Symptoms:**
```
STATUS: Pending or CrashLoopBackOff
```

**Diagnosis:**
```bash
# Check pod events
kubectl describe pod <pod-name> -n movieapp

# Check pod logs
kubectl logs <pod-name> -n movieapp

# Common issues:
# - Image pull errors
# - Resource constraints
# - Configuration errors
# - Startup errors
```

**Solutions:**
```bash
# Check image pull policy
kubectl get pod <pod-name> -n movieapp -o yaml | grep imagePullPolicy

# For local images, use:
imagePullPolicy: Never
# or
imagePullPolicy: IfNotPresent

# Check resource limits
kubectl describe node

# Check configuration
kubectl get configmap,secret -n movieapp
```

### Problem 2: Service Not Accessible

**Symptoms:**
- Can't connect to service
- Connection refused
- Timeout

**Diagnosis:**
```bash
# Check service endpoints
kubectl get endpoints -n movieapp

# If endpoints are empty, pods aren't matching service selector
kubectl get pods -n movieapp --show-labels
kubectl describe service backend-service -n movieapp

# Test from inside cluster
kubectl run -it --rm debug --image=busybox --restart=Never -- sh -n movieapp
wget -O- http://backend-service:5000
```

**Solutions:**
- Verify pod labels match service selector
- Check pods are running and ready
- Verify ports match (service port vs pod port)

### Problem 3: ConfigMap/Secret Not Loading

**Symptoms:**
- Environment variables missing
- Configuration not found

**Diagnosis:**
```bash
# Check if ConfigMap/Secret exists
kubectl get configmap -n movieapp
kubectl get secret -n movieapp

# Check pod environment
kubectl exec <pod-name> -n movieapp -- env | grep <VAR_NAME>

# Check mounted volumes
kubectl describe pod <pod-name> -n movieapp | grep -A 10 Mounts
```

**Solutions:**
```bash
# Recreate ConfigMap/Secret
kubectl delete configmap nginx-config -n movieapp
kubectl apply -f k8s/configmap-nginx.yaml

# Restart pods to pick up changes
kubectl rollout restart deployment/backend-deployment -n movieapp
```

### Problem 4: Health Check Failures

**Symptoms:**
```
Readiness probe failed
Liveness probe failed
```

**Diagnosis:**
```bash
# Check health endpoint manually
kubectl exec <pod-name> -n movieapp -- wget -O- http://localhost:5000/api/health

# Check probe configuration
kubectl get deployment backend-deployment -n movieapp -o yaml | grep -A 20 probe
```

**Solutions:**
- Verify health endpoint exists and returns 200
- Adjust probe timing (initialDelaySeconds, periodSeconds)
- Fix application startup issues

### Problem 5: Resource Exhaustion

**Symptoms:**
```
Pod is in Pending state
Out of memory errors
CPU throttling
```

**Diagnosis:**
```bash
# Check node resources
kubectl describe node

# Check pod resource requests/limits
kubectl get pod <pod-name> -n movieapp -o yaml | grep -A 10 resources

# Check resource usage
kubectl top pods -n movieapp
kubectl top nodes
```

**Solutions:**
- Reduce resource requests/limits
- Add more nodes to cluster
- Optimize application resource usage

---

## 📝 Common Scenarios

### Scenario 1: Update Application Code

```bash
# 1. Build new image with new tag
docker build -f Dockerfile -t movieapp-backend:v1.1.0 .

# 2. Push to registry (if cloud)
docker push your-registry/movieapp-backend:v1.1.0

# 3. Update deployment
kubectl set image deployment/backend-deployment \
  backend=your-registry/movieapp-backend:v1.1.0 \
  -n movieapp

# 4. Watch rollout
kubectl rollout status deployment/backend-deployment -n movieapp

# 5. Verify new version
kubectl get pods -n movieapp -o jsonpath='{.items[*].spec.containers[*].image}'
```

### Scenario 2: Scale Application

```bash
# Scale up for high traffic
kubectl scale deployment backend-deployment --replicas=5 -n movieapp
kubectl scale deployment frontend-deployment --replicas=5 -n movieapp

# Scale down to save resources
kubectl scale deployment backend-deployment --replicas=2 -n movieapp
```

### Scenario 3: Update Configuration

```bash
# 1. Update ConfigMap
kubectl edit configmap nginx-config -n movieapp
# Or apply updated file
kubectl apply -f k8s/configmap-nginx.yaml

# 2. Restart deployment to pick up changes
kubectl rollout restart deployment/frontend-deployment -n movieapp

# 3. Verify changes
kubectl exec <pod-name> -n movieapp -- cat /etc/nginx/conf.d/default.conf
```

### Scenario 4: Update Secrets

```bash
# 1. Update secret
kubectl edit secret backend-secrets -n movieapp

# 2. Restart pods to pick up new secrets
kubectl rollout restart deployment/backend-deployment -n movieapp

# Note: Secrets are base64 encoded, use:
kubectl create secret generic backend-secrets \
  --from-literal=KEY=value \
  --namespace=movieapp \
  --dry-run=client -o yaml | kubectl apply -f -
```

### Scenario 5: Debug Production Issues

```bash
# 1. Get pod logs
kubectl logs -l app=backend -n movieapp --tail=100

# 2. Execute into pod
kubectl exec -it <pod-name> -n movieapp -- sh

# 3. Check environment variables
kubectl exec <pod-name> -n movieapp -- env

# 4. Check network connectivity
kubectl exec <pod-name> -n movieapp -- wget -O- http://backend-service:5000

# 5. Check file system
kubectl exec <pod-name> -n movieapp -- ls -la /etc/nginx/conf.d/
```

### Scenario 6: Backup and Restore

```bash
# Backup all resources
kubectl get all -n movieapp -o yaml > backup-$(date +%Y%m%d).yaml
kubectl get configmap,secret -n movieapp -o yaml > backup-config-$(date +%Y%m%d).yaml

# Restore from backup
kubectl apply -f backup-20241201.yaml
```

---

## 🎯 Quick Reference Commands

### Deployment
```bash
# Deploy everything
kubectl apply -f k8s/

# Deploy specific resource
kubectl apply -f k8s/deployment-backend.yaml

# Check deployment status
kubectl rollout status deployment/backend-deployment -n movieapp

# View deployment history
kubectl rollout history deployment/backend-deployment -n movieapp
```

### Monitoring
```bash
# Get all resources
kubectl get all -n movieapp

# Watch resources
kubectl get pods -n movieapp -w

# View logs
kubectl logs -f deployment/backend-deployment -n movieapp

# Describe resource
kubectl describe pod <pod-name> -n movieapp
```

### Debugging
```bash
# Port forward
kubectl port-forward service/frontend-service 8080:80 -n movieapp

# Exec into pod
kubectl exec -it <pod-name> -n movieapp -- sh

# Run debug pod
kubectl run -it --rm debug --image=busybox --restart=Never -- sh -n movieapp
```

### Scaling
```bash
# Scale up/down
kubectl scale deployment backend-deployment --replicas=3 -n movieapp

# Auto-scaling (requires metrics-server)
kubectl autoscale deployment backend-deployment \
  --min=2 --max=10 --cpu-percent=80 -n movieapp
```

### Cleanup
```bash
# Delete everything in namespace
kubectl delete namespace movieapp

# Delete specific resource
kubectl delete -f k8s/deployment-backend.yaml

# Delete all pods
kubectl delete pods --all -n movieapp
```

---

## 📋 Deployment Checklist Summary

### Before Deployment
- [ ] Kubernetes cluster is running
- [ ] kubectl is configured and connected
- [ ] Docker images are built and tested
- [ ] Secrets are updated with real values
- [ ] All YAML files are validated
- [ ] Health check endpoints are implemented
- [ ] Resource limits are set appropriately

### During Deployment
- [ ] Namespace created
- [ ] ConfigMaps created
- [ ] Secrets created
- [ ] Backend deployment created
- [ ] Backend service created
- [ ] Frontend deployment created
- [ ] Frontend service created
- [ ] Ingress created (if needed)

### After Deployment
- [ ] All pods are Running
- [ ] Services are accessible
- [ ] Health checks are passing
- [ ] Application is responding
- [ ] Logs show no errors
- [ ] Resources are within limits
- [ ] External access works (if applicable)
- [ ] Monitoring is set up

---

## 🎓 Best Practices

1. **Always use version tags** instead of `latest` for production
2. **Test images locally** before deploying to Kubernetes
3. **Use secrets** for sensitive data, never hardcode
4. **Set resource limits** to prevent resource exhaustion
5. **Implement health checks** for better reliability
6. **Use multiple replicas** for high availability
7. **Monitor your deployments** continuously
8. **Keep deployment history** for easy rollbacks
9. **Document changes** in deployment notes
10. **Backup configurations** regularly

---

## 🔐 Security Reminders

- ⚠️ Never commit real secrets to Git
- ⚠️ Use external secret managers in production
- ⚠️ Enable RBAC (Role-Based Access Control)
- ⚠️ Use network policies to restrict pod communication
- ⚠️ Keep Kubernetes cluster updated
- ⚠️ Scan Docker images for vulnerabilities
- ⚠️ Use TLS/SSL for external communications

---

**Last Updated:** 2024-12-01  
**Version:** 1.0

