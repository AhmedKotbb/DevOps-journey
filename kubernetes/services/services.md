## 1) What is a Service in Kubernetes?

A Service is a stable network endpoint for a group of Pods. Pods are ephemeral and their IPs change, so a Service gives you a fixed IP/DNS name and a load-balanced way to reach the Pods selected by labels.

## 2) Why Services Exist ?
Services solve common networking problems in Kubernetes:

- Stable access - A single DNS name and ClusterIP for changing Pod IPs.

- Load balancing - Distribute traffic across matching Pods.

- Service discovery - Access Pods by name instead of IP.

- Decoupling - Clients talk to the Service, not directly to Pods.

## 3) Service types

- ClusterIP (default) - Internal-only virtual IP, reachable from inside the cluster only.

- NodePort - Exposes the Service on each node's IP at a static port.

- LoadBalancer - Provisions a cloud load balancer and exposes it externally.

- ExternalName - Maps a Service name to an external DNS name.

- Headless (ClusterIP: None) - No virtual IP; returns Pod IPs directly.

## 4) How to create a Service
- Imperative (quick test)

    Expose an existing Deployment:
    ```
    kubectl expose deployment nginx-deployment --port=80 --target-port=80 --name=nginx-svc
    ```

    Or create a Service directly:
    ```
    kubectl create service clusterip nginx-svc --tcp=80:80
    ```

- Declarative (recommended for production)

    Example: `nginx-service.yaml`

    After you create the yaml file run:
    ```
    kubectl apply -f nginx-service.yaml
    ```

## 5) How to list all Services
- To list all services:
    ```
    kubectl get svc
    ```

- Typical output:
    ```
    NAME        TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
    nginx-svc   ClusterIP   10.96.22.153   <none>        80/TCP    2m
    ```

## 6) How to get Service details
```
kubectl describe svc nginx-svc
```

This command shows:

- Labels, selectors, and target ports

- Endpoints (Pod IPs currently behind the Service)

- Events and annotations

To view endpoints directly:
```
kubectl get endpoints nginx-svc
```

## 7) How to delete a Service
```
kubectl delete svc nginx-svc
```