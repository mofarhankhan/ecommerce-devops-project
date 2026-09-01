🚀 E-Commerce DevOps CI/CD Project

A production-style DevOps lab project demonstrating how a containerized
3-tier e-commerce application can be built, tested, packaged, pushed to
a container registry, and deployed to Kubernetes through a Jenkins CI/CD
pipeline.

The main goal of this project was not only to deploy an application, but
to understand the complete DevOps workflow from Git push → Jenkins →
automated testing → Docker image build → Docker Hub → Kubernetes
deployment → rollout verification → health check → rollback.

📌 Project Overview

This project contains a simple e-commerce application with:

Frontend: HTML, CSS and Vanilla JavaScript

Backend: Node.js + Express.js

Database: MySQL

Containerization: Docker

Container Registry: Docker Hub

Orchestration: Kubernetes

Local Kubernetes Cluster: kind

CI/CD: Jenkins

Testing: Jest + Supertest

Web Server / Reverse Proxy: Nginx

Remote Deployment: SSH

Configuration Management: Kubernetes ConfigMap

Sensitive Configuration: Kubernetes Secret

Storage: Kubernetes PV/PVC

Deployment Strategy: Kubernetes Rolling Update

Deployment Safety: Rollout verification + automatic rollback

Application Verification: Kubernetes-based health check

Source Control: Git + GitHub

🏗️ Architecture

flowchart LR
    Dev[Developer] --> Git[Git / GitHub]

    Git --> Jenkins[Jenkins CI/CD Server]

    Jenkins --> Checkout[Checkout Source Code]
    Checkout --> Test[npm ci + Jest/Supertest]
    Test --> Build[Build Docker Images]

    Build --> BackendImage[ecommerce-backend]
    Build --> FrontendImage[ecommerce-frontend]

    BackendImage --> DockerHub[Docker Hub]
    FrontendImage --> DockerHub

    Jenkins -->|SSH| K8s[Kubernetes Machine]

    DockerHub --> K8s

    K8s --> Frontend[Frontend Deployment]
    K8s --> Backend[Backend Deployment]
    K8s --> MySQL[MySQL Deployment]

    Frontend --> Nginx[Nginx]
    Nginx --> Backend
    Backend --> MySQL

    K8s --> Verify[Rollout Status]
    Verify --> Health[Application Health Check]
    Verify --> Rollback[Automatic Rollback on Failure]

🔄 CI/CD Workflow

The complete pipeline follows this flow:

Developer
   ↓
GitHub
   ↓
Jenkins
   ↓
Checkout
   ↓
Workspace Verification
   ↓
Install Dependencies
   ↓
Run Backend Tests
   ↓
Build Backend Docker Image
   ↓
Build Frontend Docker Image
   ↓
Push Images to Docker Hub
   ↓
SSH to Kubernetes Machine
   ↓
Update Kubernetes Deployments
   ↓
Kubernetes Rollout Verification
   ↓
Application Health Check
   ↓
SUCCESS ✅

If Kubernetes rollout verification fails:

Deployment Failure
       ↓
Catch Failure
       ↓
kubectl rollout undo
       ↓
Previous Version Restored
       ↓
Pipeline Marked FAILED

📂 Project Structure

ecommerce-devops-project/
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── test/
│       └── server.test.js
│
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── script.js
│   └── style.css
│
├── database/
│   ├── init.sql
│   └── schema.sql
│
├── k8s/
│   ├── namespace.yml
│   ├── configmap.yml
│   ├── secret.yml
│   ├── mysql-pv.yml
│   ├── mysql-pvc.yml
│   ├── mysql-init-config.yml
│   ├── mysql-deployment.yml
│   ├── mysql-service.yml
│   ├── backend-deployment.yml
│   ├── backend-service.yml
│   ├── frontend-deployment.yml
│   └── frontend-service.yml
│
├── docker-compose.yml
├── Jenkinsfile
└── README.md

🧩 Application Architecture

Frontend

The frontend is a lightweight web application built using:

HTML

CSS

Vanilla JavaScript

Nginx

The frontend is packaged into an Nginx Alpine Docker image.

Nginx serves the static frontend files and proxies API requests toward
the backend service.

Example:

Browser
   ↓
Nginx
   ↓
Backend Service
   ↓
Node.js API

Backend

The backend is built using:

Node.js

Express.js

MySQL2

CORS

dotenv

The API exposes endpoints such as:

GET /
GET /products

The /products endpoint retrieves products from MySQL.

Example response:

[
  {
    "id": 1,
    "name": "Laptop",
    "price": 55000
  },
  {
    "id": 2,
    "name": "Mobile",
    "price": 25000
  },
  {
    "id": 3,
    "name": "Keyboard",
    "price": 2000
  }
]

Database

MySQL is used as the application's relational database.

The database contains a products table.

Example data used during testing:

ID Product      Price

 1 Laptop       55000
 2 Mobile       25000
 3 Keyboard      2000

🐳 Docker

The application is containerized into separate images.

Backend Dockerfile

The backend uses:

FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]

The backend image is published as:

mofarhankhann/ecommerce-backend

Images are tagged using the Jenkins build number.

Example:

mofarhankhann/ecommerce-backend:11
mofarhankhann/ecommerce-backend:latest

Using the Jenkins build number gives each CI/CD build a unique image
version.

Frontend Dockerfile

The frontend uses Nginx:

FROM nginx:alpine

COPY . /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

The frontend image is published as:

mofarhankhann/ecommerce-frontend

Example:

mofarhankhann/ecommerce-frontend:11
mofarhankhann/ecommerce-frontend:latest

☸️ Kubernetes

The application runs inside a Kubernetes namespace:

devops-app

The Kubernetes environment contains:

Frontend Deployment
       ↓
Frontend Service
       ↓
Nginx
       ↓
Backend Service
       ↓
Backend Deployment
       ↓
MySQL Service
       ↓
MySQL Deployment

Kubernetes Resources

Namespace

Creates an isolated namespace:

devops-app

ConfigMap

Stores non-sensitive application configuration such as:

BACKEND_PORT
DB_HOST
DB_PORT
DB_NAME
DB_USER

Secret

Stores sensitive information such as the database password.

Deployment

The project contains deployments for:

frontend-deployment
backend-deployment
mysql-deployment

Services

Services provide stable networking between components:

frontend-service
backend-service
mysql-service

Persistent Storage

MySQL uses:

PersistentVolume
PersistentVolumeClaim

This prevents the database storage from depending only on the lifetime
of the MySQL container.

🔐 Configuration and Secrets

Application configuration is injected into the backend container through
Kubernetes.

Example:

env:
  - name: DB_HOST
    valueFrom:
      configMapKeyRef:
        name: ecommerce-config
        key: DB_HOST

The database password is taken from a Kubernetes Secret:

- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: ecommerce-secret
      key: DB_PASSWORD

The important DevOps concept here is that application configuration is
separated from the container image.

⚠️ In a real production environment, Kubernetes Secrets should be
managed carefully and should not contain plain-text credentials
committed to a public Git repository. Prefer external secret
management such as a cloud secret manager or Vault.

🧪 Backend Testing

Jest and Supertest are used for API testing.

The project contains:

backend/test/server.test.js

Example test:

const request = require("supertest");
const app = require("../server");

describe("Backend API Tests", () => {
    test("GET / should return API running message", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("DevOps Practice API is running");
    });
});

The test is executed through:

npm test

Jenkins automatically executes the test before Docker images are built.

This means:

Test Failure
    ↓
Pipeline Stops
    ↓
Docker Build Does Not Continue

🔧 Jenkins CI/CD

Jenkins is the central CI/CD server.

The pipeline is defined inside:

Jenkinsfile

This is important because the CI/CD configuration is stored alongside
the application source code.

🚦 Jenkins Pipeline Stages

The pipeline contains the following major stages.

1. Checkout

stage('Checkout')

Jenkins retrieves the source code from the Git repository.

2. Verify Workspace

stage('Verify Workspace')

Commands such as:

pwd
ls -la

are used to confirm the workspace and project structure.

This is mainly useful for learning and debugging.

3. Install Backend Dependencies

stage('Install Backend Dependencies')

Jenkins enters the backend directory and executes:

npm ci

npm ci is preferred in CI environments because it installs
dependencies according to package-lock.json.

4. Test Backend

stage('Test Backend')

Jenkins executes:

npm test

If tests fail, the pipeline stops before Docker images are pushed or
deployed.

🏗️ Docker Image Build

Jenkins builds both application images.

Backend:

docker build \
  -t mofarhankhann/ecommerce-backend:${BUILD_NUMBER} \
  -t mofarhankhann/ecommerce-backend:latest \
  ./backend

Frontend:

docker build \
  -t mofarhankhann/ecommerce-frontend:${BUILD_NUMBER} \
  -t mofarhankhann/ecommerce-frontend:latest \
  ./frontend

BUILD_NUMBER is provided automatically by Jenkins.

For example, if Jenkins build number is:

11

the image becomes:

ecommerce-backend:11

This gives every pipeline execution a traceable version.

📦 Docker Hub

Images are pushed to Docker Hub:

mofarhankhann/ecommerce-backend
mofarhankhann/ecommerce-frontend

Jenkins uses a stored credential:

dockerhub-credentials

The password is passed using:

--password-stdin

instead of putting the password directly into the command.

🔑 Jenkins Credentials

Docker Hub credentials were configured in Jenkins as:

dockerhub-credentials

The Jenkins pipeline accesses them using:

withCredentials([
    usernamePassword(
        credentialsId: 'dockerhub-credentials',
        usernameVariable: 'DOCKERHUB_USERNAME',
        passwordVariable: 'DOCKERHUB_PASSWORD'
    )
])

This prevents the password from being hard-coded inside the Jenkinsfile.

🖥️ Separate Jenkins and Kubernetes Machines

A major goal of this project was to simulate a more realistic
infrastructure instead of running everything on one machine.

Jenkins Machine

Responsible for:

Git checkout
↓
Dependency installation
↓
Testing
↓
Docker image build
↓
Docker Hub push
↓
Remote deployment trigger

Kubernetes Machine

Responsible for:

kind cluster
↓
Kubernetes deployments
↓
Frontend
↓
Backend
↓
MySQL

The Jenkins machine does not need to run the Kubernetes cluster.

Instead, Jenkins connects to the Kubernetes machine through SSH:

Jenkins Machine
      |
      | SSH
      ↓
Kubernetes Machine
      |
      ↓
kind Kubernetes Cluster

This separation provides a useful production-style DevOps lab
experience.

🔐 SSH-Based Deployment

Jenkins connects to the Kubernetes machine using:

ssh makk@192.168.1.11

The Jenkins Linux user was configured so it can establish the SSH
connection without manually entering a password during every pipeline
execution.

Jenkins then executes Kubernetes commands remotely.

🚀 Kubernetes Deployment

The pipeline updates the running deployments using:

kubectl set image

Backend:

kubectl set image deployment/backend-deployment \
backend=mofarhankhann/ecommerce-backend:${BUILD_NUMBER} \
-n devops-app

Frontend:

kubectl set image deployment/frontend-deployment \
frontend=mofarhankhann/ecommerce-frontend:${BUILD_NUMBER} \
-n devops-app

The important point is that Jenkins deploys the exact image version
created by that Jenkins build.

Example:

Jenkins Build #11
       ↓
Docker Image :11
       ↓
Docker Hub
       ↓
Kubernetes
       ↓
Deployment uses :11

🔄 Kubernetes Rolling Update

When the image is changed using:

kubectl set image

Kubernetes performs a rolling update.

The old Pod is gradually replaced by the new Pod.

The pipeline waits for the rollout to complete:

kubectl rollout status deployment/backend-deployment \
-n devops-app \
--timeout=120s

and:

kubectl rollout status deployment/frontend-deployment \
-n devops-app \
--timeout=120s

♻️ Automatic Rollback

The pipeline contains failure handling around Kubernetes rollout
verification.

If deployment verification fails:

Rollout Failure
      ↓
Catch Exception
      ↓
kubectl rollout undo
      ↓
Previous Deployment Version
      ↓
Pipeline Failed

Rollback command:

kubectl rollout undo deployment/backend-deployment -n devops-app

and:

kubectl rollout undo deployment/frontend-deployment -n devops-app

This demonstrates an important production deployment concept:

A failed deployment should not blindly remain in production.

❤️ Application Health Check

After deployment verification, the pipeline performs an
application-level health check.

A temporary Kubernetes Pod using curl is started:

kubectl run health-check-${BUILD_NUMBER}

The backend endpoint is tested:

curl -f http://backend-service:5000/

The -f option makes curl return a failure status when the HTTP request
fails.

Therefore:

Deployment
    ↓
Rollout Successful
    ↓
Application Health Check
    ↓
HTTP 200
    ↓
Pipeline SUCCESS

🌐 Accessing the Application

The frontend can be exposed locally through Kubernetes port forwarding.

Example:

kubectl port-forward service/frontend-service \
-n devops-app 8080:80 \
--address=0.0.0.0

Then open:

http://<KUBERNETES-MACHINE-IP>:8080

The browser loads the frontend through Nginx.

The frontend communicates with the backend, and the backend retrieves
product data from MySQL.

🔍 Useful Kubernetes Commands

Check all Pods:

kubectl get pods -n devops-app

Check Services:

kubectl get svc -n devops-app

Check Deployments:

kubectl get deployments -n devops-app

Check rollout:

kubectl rollout status deployment/backend-deployment -n devops-app

Check backend logs:

kubectl logs deployment/backend-deployment -n devops-app

Check frontend logs:

kubectl logs deployment/frontend-deployment -n devops-app

Check MySQL:

kubectl logs deployment/mysql-deployment -n devops-app

Check deployment history:

kubectl rollout history deployment/backend-deployment -n devops-app

Rollback manually:

kubectl rollout undo deployment/backend-deployment -n devops-app

🧰 Technologies Used

Category                 Technology

Source Control           Git
Repository               GitHub
CI/CD                    Jenkins
Containerization         Docker
Container Registry       Docker Hub
Orchestration            Kubernetes
Kubernetes Environment   kind
Frontend                 HTML, CSS, JavaScript
Web Server               Nginx
Backend                  Node.js
API Framework            Express.js
Database                 MySQL
Database Driver          mysql2
Testing                  Jest
API Testing              Supertest
Remote Access            SSH
OS / Environment         Linux / Ubuntu
Configuration            Kubernetes ConfigMap
Secrets                  Kubernetes Secret
Storage                  Kubernetes PV/PVC

🎯 DevOps Concepts Demonstrated

This project demonstrates practical knowledge of:

Git-based development workflow

GitHub repository management

Jenkins Pipeline as Code

CI/CD automation

Jenkins credentials management

Automated dependency installation

Automated backend testing

Docker image creation

Docker image tagging

Docker image versioning

Docker Hub image publishing

Kubernetes Deployments

Kubernetes Services

Kubernetes Namespace

Kubernetes ConfigMap

Kubernetes Secrets

Kubernetes PersistentVolume

Kubernetes PersistentVolumeClaim

Kubernetes rolling updates

Kubernetes rollout verification

Kubernetes rollback

Application health checking

SSH-based remote deployment

Separation of CI and deployment environments

Containerized application architecture

Frontend → Backend → Database communication

🧠 What I Learned From This Project

The main learning objective was to understand how DevOps tools work
together instead of learning each tool independently.

The final workflow is:

GitHub
   ↓
Jenkins
   ↓
Automated Test
   ↓
Docker Build
   ↓
Docker Hub
   ↓
SSH
   ↓
Kubernetes
   ↓
Rolling Deployment
   ↓
Verification
   ↓
Health Check
   ↓
Application

I also learned that a CI/CD pipeline should not simply deploy an
application. It should provide controls around the deployment:

Build
Test
Package
Publish
Deploy
Verify
Recover

🏆 Project Highlights for Resume

E-Commerce DevOps CI/CD Automation

Built and containerized a 3-tier e-commerce application using
Node.js, Express.js, MySQL, Docker and Nginx.

Implemented a Jenkins Declarative Pipeline for automated source
checkout, dependency installation, backend testing, Docker image
creation and Docker Hub publishing.

Implemented versioned Docker image tagging using Jenkins
BUILD_NUMBER for traceable application releases.

Deployed frontend and backend containers to a Kubernetes cluster
running on a separate machine through SSH-based remote deployment.

Configured Kubernetes Deployments, Services, ConfigMaps, Secrets
and persistent storage for the application stack.

Implemented Kubernetes rolling deployment verification using
kubectl rollout status.

Added automatic rollback using kubectl rollout undo when
deployment verification fails.

Added an application-level HTTP health check after deployment.

Used Jest and Supertest to automate backend API testing before
container image publishing.

Practiced a production-style separation between the Jenkins CI
server and Kubernetes deployment environment.

📸 Suggested Project Evidence / Screenshots

For a portfolio or resume, capture screenshots of:

1. GitHub Repository

Show:

Jenkinsfile
backend/
frontend/
database/
k8s/
README.md

2. Jenkins Pipeline

Capture the complete successful pipeline showing:

Checkout
Verify Workspace
Install Backend Dependencies
Test Backend
Build Backend Docker Image
Build Frontend Docker Image
Push Backend Image
Push Frontend Image
Deploy To Kubernetes
Verify Kubernetes Deployment
Application Health Check

3. Jenkins Console Output

Show:

BUILD SUCCESS

and Docker/Kubernetes deployment logs.

4. Docker Hub

Show both repositories:

ecommerce-backend
ecommerce-frontend

and their versioned tags.

5. Kubernetes

Run:

kubectl get pods -n devops-app

and capture:

backend     Running
frontend    Running
mysql       Running

Also capture:

kubectl get svc -n devops-app

6. Application UI

Open the application in the browser and capture the product page
showing:

Laptop
Mobile
Keyboard

This proves that:

Frontend
   ↓
Backend API
   ↓
MySQL

is working.

📌 Future Improvements

This lab can be extended further with:

SonarQube code quality analysis

Trivy vulnerability scanning with an agreed security policy

Jenkins shared libraries

Kubernetes Ingress

TLS/HTTPS

Helm charts

Terraform infrastructure provisioning

AWS EKS deployment

AWS ECR

Prometheus monitoring

Grafana dashboards

Alertmanager

Centralized logging

Blue/Green deployments

Canary deployments

Argo CD / GitOps

External Secrets / cloud secret manager

Jenkins agents instead of running every task on the controller

Image signing and verification

Automated integration tests

Production-grade database backup and recovery

These are future improvements; the current project focuses on building a
strong end-to-end CI/CD foundation without making the lab unnecessarily
large.

👨‍💻 Author

Mohd Farhan Khan

DevOps Engineer --- Docker | Kubernetes | AWS | Jenkins | CI/CD |
Linux | Git | Python | Cloud & Automation

⭐ Final Project Flow

                   ┌───────────────┐
                   │   Developer   │
                   └───────┬───────┘
                           │
                           ▼
                   ┌───────────────┐
                   │    GitHub     │
                   └───────┬───────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │      Jenkins      │
                 │                   │
                 │ Checkout          │
                 │ Test              │
                 │ Docker Build      │
                 │ Docker Push       │
                 └────────┬──────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │   Docker Hub  │
                  └───────┬───────┘
                          │
                    SSH   │
                          ▼
                ┌────────────────────┐
                │ Kubernetes Machine │
                │                    │
                │ Frontend           │
                │ Backend            │
                │ MySQL              │
                └─────────┬──────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Rollout + Health│
                 │     Check       │
                 └────────┬────────┘
                          │
                    ┌─────┴─────┐
                    │           │
                    ▼           ▼
                 SUCCESS      FAILURE
                               │
                               ▼
                           ROLLBACK

🚀 Conclusion

This project demonstrates an end-to-end DevOps workflow where
application source code is automatically tested, containerized,
versioned, published, remotely deployed to Kubernetes, verified,
health-checked and recoverable through rollback.

The project is designed as a practical DevOps lab to demonstrate not
just individual tools, but how GitHub, Jenkins, Docker, Docker Hub,
SSH and Kubernetes work together as one CI/CD system.