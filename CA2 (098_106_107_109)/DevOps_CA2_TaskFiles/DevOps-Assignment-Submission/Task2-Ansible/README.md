# Task 2: Configuration Management with Ansible

## Tool: Ansible

## Overview
Automated infrastructure setup using Ansible playbook to configure QuickCV runtime environment.

## Files
- `inventory.ini` - Inventory file (localhost target)
- `playbook.yml` - Main Ansible playbook

## What It Does
1. **Install Packages**: Installs Python dependencies (FastAPI, uvicorn, pandas, etc.)
2. **Create Users**: Configures docker group for user
3. **Manage Files**: Creates application directories (data, logs, uploads, backups)
4. **Configure System**: Sets up config files and environment

## Execution
ansible-playbook -i inventory.ini playbook.yml

text

## Results
- Python packages installed system-wide
- Application directory: /home/manan/quickcv-app
- Subdirectories created: data, logs, uploads, backups
- Config file: config.env
- Docker access configured

## Screenshots
- Playbook execution (all tasks green)
- PLAY RECAP (ok=7, changed=5, failed=0)
- Verification commands (pip list, ls, cat config)
