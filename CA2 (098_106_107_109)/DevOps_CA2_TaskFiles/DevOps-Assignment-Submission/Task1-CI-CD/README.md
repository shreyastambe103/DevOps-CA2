# Task 1: CI/CD Deployment Pipeline

## Tool: Jenkins

## Pipeline Overview
Automated CI/CD pipeline that builds Docker images, pushes to registry, and deploys to Kubernetes.

## Files
- `Jenkinsfile` - Complete pipeline definition
- `pipeline-flow.txt` - Pipeline diagram

## Workflow Steps
1. **Checkout**: Pull code from Gitea (http://192.168.31.174:3000)
2. **Build**: Create Docker images for backend (FastAPI) and frontend (React)
3. **Push**: Upload images to local registry (localhost:32000)
4. **Deploy**: Apply K8s manifests to quickcv namespace
5. **Verify**: Confirm pods and services are running

## Screenshots
- Jenkins UI with successful build
- Console output showing all stages
- Deployed pods in Kubernetes

## Execution
Access Jenkins: http://192.168.31.174:32080
Trigger: Click "Build Now" on QuickCV-Pipeline job
