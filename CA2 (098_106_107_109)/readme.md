# 🧩 DevOps CA2 Project Report

## 👥 Team Members

| Name                  | PRN         |
| --------------------- | ----------- |
| **Kevin Tandon**      | 22070122098 |
| **Manan Bhimjiyani**  | 22070122107 |
| **Manas Jain**        | 22070122109 |
| **Malvika Bhadoriya** | 22070122106 |

---

## 📂 Attachments

* 📘 **PPT Report:** [OpenCVTasksReport.pptx.pdf](https://drive.google.com/file/d/1XJMx1c64VfRgrI2iijgaZEAVn62EvmQX/view?usp=sharing)
* 🖼️ **Screenshots Report:** [DevOps_CA2_SS (2).pdf](https://drive.google.com/file/d/1IrKVE0sq02NWEs00TXoa6tlW99x1-K90/view?usp=sharing)
* 💻 **Main Project (QuickCV):** [GitHub Repository](https://github.com/mananbhimjiyani/QuickCV)
* 📊 **Kaggle Notebook:** [RSNA Intracranial Aneurysm Detection](https://www.kaggle.com/code/kevintandonbtech2022/notebook-rsna-test2)
* 📸 **Kaggle Submission Screenshot:** [View Screenshot](https://drive.google.com/file/d/1vN3uk9zLhSCrkVWODNI_i9teqmF8IAoV/view?usp=sharing)
---

## 🚀 Project Overview

### 🧠 **Main Project: QuickCV (AI-Powered HR Tech Application)**

**QuickCV** is an AI-driven HR web application that streamlines the recruitment process by automating CV parsing and JD comparison.
It integrates **FastAPI (backend)**, **React (frontend)**, and **Cloudflare R2 (storage)** in a production-ready CI/CD pipeline.

#### 🌟 Core Features

* Upload **CVs and JDs** for AI-powered compatibility analysis via **Gemini API**
* Auto-extract structured details like **skills, education, and experience**
* Generate:

  * ✅ ATS Match Score
  * 📋 Summary of fit
  * 🧩 Skill Analysis (matched / missing / bonus)
  * 💡 Improvement Suggestions
* Secure document management using Cloudflare R2 with Excel-based metadata tracking

#### ⚙️ Tech Stack

**Frontend:** React + Vite + Tailwind CSS
**Backend:** FastAPI + Uvicorn
**Storage:** Cloudflare R2
**Deployment:** AWS EKS (Kubernetes)
**CI/CD Tools:** Jenkins, Docker, Ansible, Prometheus, Grafana

#### 🌐 Deployment Links

* Frontend: [Vercel Deployment](https://quickcvfrontend-git-main-kev0-4s-projects.vercel.app/)
* Backend: AWS EKS

  ```
  http://acb726f98354a4a128cbc12edd471f6b-836054913.us-east-1.elb.amazonaws.com
  ```

---

## ⚙️ DevOps CI/CD Pipeline

Our **CI/CD architecture** integrates automation, containerization, configuration management, and monitoring across all stages of deployment .

### 🔄 **Workflow Summary**

1. **Code Commit:** Developer pushes code to GitHub.
2. **Jenkins Pipeline:**

   * Automatically triggers build and test stages.
   * Runs linting, unit, and integration tests.
   * On success → builds Docker image and pushes to Docker Registry.
3. **Ansible (IaC):**

   * Configures servers and deploys environment variables.
   * Ensures consistent infrastructure setup across dev, test, and prod.
4. **Containerization (Docker):**

   * Frontend and backend are both containerized for portability.
   * Managed via private Docker Registry.
5. **Orchestration (Kubernetes):**

   * Deployments, Pods, and ReplicaSets ensure scalability and resilience.
   * Supports rolling updates and rollback strategies for zero downtime.
6. **Monitoring (Prometheus & Grafana):**

   * Prometheus collects system and network metrics.
   * Grafana dashboards visualize performance and alert anomalies in real-time.

---

### 🧩 **CI/CD Highlights**

| Task                                         | Description                                                                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Task 1: Deployment Strategy**              | Jenkins pipeline automates build, test, and deploy phases. Includes a visual pipeline diagram and real-time build status. |
| **Task 2: Configuration Management & IaC**   | Implemented Ansible playbooks for consistent environment setup and Docker service management.                             |
| **Task 3: Containerization & Orchestration** | Managed deployments, pods, and replicas through Kubernetes manifests ensuring fault tolerance and scalability.            |
| **Task 4: Monitoring & Logging**             | Integrated Prometheus and Grafana for live tracking of CPU, memory, network, and pod metrics.                             |
| **Task 5: Reflection & Learnings**           | Emphasized the importance of automation, reproducibility, and robust observability in production systems.                 |

---

## 📊 **Kaggle Project: RSNA Intracranial Aneurysm Detection**

This notebook focuses on building a **deep learning model** to detect **brain aneurysms** using radiological imaging (CTA/MRA/MRI).

**Objective:** Develop a reliable AI model for automated medical diagnosis.
**Evaluation Metric:** Weighted Multi-Label AUC ROC.
**Impact:** Enables early detection and prevention of catastrophic aneurysm ruptures, potentially saving lives.

**Competition:**

* 🧬 Hosted by **RSNA, ASNR, SNIS, ESNR**
Notebook Link → [View on Kaggle](https://www.kaggle.com/code/kevintandonbtech2022/notebook-rsna-test2)

---

## 🧠 Key Takeaways

* CI/CD integration via Jenkins drastically improves deployment reliability.
* **Ansible + Kubernetes** ensures consistent infrastructure and scalability.
* **Monitoring with Prometheus & Grafana** provides real-time observability.
* **Automation & IaC** reduce manual errors and enhance reproducibility.

---

## 🏁 Summary

This CA2 demonstrates a **complete DevOps lifecycle** — from code commit to automated deployment and monitoring — applied to a real-world **AI-driven HR Tech application (QuickCV)** and a **healthcare AI competition project (RSNA)**.

Together, they showcase the fusion of **AI, Cloud, and DevOps automation** for impactful, production-ready solutions.

---

**Submitted for:** *DevOps CA2*
**By:** Kevin Tandon, Manan Bhimjiyani, Manas Jain, Malvika Bhadoriya

