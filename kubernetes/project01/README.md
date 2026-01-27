# Learning Platform - Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the Learning Platform application.

## Architecture

- **Frontend**: React/Node.js app served by nginx (accessible externally via NodePort)
- **Backend**: FastAPI application (only accessible within cluster)
- **Database**: PostgreSQL StatefulSet (only accessible by backend)

## Network Security

- **Database Service**: ClusterIP - Only accessible within the cluster, specifically by the backend
- **Backend Service**: ClusterIP - Only accessible within the cluster, specifically by the frontend
- **Frontend Service**: NodePort - Accessible externally on port 30000

## Files

1. `storage-class.yaml` - StorageClass for persistent volumes
2. `db-secret.yaml` - Secret containing database credentials
3. `db-pvc.yaml` - PersistentVolumeClaim for database data persistence
4. `db-statefulset.yaml` - StatefulSet for PostgreSQL database
5. `db-service.yaml` - ClusterIP service for database (internal only)
6. `backend-deployment.yaml` - Deployment for FastAPI backend
7. `backend-service.yaml` - ClusterIP service for backend (internal only)
8. `frontend-deployment.yaml` - Deployment for frontend
9. `frontend-service.yaml` - NodePort service for frontend (external access)

## Prerequisites

1. Build and push Docker images for frontend and backend, or use local images with `imagePullPolicy: Never`
2. Update image names in `backend-deployment.yaml` and `frontend-deployment.yaml` if needed
3. Update the StorageClass provisioner in `storage-class.yaml` if needed (see comments in the file for different cluster types)

## Deployment Order

Apply resources in the following order:

```bash
# 1. Create StorageClass
kubectl apply -f storage-class.yaml

# 2. Create secret
kubectl apply -f db-secret.yaml

# 3. Create persistent volume claim
kubectl apply -f db-pvc.yaml

# 4. Create database StatefulSet
kubectl apply -f db-statefulset.yaml

# 5. Create database service
kubectl apply -f db-service.yaml

# 6. Create backend deployment
kubectl apply -f backend-deployment.yaml

# 7. Create backend service
kubectl apply -f backend-service.yaml

# 8. Create frontend deployment
kubectl apply -f frontend-deployment.yaml

# 9. Create frontend service
kubectl apply -f frontend-service.yaml
```

Or apply all at once:

```bash
kubectl apply -f .
```

## Accessing the Application

- **Frontend**: Access via `http://<node-ip>:30000` (NodePort)
- **Backend**: Only accessible from within the cluster via `http://backend-service:8000`
- **Database**: Only accessible from backend pods via `postgres-service:5432`

## Verification

Check the status of all resources:

```bash
# Check pods
kubectl get pods -l app=learning-platform

# Check services
kubectl get svc -l app=learning-platform

# Check StatefulSet
kubectl get statefulset postgres-db

# Check PVC
kubectl get pvc postgres-data-pvc

# Check StorageClass
kubectl get storageclass learning-platform-storage

# Check logs
kubectl logs -l component=backend
kubectl logs -l component=frontend
kubectl logs -l component=database
```

## Notes

- The database credentials are stored in a Secret for security
- The database uses a PersistentVolumeClaim with a custom StorageClass (`learning-platform-storage`) to persist data
- The StorageClass uses `rancher.io/local-path` provisioner by default (common in k3d/k3s). Update the provisioner in `storage-class.yaml` for other cluster types
- Backend connects to database using environment variables from the secret
- Frontend should be configured to call the backend service at `http://backend:8000`
