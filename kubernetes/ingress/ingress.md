## 1) What is Ingress in Kubernetes?

Ingress is an API object that manages external access to Services inside the cluster, typically HTTP and HTTPS. It provides a single entry point (host and path rules) to route traffic to different Services. Ingress does not expose arbitrary ports or protocols; it works with an **Ingress controller** (e.g., NGINX, Traefik) that runs in the cluster and implements the rules you define.

Think of Ingress as the “front door” of your cluster: one external URL or host can route to many internal Services based on hostname and path.

## 2) Why Ingress Exists?

Ingress solves common problems when exposing HTTP/HTTPS workloads:

- **Single entry point** – One external address (or a few) instead of one LoadBalancer or NodePort per Service.

- **Host-based routing** – Route traffic by hostname (e.g., `frontend.example.com` → frontend-svc, `backend.example.com` → backend-svc).

- **Path-based routing** – Route by URL path (e.g., `/api` → backend, `/` → frontend) on the same or different hosts.

- **TLS termination** – Central place to configure HTTPS and certificates (often via annotations or a TLS section).

- **Cost and simplicity** – Avoid creating a cloud LoadBalancer for every Service; one Ingress (and controller) can serve many Services.

## 3) Key Concepts

- **Ingress controller** – A component (not part of core Kubernetes) that watches Ingress resources and configures a reverse proxy/load balancer. You must install one (e.g., NGINX Ingress Controller) for Ingress to work.

- **ingressClassName** – Identifies which Ingress controller should handle this Ingress (e.g., `nginx`, `traefik`). Required in `networking.k8s.io/v1`.

- **Rules** – Each rule has a **host** (optional) and **http.paths**. Traffic matching the host and path is sent to the specified **backend** (a Service and port).

- **pathType** – How the path is matched:
  - `Prefix` – Path prefix match (e.g., `/` matches all).
  - `Exact` – Exact path match.
  - `ImplementationSpecific` – Depends on the controller.

- **Backend** – A Service (name + port) that receives the traffic. The Service must exist in the same namespace as the Ingress (or use an ExternalName Service for external backends, if supported).

## 4) How to Create Ingress

- Imperative (quick test)

  Create a minimal Ingress (controller-dependent):
  ```
  kubectl create ingress my-ingress --rule="host/path=svc-name:port"
  ```

  Example with a specific class:
  ```
  kubectl create ingress my-ingress --class=nginx --rule="frontend.example.com/=frontend-svc:80"
  ```

- Declarative (recommended for production)

  Define the Ingress and the backends (Pods + Services) in YAML.

  Example: `ingress.yaml` – Ingress with two hosts and path-based routing.

  Supporting resources (Pods and Services) for the backends:
  - `frontend.yaml` – Frontend Pod and Service (`frontend-svc:80`).
  - `backend.yaml` – Backend Pod and Service (`backend-svc:80`).

  Apply in order (backends first, then Ingress):
  ```
  kubectl apply -f frontend.yaml
  kubectl apply -f backend.yaml
  kubectl apply -f ingress.yaml
  ```

  Or apply the whole directory:
  ```
  kubectl apply -f .
  ```

  Ensure an Ingress controller (e.g., NGINX) is installed and that `ingressClassName: nginx` in `ingress.yaml` matches your controller.

## 5) How to List All Ingress and Get Details

- To list all Ingress resources:
  ```
  kubectl get ingress
  ```

- Typical output:
  ```
  NAME      CLASS   HOSTS                    ADDRESS        PORTS   AGE
  ingress   nginx   frontend.example.com,    <controller>   80      2m
                       backend.example.com
  ```

- To get Ingress details (rules, backends, events):
  ```
  kubectl describe ingress ingress
  ```

- To see the Ingress definition as YAML:
  ```
  kubectl get ingress ingress -o yaml
  ```

## 6) How to Delete Ingress

```
kubectl delete ingress ingress
```

To delete by file:
```
kubectl delete -f ingress.yaml
```

To remove the demo stack (Ingress and backend resources):
```
kubectl delete -f ingress.yaml -f frontend.yaml -f backend.yaml
```
