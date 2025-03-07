#          THREE TIER APPLICATION WITH AWS, EKS, HELM ARGOCD     
---

Project design for deploying a **Node.js application** that includes a **frontend (FE)**, **backend (BE)**, and **MongoDB database** (DB) on AWS using **Terraform** 
for infrastructure provisioning, **Helm** for application management, **ArgoCD** for GitOps, and key AWS services for security, hosting, and secret management.

---

### **Project Description**:
- The project is a simple Node.js web application that allows users to input data through the frontend, which is processed by the backend and stored in a MongoDB database. 
- The data is then displayed on the UI in real-time. The entire stack is deployed on an **Amazon EKS cluster** with two worker nodes, distributed across different 
- AWS subnets for frontend, backend, and database tiers. **Helm** is used for Kubernetes resource management, while **ArgoCD** is implemented for continuous deployment.

---

### **Architecture**:

#### **1. VPC and Networking**:
- **AWS VPC**: The VPC will be created using **Terraform** with public and private subnets.
  - **Public Subnets**: For hosting the frontend on specific subnets with internet access.
  - **Private Subnets**: For the backend and MongoDB database to ensure they are not directly exposed to the internet.
  - **NAT Gateway**: For backend services to access the internet securely from private subnets.
  - **Route Tables**: Route traffic from the frontend to the backend and the backend to the database.

#### **2. Kubernetes Cluster (EKS)**:
- **Amazon EKS**: The Node.js application will run on a highly available Kubernetes cluster managed by AWS.
  - **2 Worker Nodes**: Distributed across two availability zones (AZs).
  - **Node groups** will be deployed to the private subnets.

---

### **Kubernetes Objects**:

To manage and deploy the application components, we will use specific Kubernetes objects:

#### **Frontend (FE)**:
- **Deployment**: This manages the frontend Node.js web server and ensures that the correct number of replicas are running. It will scale horizontally if needed.
- **Service**: A **LoadBalancer** service will be used to expose the frontend to the internet. It will listen on port **80**.
- **Ingress**: To route external HTTP traffic to the frontend, an **Ingress** resource will be configured to handle routing rules and SSL termination (via AWS ACM).

#### **Backend (BE)**:
- **Deployment**: This manages the backend API server, which communicates with both the frontend and the MongoDB database. The backend will be scalable and run on private subnets.
- **Service**: A **ClusterIP** service will be used for the backend, exposing it internally to the frontend via port **8080**.

#### **MongoDB (DB)**:
- **StatefulSet**: Since MongoDB requires persistence and state, a **StatefulSet** will be used for deployment. This ensures consistent network identities for MongoDB pods and guarantees persistence.
- **PersistentVolumeClaim (PVC)**: This will request storage for MongoDB to persist data.
- **Service**: A **ClusterIP** service will be used for MongoDB, exposing it internally to the backend on port **27017**.

---

### **AWS Services for Hosting, Security, and Secret Management**:

#### **1. Hosting**:
- **Amazon EKS**: For hosting the Kubernetes cluster and managing the infrastructure.
- **Amazon S3** (optional): For hosting static assets (if applicable) or storing backups of MongoDB.

#### **2. Security**:
- **AWS IAM**: For managing roles and policies for access control.
  - **EKS Worker Nodes IAM Role**: To allow Kubernetes nodes to interact with other AWS services.
  - **ArgoCD IAM Role**: To allow ArgoCD to deploy resources in the EKS cluster securely.
- **AWS Security Groups**: Used to restrict access to the frontend, backend, and database. The frontend will allow traffic from the internet, while the backend and MongoDB will only accept traffic from within the VPC.

#### **3. Secret Management**:
- **AWS Secrets Manager**: For securely storing sensitive information like MongoDB connection strings, API keys, and passwords.
  - The backend will retrieve secrets dynamically at runtime (via Secrets Manager API).
  - **Terraform** can provision and manage these secrets.

---

### **Deployment and Continuous Integration (CI/CD)**:

#### **1. Helm for Application Deployment**:
- **Helm Charts**: The frontend, backend, and MongoDB database will each have separate Helm charts to manage Kubernetes resources (Deployments, Services, StatefulSets).
  - **Frontend**: Helm chart for deploying frontend pods and exposing them via a LoadBalancer.
  - **Backend**: Helm chart for deploying backend API pods, with internal ClusterIP service.
  - **MongoDB**: Helm chart with StatefulSet, PersistentVolumeClaims, and ClusterIP service.

#### **2. ArgoCD for Continuous Deployment (CD)**:
- **ArgoCD**: Implement **GitOps** using ArgoCD to manage continuous deployment. Any changes to the Helm chart or Kubernetes manifests in the Git repository will automatically trigger deployments.
  - ArgoCD will watch the repository for changes, synchronize them with the EKS cluster, and manage application lifecycle across environments (e.g., Dev, Staging, Prod).

---

### **Application Flow**:

#### **Frontend**:
- Users access the **frontend** via a public endpoint exposed through a **LoadBalancer** in the **public subnet**. They input information via a form.
- Once the form is submitted, the data is sent to the **backend** over HTTP POST requests.

#### **Backend**:
- The **backend** processes incoming requests from the frontend.
- Data is stored in the **MongoDB database** running on a StatefulSet in the private subnet.
- The backend also exposes API endpoints (e.g., `/submit`, `/fetch`) for retrieving and submitting data.

#### **MongoDB**:
- **MongoDB** stores the submitted data in collections.
- The backend retrieves this data and serves it to the frontend, displaying it in a tabular format.

---

### **Workflow for Application Deployment**:

1. **Terraform Infrastructure Setup**:
   - Use Terraform to provision the **VPC**, **Subnets**, **Security Groups**, and **Amazon EKS** cluster.
   - Create the necessary IAM roles and policies for EKS and ArgoCD to securely manage AWS resources.

2. **Helm Chart Configuration**:
   - Write Helm charts for the frontend, backend, and MongoDB services.
   - Use `helm install` to deploy each component to the EKS cluster in the appropriate subnets.

3. **ArgoCD Setup**:
   - Install **ArgoCD** on the EKS cluster and configure it to watch the Git repository containing the Helm charts.
   - As changes are pushed to the Git repository, ArgoCD will automatically apply the changes to the EKS cluster.

4. **Monitoring**:
   - Set up monitoring for the EKS cluster using **AWS CloudWatch** and **Prometheus** to monitor the health of Kubernetes resources.
   - Monitor logs and metrics for frontend, backend, and MongoDB components using **AWS CloudWatch Logs** and **Kubernetes Dashboard**.

---

- This project design provides a comprehensive solution for deploying a **Node.js-based full-stack application** on AWS using **Terraform** for infrastructure, **Helm** for Kubernetes resource management, and **ArgoCD** for continuous deployment.
- The architecture ensures that different components of the application (FE, BE, and DB) are isolated in secure subnets and managed efficiently on EKS.
- Key AWS services such as **Secrets Manager**, **IAM**, and **CloudWatch** enhance security and monitoring, ensuring a scalable and secure application environment deployment into distinct tiers (frontend, backend, database) and using Terraform for infrastructure provisioning and Helm for application deployment, the solution provides scalability, security, and ease of management.
---
```sh
docker run -d --name mongodb -p 27017:27017 -v mongo-data:/data/db mongo
docker run -d --name backend -p 8080:8080 --env MONGO_URL="mongodb://mongodb:27017/mydatabase" --link mongodb backend-app
docker run -d --name frontend -p 80:80 --env BACKEND_URL="http://backend:8080" --link backend frontend-app
```
Here's a complete Kubernetes deployment setup with ConfigMap, Secret, Deployment, and Service resources. This configuration assumes you have separate Docker images for the frontend and backend and that MongoDB runs as a separate StatefulSet or service within your Kubernetes cluster.

### Folder Structure

The structure below includes YAML files to deploy both the frontend and backend services.

```plaintext
k8s-manifests/
├── backend-deployment.yaml
├── frontend-deployment.yaml
├── mongo-statefulset.yaml
├── backend-service.yaml
├── frontend-service.yaml
├── mongo-service.yaml
├── configmap.yaml
└── secret.yaml
```

### ConfigMap (`configmap.yaml`)

The ConfigMap stores environment variables such as the backend’s MongoDB connection string and the frontend's backend API URL.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  MONGO_URL: "mongodb://mongo-service:27017/mydatabase" # Replace with your MongoDB service name
  BACKEND_URL: "http://backend-service:8080"            # Backend API URL for frontend
```

### Secret (`secret.yaml`)

Secrets can securely store sensitive information like API keys, passwords, or database credentials.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  # Replace `yourpassword` with the actual MongoDB password encoded in base64.
  MONGO_PASSWORD: dXNlcm5hbWU6cGFzc3dvcmQ= 
```

### Backend Deployment (`backend-deployment.yaml`)

This deployment configures the backend with environment variables sourced from the ConfigMap and Secret.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend-container
          image: your-dockerhub-username/backend-app:latest
          ports:
            - containerPort: 8080
          env:
            - name: MONGO_URL
              valueFrom:
                configMapKeyRef:
                  name: app-config
                  key: MONGO_URL
            - name: MONGO_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: app-secret
                  key: MONGO_PASSWORD
```

### Backend Service (`backend-service.yaml`)

This service exposes the backend to other services within the Kubernetes cluster.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
  type: ClusterIP
```

### Frontend Deployment (`frontend-deployment.yaml`)

The frontend deployment uses the backend URL from the ConfigMap to communicate with the backend API.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend-container
          image: your-dockerhub-username/frontend-app:latest
          ports:
            - containerPort: 80
          env:
            - name: BACKEND_URL
              valueFrom:
                configMapKeyRef:
                  name: app-config
                  key: BACKEND_URL
```

### Frontend Service (`frontend-service.yaml`)

The frontend service is exposed as a `LoadBalancer` so that it is accessible from outside the cluster.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

### MongoDB StatefulSet (`mongo-statefulset.yaml`)

This StatefulSet configuration deploys MongoDB with a PersistentVolumeClaim to retain data across pod restarts.

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongo
spec:
  selector:
    matchLabels:
      app: mongo
  serviceName: "mongo-service"
  replicas: 1
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
        - name: mongo
          image: mongo
          ports:
            - containerPort: 27017
          env:
            - name: MONGO_INITDB_ROOT_USERNAME
              valueFrom:
                secretKeyRef:
                  name: app-secret
                  key: MONGO_USER
            - name: MONGO_INITDB_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: app-secret
                  key: MONGO_PASSWORD
          volumeMounts:
            - name: mongo-storage
              mountPath: /data/db
  volumeClaimTemplates:
    - metadata:
        name: mongo-storage
      spec:
        accessModes: [ "ReadWriteOnce" ]
        resources:
          requests:
            storage: 1Gi
```

### MongoDB Service (`mongo-service.yaml`)

The MongoDB service is a `ClusterIP` service that other services within the cluster can use to connect to MongoDB.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mongo-service
spec:
  selector:
    app: mongo
  ports:
    - protocol: TCP
      port: 27017
      targetPort: 27017
  type: ClusterIP
```

### Deploying to Kubernetes

To deploy the application, apply each file in the correct order:

```bash
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f mongo-service.yaml
kubectl apply -f mongo-statefulset.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f frontend-deployment.yaml
```

This setup will deploy the frontend, backend, and MongoDB with ConfigMaps and Secrets for securely managing sensitive data and configurations. Replace `your-dockerhub-username` with the appropriate Docker image path for your frontend and backend applications.
