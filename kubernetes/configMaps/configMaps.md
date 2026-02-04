## 1) What are ConfigMaps in Kubernetes ?

A ConfigMap is an API object used to store non-confidential data in key-value pairs. Pods can consume ConfigMaps as environment variables, command-line arguments, or as configuration files in a volume.

## 2) Why ConfigMaps Exist ?

ConfigMaps solve common configuration problems in Kubernetes:

- **Decouple configuration from images** – Change config without rebuilding container images.

- **Environment variables** – Inject key-value pairs into Pods as env vars.

- **Configuration files** – Mount config files (e.g., properties, JSON) into a volume so the app reads them from the filesystem.

- **Command-line arguments** – Use ConfigMap values as args by referencing them via env vars.

- **Reuse** – The same ConfigMap can be used by multiple Pods or Deployments.

Important: Do not store secrets in ConfigMaps; use **Secrets** for sensitive data.

## 3) How to create ConfigMaps ?

- Imperative (quick test)

    From literal key-value pairs:
    ```
    kubectl create configmap my-config --from-literal=key1=value1 --from-literal=key2=value2
    ```

    From a file:
    ```
    kubectl create configmap my-config --from-file=path/to/config.properties
    ```

    From a directory (each file becomes a key):
    ```
    kubectl create configmap my-config --from-file=path/to/config-dir/
    ```

    You could use the following command to get the simple yaml file for a ConfigMap and paste it in a separated yaml file (good for quick tests):
    ```
    kubectl create configmap my-config --from-literal=key1=value1 --dry-run=client -o yaml
    ```

- Declarative (recommended for production)

    Create a YAML file (easier to version/control). Example: `configMap-demo.yaml`

    After you create the yaml file run:
    ```
    kubectl apply -f configMap-demo.yaml
    ```

## 4) How to use ConfigMaps in Pods ?

- **As environment variables (single key)** – Use `valueFrom.configMapKeyRef` in the container `env` to inject one key.

- **As environment variables (all keys)** – Use `envFrom.configMapRef` to inject every key in the ConfigMap as env vars.

- **As a volume** – Add a volume with `configMap` and mount it into the container; each key becomes a file in the mount path.

- **As command-line arguments** – Reference a ConfigMap key via an env var and use it in `args` (e.g. `--option=$(OPTION_VALUE)`).

## 5) How to list all ConfigMaps ?

- To list all ConfigMaps:
    ```
    kubectl get configmaps
    ```

- Typical output:
    ```
    NAME         DATA   AGE
    my-config    2      2m
    ```

## 6) How to get ConfigMap details ?

```
kubectl describe configmap <configmap-name>
```

This command shows:

- Metadata (name, namespace, labels, annotations)

- Data keys and values (or file contents)

- Events

To view the ConfigMap as YAML:
```
kubectl get configmap <configmap-name> -o yaml
```

## 7) How to delete a ConfigMap ?

```
kubectl delete configmap <configmap-name>
```
