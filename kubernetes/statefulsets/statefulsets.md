## 1) What is a StatefulSet in Kubernetes?

A StatefulSet is a workload API object used to manage stateful applications. It gives Pods stable, unique identities and stable storage that persist across Pod restarts and rescheduling. Unlike a Deployment (which treats Pods as interchangeable), a StatefulSet maintains a fixed identity for each Pod based on the ordinal index (e.g. `mysql-statefulset-0`, `mysql-statefulset-1`, `mysql-statefulset-2`).

StatefulSets operate above Pods. They create Pods from a template, assign each Pod a stable name and optional PersistentVolumeClaims via `volumeClaimTemplates`, and often rely on a **headless Service** for stable network identity and direct Pod discovery.

## 2) Why StatefulSets Exist?

StatefulSets solve problems that Deployments do not address:

- **Stable identity** – Each Pod gets a stable name (`<statefulset-name>-<ordinal>`) and hostname. Clients can reach a specific replica (e.g. the primary database) by name.

- **Stable storage** – Each Pod can have its own PersistentVolumeClaim(s) created from `volumeClaimTemplates`. When a Pod is recreated, it reattaches to the same PVC and thus the same data.

- **Ordered deployment and scaling** – Pods are created in order (0, 1, 2, …) and, by default, the next Pod starts only when the previous one is Running and Ready. Scaling down happens in reverse order.

- **Ordered rolling updates** – Updates can be applied in reverse ordinal order so you can control which replica is updated first (e.g. update replicas before the primary).

- **Stateful workloads** – Databases (MySQL, PostgreSQL, MongoDB), message queues, and clustered apps that need stable network IDs and persistent storage are good candidates for StatefulSets.

## 3) StatefulSet vs Deployment

| Aspect            | Deployment                    | StatefulSet                          |
|------------------|-------------------------------|--------------------------------------|
| Pod names        | Random suffix (e.g. `nginx-7d8f9`) | Stable suffix by index (e.g. `mysql-0`, `mysql-1`) |
| Storage          | Shared or none; no per-Pod PVC | Per-Pod PVC via `volumeClaimTemplates` |
| Network identity | Usually behind a single Service IP | Often headless Service; each Pod has stable DNS |
| Order            | Pods created/replaced in no fixed order | Ordered create, scale, and update     |
| Use case         | Stateless apps (web, API)     | Stateful apps (DBs, queues, clusters) |

## 4) Key Concepts

- **Headless Service** – A Service with `clusterIP: None`. It does not assign a virtual IP; DNS returns the individual Pod IPs. StatefulSets use it so each Pod is reachable at `<pod-name>.<headless-service>.<namespace>.svc.cluster.local` (e.g. `mysql-statefulset-0.mysql-headless-svc.default.svc.cluster.local`).

- **volumeClaimTemplates** – Define PersistentVolumeClaims that the StatefulSet controller creates once per Pod. Each Pod gets a PVC named `<volumeClaimName>-<statefulsetName>-<ordinal>`. When a Pod is recreated, it binds to the same PVC and keeps the same data.

- **Stable identity** – Pods are named `<statefulset-name>-<ordinal>` (ordinal from 0 to replicas-1). This name is stable across restarts and is used for DNS and storage binding.

## 5) How to create a StatefulSet

- Imperative (quick test)

    You can get a minimal StatefulSet YAML for quick tests:

    ```
    kubectl create statefulset my-app --image=nginx --service-name=my-headless-svc --dry-run=client -o yaml
    ```

    Note: For real stateful workloads you typically need a headless Service and often `volumeClaimTemplates`, so the declarative approach is recommended.

- Declarative (recommended for production)

    1. Create a **headless Service** (required for stable network identity). Example: `mysql-headless-svc.yaml`

        ```
        kubectl apply -f mysql-headless-svc.yaml
        ```

    2. Optionally create ConfigMaps, Secrets, or StorageClass as needed. Example for MySQL init:

        ```
        kubectl apply -f mysql-configmap.yaml
        ```

    3. Create the StatefulSet (references the headless Service and may use `volumeClaimTemplates`). Example: `mysql-statefulset.yaml`

        ```
        kubectl apply -f mysql-statefulset.yaml
        ```

    The StatefulSet in this directory uses `serviceName: mysql-headless-svc`, three replicas, and a `volumeClaimTemplates` entry for `mysql-data` so each Pod gets its own 10Gi PVC.

## 6) How to list StatefulSets, check details, and get Pods

- To list all StatefulSets:

    ```
    kubectl get statefulsets
    ```

    Or short form:

    ```
    kubectl get sts
    ```

- Typical output:

    ```
    NAME               READY   AGE
    mysql-statefulset  3/3     5m
    ```

- To get StatefulSet details:

    ```
    kubectl describe statefulset mysql-statefulset
    ```

- To get the Pods created by the StatefulSet (they have stable names):

    ```
    kubectl get pods -l app=mysql-db
    ```

    Typical output:

    ```
    NAME                 READY   STATUS    RESTARTS   AGE
    mysql-statefulset-0  1/1     Running   0          6m
    mysql-statefulset-1  1/1     Running   0          5m
    mysql-statefulset-2  1/1     Running   0          4m
    ```

- To list PVCs created by the StatefulSet’s `volumeClaimTemplates`:

    ```
    kubectl get pvc
    ```

    You should see one PVC per replica (e.g. `mysql-data-mysql-statefulset-0`, `mysql-data-mysql-statefulset-1`, `mysql-data-mysql-statefulset-2`).

## 7) Scaling a StatefulSet

- Scale up (e.g. to 5 replicas):

    ```
    kubectl scale statefulset mysql-statefulset --replicas=5
    ```

    New Pods are created in order (e.g. `mysql-statefulset-3`, then `mysql-statefulset-4`).

- Scale down (e.g. to 2 replicas):

    ```
    kubectl scale statefulset mysql-statefulset --replicas=2
    ```

    By default, Pods are terminated in reverse ordinal order (highest index first). PVCs for scaled-down Pods are not deleted automatically; you can delete them manually if you no longer need that data.

## 8) Updating a StatefulSet

- Changing the Pod template (e.g. image, env, resources) triggers a rolling update. By default, the controller updates Pods in reverse ordinal order (highest index first).

- Check rollout status:

    ```
    kubectl rollout status statefulset/mysql-statefulset
    ```

- Rollback to a previous revision (if the controller supports it and revisions are available):

    ```
    kubectl rollout undo statefulset/mysql-statefulset
    ```

- You can set `spec.updateStrategy.type` to:

  - **RollingUpdate** (default) – update Pods in reverse order; you can set `partition` to update only Pods with ordinal >= partition.
  - **OnDelete** – Pods are updated only when you manually delete them.

## 9) How to delete a StatefulSet

- Delete the StatefulSet but keep its Pods (orphan Pods):

    ```
    kubectl delete statefulset mysql-statefulset --cascade=orphan
    ```

- Delete the StatefulSet and its Pods (default):

    ```
    kubectl delete statefulset mysql-statefulset
    ```

    Deleting the StatefulSet does **not** delete the PVCs created by `volumeClaimTemplates`. Delete them manually if you want to free storage:

    ```
    kubectl delete pvc -l app=mysql-db
    ```

    Or delete by name (e.g. `mysql-data-mysql-statefulset-0`, etc.).

## 10) When to use a StatefulSet

- Use a **StatefulSet** when you need:
  - Stable, unique Pod names and hostnames.
  - Stable storage per Pod that survives restarts.
  - Ordered deployment, scaling, or rolling updates.
  - Direct access to individual replicas (e.g. primary/replica databases, leader/follower).

- Use a **Deployment** when:
  - Pods are stateless and interchangeable.
  - You do not need stable names or per-Pod persistent storage.
  - You want simple rolling updates without ordered semantics.

## 11) Files in this directory

- **mysql-headless-svc.yaml** – Headless Service for the MySQL StatefulSet (no ClusterIP; DNS returns Pod IPs).
- **mysql-configmap.yaml** – ConfigMap used to initialize the MySQL database (e.g. create DB and user).
- **mysql-statefulset.yaml** – StatefulSet with 3 MySQL replicas, `volumeClaimTemplates` for `mysql-data`, and reference to `mysql-headless-svc`.
