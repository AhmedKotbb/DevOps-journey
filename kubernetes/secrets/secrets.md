## 1) What are Secrets in Kubernetes ?

A Secret is an API object used to store sensitive data such as passwords, tokens, or keys. Kubernetes stores Secret data in a way that reduces the risk of accidental exposure (e.g., less verbose logging). Pods can consume Secrets as environment variables or as files in a volume. Secret values are base64-encoded at rest; they are not encrypted by default unless you enable encryption at rest for the cluster.

## 2) Why Secrets Exist ?

Secrets solve common problems when handling sensitive data:

- **Sensitive configuration** – Store passwords, API keys, and tokens separately from container images and ConfigMaps.

- **Reduced exposure** – Secret data is not shown in `kubectl get` or `kubectl describe` by default; only the Secret object metadata and keys are visible.

- **Same consumption model as ConfigMaps** – Pods can use Secrets as env vars or as files in a volume, so your app code does not need to change.

- **Decoupling** – Change credentials without rebuilding images; update the Secret and restart or roll the workload.

Important: Do not put non-sensitive configuration in Secrets; use **ConfigMaps** for that. Use Secrets only for data that must be kept confidential.

## 3) Secret types

- **Opaque** (default) – Generic key-value data (passwords, keys, etc.). Use this for most application secrets.

- **kubernetes.io/dockerconfigjson** – Used to store a Docker config file for pulling images from a private registry.

- **kubernetes.io/service-account-token** – Used to store a token that identifies a ServiceAccount (usually managed by Kubernetes).

- **kubernetes.io/tls** – Used to store a TLS certificate and its private key (e.g., for Ingress or HTTPS).

- **bootstrap.kubernetes.io/token** – Used for bootstrap token authentication (node joining, etc.).

## 4) How to create Secrets ?

- Imperative (quick test)

    From literal key-value pairs (values are base64-encoded automatically):
    ```
    kubectl create secret generic my-secret --from-literal=password=mypass --from-literal=user=admin
    ```

    From a file:
    ```
    kubectl create secret generic my-secret --from-file=path/to/secret.properties
    ```

    You could use the following command to get the simple yaml file for a Secret and paste it in a separated yaml file (good for quick tests):
    ```
    kubectl create secret generic my-secret --from-literal=key1=value1 --dry-run=client -o yaml
    ```

- Declarative (recommended for production)

    Create a YAML file (easier to version/control). Example: `secret-demo.yaml`

    In the YAML you can use:
    - **data** – Keys and base64-encoded values. You must encode the values yourself (e.g. `echo -n 'mypassword' | base64`).
    - **stringData** – Keys and plain-text values; Kubernetes encodes them in base64 when storing. Useful for convenience; avoid committing plain text to version control.

    After you create the yaml file run:
    ```
    kubectl apply -f secret-demo.yaml
    ```

## 5) How to use Secrets in Pods ?

- **As environment variables (single key)** – Use `valueFrom.secretKeyRef` in the container `env` to inject one key from a Secret.

- **As environment variables (all keys)** – Use `envFrom.secretRef` to inject every key in the Secret as env vars.

- **As a volume** – Add a volume with `secret` and mount it into the container; each key becomes a file in the mount path, with the value as file content.

- **As command-line arguments** – Reference a Secret key via an env var and use it in `args` (e.g. `--password=$(DB_PASSWORD)`). Prefer env vars over args to reduce exposure in process lists.

Example Pod that uses a Secret: `pod.yaml` (env with `secretKeyRef`; commented `envFrom` with `secretRef`).

## 6) How to list all Secrets ?

- To list all Secrets:
    ```
    kubectl get secrets
    ```

- Typical output:
    ```
    NAME         TYPE     DATA   AGE
    db-secret    Opaque   2      2m
    ```

## 7) How to get Secret details ?

```
kubectl describe secret <secret-name>
```

This command shows:

- Metadata (name, namespace, labels, annotations)

- Type and the list of keys (key names only; values are not printed)

- Events

To view the Secret as YAML (values remain base64-encoded; avoid sharing or logging):
```
kubectl get secret <secret-name> -o yaml
```

## 8) How to delete a Secret ?

```
kubectl delete secret <secret-name>
```
