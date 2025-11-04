#!/bin/bash

# Kubernetes Deployment Script for Movie App
# This script helps you deploy the application to Kubernetes

set -e

echo "🚀 Starting Kubernetes Deployment for Movie App"
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install it first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"

# Ask for environment
read -p "Are you using Minikube? (y/n): " USE_MINIKUBE
if [[ $USE_MINIKUBE == "y" ]]; then
    echo -e "${YELLOW}Setting up Minikube Docker environment...${NC}"
    eval $(minikube docker-env)
    echo -e "${GREEN}✓ Minikube Docker environment configured${NC}"
fi

# Build Docker images
echo -e "\n${YELLOW}Building Docker images...${NC}"
echo "Building backend image..."
docker build -f Dockerfile -t movieapp-backend:latest .
echo -e "${GREEN}✓ Backend image built${NC}"

echo "Building frontend image..."
docker build -f Dockerfile.frontend -t movieapp-frontend:latest .
echo -e "${GREEN}✓ Frontend image built${NC}"

# Update secrets
echo -e "\n${YELLOW}⚠️  IMPORTANT: Please update k8s/secret-backend.yaml with your actual MongoDB URI and JWT Secret before proceeding!${NC}"
read -p "Have you updated the secrets? (y/n): " SECRETS_UPDATED
if [[ $SECRETS_UPDATED != "y" ]]; then
    echo -e "${RED}Please update the secrets first and run this script again.${NC}"
    exit 1
fi

# Apply Kubernetes manifests
echo -e "\n${YELLOW}Applying Kubernetes manifests...${NC}"

# Check if namespace exists
if ! kubectl get namespace movieapp &> /dev/null; then
    kubectl apply -f k8s/namespace.yaml
    echo -e "${GREEN}✓ Namespace created${NC}"
else
    echo -e "${GREEN}✓ Namespace already exists${NC}"
fi

# Apply ConfigMaps
kubectl apply -f k8s/configmap-nginx.yaml
kubectl apply -f k8s/configmap-frontend-env.yaml
kubectl apply -f k8s/configmap-frontend-script.yaml
echo -e "${GREEN}✓ ConfigMaps applied${NC}"

# Apply Secrets
kubectl apply -f k8s/secret-backend.yaml
echo -e "${GREEN}✓ Secrets applied${NC}"

# Apply Backend
kubectl apply -f k8s/deployment-backend.yaml
kubectl apply -f k8s/service-backend.yaml
echo -e "${GREEN}✓ Backend resources applied${NC}"

# Apply Frontend
kubectl apply -f k8s/deployment-frontend.yaml
kubectl apply -f k8s/service-frontend.yaml
echo -e "${GREEN}✓ Frontend resources applied${NC}"

# Optional: Apply Ingress
read -p "Do you want to apply Ingress? (requires ingress controller) (y/n): " APPLY_INGRESS
if [[ $APPLY_INGRESS == "y" ]]; then
    kubectl apply -f k8s/ingress.yaml
    echo -e "${GREEN}✓ Ingress applied${NC}"
fi

# Wait for deployments
echo -e "\n${YELLOW}Waiting for deployments to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/backend-deployment -n movieapp || true
kubectl wait --for=condition=available --timeout=300s deployment/frontend-deployment -n movieapp || true

# Show status
echo -e "\n${GREEN}📊 Deployment Status:${NC}"
echo "================================================"
kubectl get pods -n movieapp
echo ""
kubectl get services -n movieapp
echo ""

# Show access instructions
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "To access your application:"
echo "1. Port Forward: kubectl port-forward service/frontend-service 8080:80 -n movieapp"
echo "2. Then open: http://localhost:8080"
echo ""
echo "To view logs:"
echo "- Backend: kubectl logs -f deployment/backend-deployment -n movieapp"
echo "- Frontend: kubectl logs -f deployment/frontend-deployment -n movieapp"
echo ""
echo "To check status:"
echo "- kubectl get all -n movieapp"

