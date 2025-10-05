# 📘 DevOps CA2 – Group 12 Documentation

Welcome to the **Group 12 (PRN-086-119-120-135)** documentation!  
This repository demonstrates the complete **DevOps lifecycle** — from **CI/CD** to **Monitoring** and **Open Source Contributions**.

---

## 👨‍💻 Team Members

| PRN | Name |
|-----|------|
| 22070122086 | *Janmejay Pandya* |
| 22070122119 | *Sachin Mhetre* |
| 22070122120 | *Mihir Hebalkar* |
| 22070122135 | *Onkar Mendhapurkar* |

---

## 🗂️ Documentation Overview

<details>
<summary><b>🚀 Step 1: CI/CD Setup</b></summary>

### 🎯 Goal
Implement **Continuous Integration** and **Continuous Deployment** using GitHub Actions.

### 📁 Files
- [ci-cd-grp12.yml](./step1-CICD/ci-cd-grp12.yml)

### 🖼️ Screenshots
- ![CI-CD Pipeline Diagram](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step1-CICD/screenshots/CI-CD%20Pipeline%20Diagram.jpg)
- ![GitHub Actions Pipeline](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step1-CICD/screenshots/GH_Actions_Pipeline.png)

### 🧩 Highlights
- Automated build, test, and deployment pipeline.
- Integrated with containerized environments.
- Streamlined workflow using **GitHub Actions**.
</details>

---

<details>
<summary><b>🧠 Step 2: Ansible Automation</b></summary>

### 🎯 Goal
Automate infrastructure setup using **Ansible**.

### 📁 Files
- [inventory.ini](./step2-ansible/inventory.ini)
- [setup-backend.yml](./step2-ansible/setup-backend.yml)
- [setup-frontend.yml](./step2-ansible/setup-frontend.yml)
- [setup-prediction.yml](./step2-ansible/setup-prediction.yml)

### 🖼️ Screenshots
- ![Ansible Run Success](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step2-ansible/screenshots/ansible%20run%20success.png)
- ![Ansible Setup File](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step2-ansible/screenshots/ansible%20setup%20file.png)

### 🧩 Highlights
- Automated provisioning and configuration of all app layers.
- Ensured **environment consistency** across deployments.
</details>

---

<details>
<summary><b>🐳 Step 3: Docker & Kubernetes Deployment</b></summary>

### 🎯 Goal
Containerize the app and deploy it on **Azure Kubernetes Service (AKS)**.

### 📁 Files
- [Dockerfile](./step3-docker-kubernetes/Dockerfile)
- [deployment.yaml](./step3-docker-kubernetes/k8s/deployment.yaml)
- [service.yaml](./step3-docker-kubernetes/k8s/service.yaml)
- [backend-servicemonitor.yaml](./step3-docker-kubernetes/k8s/backend-servicemonitor.yaml)

### 🖼️ Screenshots
- ![ACR](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step3-docker-kubernetes/screenshots/azure_container_registry.png)
- ![AKS](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step3-docker-kubernetes/screenshots/azure_kubernetes_cluster.png)
- ![Docker Image](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step3-docker-kubernetes/screenshots/docker_image.png)
- ![Running Pods](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step3-docker-kubernetes/screenshots/running_pods.png)
- ![Running Services](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step3-docker-kubernetes/screenshots/running_services.png)

### 🧩 Highlights
- Seamless CI/CD integration with **AKS**.
- Scalable and fault-tolerant infrastructure.
</details>

---

<details>
<summary><b>📊 Step 4: Monitoring with Grafana & Prometheus</b></summary>

### 🎯 Goal
Integrate **Prometheus** and **Grafana** for backend monitoring and alerting.

### 📁 Files
- [backend-servicemonitor.yaml](./step4-grafana-prometheus/backend-servicemonitor.yaml)

### 🖼️ Screenshots
- ![Prometheus Metrics](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step4-grafana-prometheus/screenshots/prometheus_metrics.png)
- ![Backend Service Metrics](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step4-grafana-prometheus/screenshots/backend_service_exposed_metrics.png)
- ![Grafana Dashboard](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step4-grafana-prometheus/screenshots/grafana_dashboard.png)
- ![Monitoring Pods](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step4-grafana-prometheus/screenshots/monitoring_pods.png)

### 🧩 Highlights
- Real-time application insights using Prometheus metrics.
- Grafana dashboards for visualization and performance tracking.
</details>

---

<details>
<summary><b>📄 Step 5: Final Documentation</b></summary>

### 📁 Files
- [group12-documentation.pdf](./step5-documentation/group12-documentation.pdf)
- [architecture.png](./step5-documentation/architecture.png)

### 🖼️ Screenshots
- ![Architecture](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step5-documentation/architecture.png)

### 🧩 Highlights
- Consolidated report summarizing each DevOps phase.
- Includes architecture diagrams, screenshots, and workflows.
</details>

---

<details>
<summary><b>🌐 Step 6: Bonus – Open Source Contribution</b></summary>

### 🎯 Goal
Contribute ethically and meaningfully to an open-source project.

### 💡 Project
- **Website:** [https://codedrop.vercel.app/](https://codedrop.vercel.app/)
- **Repository:** [CodeDrop on GitHub](https://github.com/onkar69483/CodeDrop)

### 🧩 Contribution Details

| Type | Link |
|------|------|
| 🐛 Issue | [#30 – Add content moderation system](https://github.com/onkar69483/CodeDrop/issues/30) |
| 🔧 Pull Request | [#32 – AI-Powered Content Moderation](https://github.com/onkar69483/CodeDrop/pull/32) |

### 🖼️ Screenshots
- ![Issue](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step6-bonus-github-opensrc-contri/issue.png)
- ![Pull Request](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step6-bonus-github-opensrc-contri/pr.png)
- ![Content Blocked](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step6-bonus-github-opensrc-contri/content_blocked.png)
- ![Inappropriate Content](https://github.com/onkar69483/DevOps-CA2/raw/main/WealthWise-Group12-CA2-PRN-086-119-120-135/_CA2-documentation/step6-bonus-github-opensrc-contri/inappropriate_content.png)

### 🧠 Technical Implementation
- Integrated **Groq SDK** for AI-powered content moderation.
- Implemented **multilingual filtering** (English, Hindi, etc.).
- Added professional popup UI for inappropriate content warnings.
- Enforced strict moderation for explicit content.
- Implemented server-side and client-side validation.
- Enhanced error handling and UX clarity.

### ⚙️ Technical Changes
- Added `contentModeration.js` using `llama-3.1-8b-instant` model.
- Updated SvelteKit `+page.server.js` for backend validation.
- Created dynamic popups in `+page.svelte`.
- Added `.env` integration for `GROQ_API_KEY`.

The system now **prevents inappropriate content from being saved**, ensuring user safety and ethical content management.
</details>

---

## 📊 Summary Table

| Step | Focus Area | Tools Used |
|------|-------------|------------|
| 1 | CI/CD Pipeline | GitHub Actions |
| 2 | Configuration Management | Ansible |
| 3 | Containerization & Deployment | Docker, Kubernetes (AKS) |
| 4 | Monitoring | Prometheus, Grafana |
| 5 | Documentation | Markdown, PDF |
| 6 | Open Source Contribution | GitHub, Groq SDK, SvelteKit |

---

## 🌍 Live Links

- **Frontend (Production):** [https://mufg-wealthwise.vercel.app](https://mufg-wealthwise.vercel.app)  
- **GitHub Repository:** [DevOps-CA2-Group12](https://github.com/onkar69483/DevOps-CA2)

---

> 🛡️ **Note:** All API keys, credentials, and secrets have been rotated or redacted for security purposes.

---

✨ *End of Documentation*
