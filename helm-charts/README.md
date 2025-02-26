### 1. Folder Structure

```plaintext
frontend/
├── index.html        # Main HTML file
├── styles.css        # CSS file for styling
├── app.js            # JavaScript to handle frontend logic and API requests
├── Dockerfile        # Dockerfile for building the frontend image
```

### 3. Build and Push the Frontend Docker Image

1. **Navigate to the `frontend` directory**:
   ```bash
   cd frontend
   ```

2. **Build the Docker image**:
   ```bash
   docker build -t hilltopconsultancy/threetierwebapp:frontend .
   ```

3. **Push the image to Docker Hub or another container registry**:
   ```bash
   docker push hilltopconsultancy/threetierwebapp:frontend
   ```

### 4. Helm Chart Structure for 3-Tier Deployment

Now, we’ll set up Helm charts to deploy each tier (frontend, backend, and MongoDB) on Amazon EKS with a 3-tier architecture.

#### Folder Structure for Helm Charts

```plaintext
charts/
├── frontend/
│   ├── templates/
│   │   ├── deployment.yaml    # Deployment for the frontend
│   │   ├── service.yaml       # Service for the frontend
│   └── values.yaml            # Values for frontend configuration
├── backend/
│   ├── templates/
│   │   ├── deployment.yaml    # Deployment for the backend
│   │   ├── service.yaml       # Service for the backend
│   └── values.yaml            # Values for backend configuration
└── database/
    ├── templates/
    │   ├── statefulset.yaml   # StatefulSet for MongoDB
    │   ├── service.yaml       # Service for MongoDB
    └── values.yaml            # Values for MongoDB configuration
```

#### Sample `deployment.yaml` for Frontend

**File:** `charts/frontend/templates/deployment.yaml`

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
        - name: frontend
          image: hilltopconsultancy/threetierwebapp:frontend
          ports:
            - containerPort: 80
          env:
            - name: BACKEND_URL
              value: http://backend-service:8080  # Backend service URL in the cluster
```

#### `service.yaml` for Frontend LoadBalancer Service

**File:** `charts/frontend/templates/service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: LoadBalancer
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```

#### `deployment.yaml` for Backend

**File:** `charts/backend/templates/deployment.yaml`

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
        - name: backend
          image: hilltopconsultancy/threetierwebapp:backend
          ports:
            - containerPort: 8080
          env:
            - name: MONGO_URL
              value: mongodb://mongo-service:27017/mydatabase
```

#### `service.yaml` for Backend Internal Service

**File:** `charts/backend/templates/service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
```

#### `statefulset.yaml` for MongoDB Database

**File:** `charts/database/templates/statefulset.yaml`

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
          volumeMounts:
            - name: mongo-persistent-storage
              mountPath: /data/db
  volumeClaimTemplates:
    - metadata:
        name: mongo-persistent-storage
      spec:
        accessModes: [ "ReadWriteOnce" ]
        resources:
          requests:
            storage: 1Gi
```

#### `service.yaml` for MongoDB ClusterIP Service

**File:** `charts/database/templates/service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mongo-service
spec:
  type: ClusterIP
  selector:
    app: mongo
  ports:
    - protocol: TCP
      port: 27017
      targetPort: 27017
```

### Deploying with Helm

To deploy each component, navigate to each chart’s folder and use `helm install`:

1. **Deploy the Database (MongoDB)**:
   ```bash
   helm install mongo charts/database
   ```

2. **Deploy the Backend**:
   ```bash
   helm install backend charts/backend
   ```

3. **Deploy the Frontend**:
   ```bash
   helm install frontend charts/frontend
   ```
