# DevOps Assignment Submission

**Project**: QuickCV - CV Management Application
**Tech Stack**: FastAPI (Backend), React (Frontend), Docker, Kubernetes

## Task Summary

### Task 1: CI/CD Pipeline (1 mark)
**Tool**: Jenkins
**Deliverables**: Jenkinsfile, pipeline flow diagram
**Location**: `Task1-CI-CD/`

### Task 2: Configuration Management (2 marks)
**Tool**: Ansible
**Deliverables**: Playbook, Inventory file
**Location**: `Task2-Ansible/`

### Task 3: Containerization & Orchestration (1.5 marks)
**Tool**: Kubernetes
**Deliverables**: Dockerfiles, K8s manifests, rolling update demo
**Location**: `Task3-Kubernetes/`

### Task 4: Monitoring & Logging (2 marks)
**Tool**: Prometheus + Grafana
**Deliverables**: Prometheus config, Grafana dashboard
**Location**: `Task4-Monitoring/`

## Project Structure
DevOps-Assignment-Submission/
├── README.md (this file)
├── Task1-CI-CD/
│ ├── Jenkinsfile
│ ├── pipeline-flow.txt
│ └── README.md
├── Task2-Ansible/
│ ├── inventory.ini
│ ├── playbook.yml
│ └── README.md
├── Task3-Kubernetes/
│ ├── backend-deployment.yaml
│ ├── backend-service.yaml
│ ├── frontend-deployment.yaml
│ ├── frontend-service.yaml
│ ├── quickcv-storage-pvc.yaml
│ ├── dockerfiles/
│ ├── rolling-update-demo.sh
│ └── README.md
└── Task4-Monitoring/
├── prometheus-config.yaml
├── grafana-dashboard.json
└── README.md

text

## Infrastructure Details
- **Host**: Ubuntu 22.04
- **Kubernetes**: MicroK8s
- **Registry**: localhost:32000
- **Jenkins**: http://192.168.31.174:32080
- **Gitea**: http://192.168.31.174:3000

## Screenshots
Screenshots for each task are provided separately showing:
- Successful pipeline execution
- Ansible playbook run
- Kubernetes deployments and rolling updates
- Monitoring dashboards

## Submitted by
[Your Name]
[Date: October 4, 2025]
