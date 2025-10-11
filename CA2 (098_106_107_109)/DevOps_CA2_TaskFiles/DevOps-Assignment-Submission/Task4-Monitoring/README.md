# Task 4: Monitoring & Logging

## Tool: Prometheus + Grafana

## Overview
Monitoring stack for QuickCV application with metrics collection and visualization.

## Components
- **Prometheus**: Metrics collection and storage
- **Grafana**: Dashboard and visualization

## Installation
kubectl create namespace observability
kubectl apply -f prometheus-deployment.yaml
kubectl apply -f grafana-deployment.yaml

text

## Access
- Prometheus: http://192.168.31.174:30090
- Grafana: http://192.168.31.174:30300 (admin/admin)

## Metrics Monitored
- Application uptime
- Request latency
- Error rate
- Pod resource usage (CPU, memory)

## Dashboard
Import Kubernetes cluster monitoring dashboard in Grafana.

## Screenshots Required
- Prometheus targets page
- Grafana dashboard showing metrics
- Custom dashboard with uptime, latency, error rate
