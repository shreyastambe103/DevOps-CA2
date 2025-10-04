# Task 3: Containerization & Orchestration

## Tool: Kubernetes (MicroK8s)

## Overview
Dockerized QuickCV application deployed to Kubernetes with rolling updates and rollback capabilities.

## Files
### Dockerfiles
- `dockerfiles/Dockerfile-backend` - FastAPI backend container
- `dockerfiles/Dockerfile-frontend` - React frontend container

### Kubernetes Manifests
- `backend-deployment.yaml` - Backend deployment (2 replicas)
- `backend-service.yaml` - Backend service (NodePort)
- `frontend-deployment.yaml` - Frontend deployment (2 replicas)
- `frontend-service.yaml` - Frontend service (NodePort)
- `quickcv-storage-pvc.yaml` - Persistent volume claim

### Demo Script
- `rolling-update-demo.sh` - Demonstrates rolling update and rollback

## Deployment
kubectl apply -f .
kubectl get all -n quickcv

text

## Rolling Update Demo
Scale deployment
kubectl scale deployment quickcv-backend -n quickcv --replicas=3

Update image
kubectl set image deployment/quickcv-backend quickcv-backend=localhost:32000/quickcv-backend:12 -n quickcv

Check status
kubectl rollout status deployment/quickcv-backend -n quickcv

View history
kubectl rollout history deployment/quickcv-backend -n quickcv

Rollback
kubectl rollout undo deployment/quickcv-backend -n quickcv

text

## Screenshots
- Deployments and pods running
- Rolling update in progress
- Rollout history showing revisions
- Successful rollback verification
