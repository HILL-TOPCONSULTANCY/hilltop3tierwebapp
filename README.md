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
