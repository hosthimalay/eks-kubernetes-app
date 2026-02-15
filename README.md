# Containerised App on AWS EKS — Terraform + Kubernetes + Docker

A complete end-to-end project: a Dockerised Node.js application built, pushed to AWS ECR, and deployed to an EKS Kubernetes cluster — all provisioned with Terraform. Includes health checks, resource limits, horizontal pod autoscaling, and a Kubernetes namespace structure.

## Architecture Overview

```
Developer (VS Code)
        │
        ▼
   Docker Build
        │
        ▼
   AWS ECR (Image Registry)
        │
        ▼
┌─────────────────────────────────────────┐
│         EKS Cluster (Kubernetes)        │
│                                         │
│  Namespace: production                  │
│  ┌──────────────────────────────────┐   │
│  │  Deployment (3 replicas)         │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐     │   │
│  │  │ Pod  │ │ Pod  │ │ Pod  │     │   │
│  │  │(app) │ │(app) │ │(app) │     │   │
│  │  └──────┘ └──────┘ └──────┘     │   │
│  └──────────────────────────────────┘   │
│                   │                     │
│  ┌────────────────▼─────────────────┐   │
│  │  Service (LoadBalancer → ALB)    │   │
│  └──────────────────────────────────┘   │
│                                         │
│  HorizontalPodAutoscaler (2–10 pods)    │
│  ConfigMap + Secret management          │
└─────────────────────────────────────────┘
```

## Features

- **Docker** — Multi-stage Dockerfile for lean production image
- **ECR** — Private container registry provisioned by Terraform
- **EKS** — Managed Kubernetes cluster with managed node group
- **Kubernetes manifests** — Deployment, Service, HPA, ConfigMap, Namespace
- **Health checks** — Liveness and readiness probes
- **Resource limits** — CPU and memory requests/limits on every pod
- **HPA** — Horizontal Pod Autoscaler (scale 2→10 pods on CPU)

## Tech Stack

| Tool | Purpose |
|------|---------|
| Terraform | EKS cluster + ECR provisioning |
| Docker | Application containerisation |
| Kubernetes | Container orchestration |
| AWS EKS | Managed Kubernetes |
| AWS ECR | Container image registry |
| Node.js | Sample application |

## Project Structure

```
.
├── terraform/
│   ├── main.tf         # EKS cluster, node group, ECR
│   ├── variables.tf
│   ├── outputs.tf
│   └── backend.tf
├── app/
│   ├── server.js       # Simple Node.js HTTP server
│   ├── package.json
│   └── Dockerfile      # Multi-stage build
└── k8s/
    ├── namespace.yaml
    ├── configmap.yaml
    ├── deployment.yaml
    ├── service.yaml
    └── hpa.yaml
```

## Quick Start

### Step 1 — Provision EKS + ECR with Terraform
```bash
cd terraform/
terraform init
terraform apply
```

### Step 2 — Build and push Docker image to ECR
```bash
# Get ECR login (replace with your account ID and region)
aws ecr get-login-password --region eu-west-1 | \
  docker login --username AWS --password-stdin \
  <ACCOUNT_ID>.dkr.ecr.eu-west-1.amazonaws.com

# Build image
cd app/
docker build -t node-app .

# Tag and push
docker tag node-app:latest <ECR_REPO_URI>:latest
docker push <ECR_REPO_URI>:latest
```

### Step 3 — Configure kubectl for EKS
```bash
aws eks update-kubeconfig --name himalay-eks-cluster --region eu-west-1
kubectl get nodes
```

### Step 4 — Deploy to Kubernetes
```bash
cd k8s/
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f hpa.yaml

# Check rollout
kubectl rollout status deployment/node-app -n production
kubectl get pods -n production
kubectl get svc -n production
```

### Step 5 — Clean up
```bash
kubectl delete namespace production
cd terraform/ && terraform destroy
```

## What This Demonstrates

- Docker multi-stage image builds
- AWS ECR private registry management
- Terraform EKS cluster provisioning
- Kubernetes deployment, service, and HPA configuration
- Health check (liveness/readiness probe) patterns
- Resource requests and limits
- kubectl operational commands
