#!/bin/bash
# Rolling Update & Rollback Demo

echo "=== Current Deployment ==="
kubectl get deployments -n quickcv

echo -e "\n=== Scale to 3 replicas ==="
kubectl scale deployment quickcv-backend -n quickcv --replicas=3
kubectl get pods -n quickcv

echo -e "\n=== Perform Rolling Update ==="
kubectl set image deployment/quickcv-backend quickcv-backend=localhost:32000/quickcv-backend:12 -n quickcv
kubectl rollout status deployment/quickcv-backend -n quickcv

echo -e "\n=== Rollout History ==="
kubectl rollout history deployment/quickcv-backend -n quickcv

echo -e "\n=== Rollback to Previous Version ==="
kubectl rollout undo deployment/quickcv-backend -n quickcv
kubectl rollout status deployment/quickcv-backend -n quickcv

echo -e "\n=== Verify Rollback ==="
kubectl describe deployment quickcv-backend -n quickcv | grep Image
