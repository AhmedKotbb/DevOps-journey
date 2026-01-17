## 1) What is a Pod?

A Pod is the smallest deployable unit in Kubernetes: one or more containers that share the same network namespace (IP/ports), storage volumes, and specification for how to run the containers. Pods are ephemeral and usually managed through controllers (Deployments, StatefulSets, DaemonSets).

## 2) Pod anatomy — key pieces

- Containers[]: one or more container specs (image, command, args, env, ports).

- Shared network namespace: all containers in a Pod share the same IP address and localhost network.

- Volumes: storage that is mounted into one or more containers in the Pod.

- Restart policy: Always (default for Deployments), OnFailure, or Never (for bare Pods).

- Resource requests & limits: CPU/memory requests influence scheduling; limits constrain usage.

- Probes: liveness/readiness/startup probes for health and lifecycle decisions.

- Init containers: run to completion before app containers start; useful for initialization tasks.

- QoS class: Guaranteed / Burstable / BestEffort determined by requests/limits.

## 3) Pod lifecycle (status phases)

A Pod goes through phases: Pending → Running → Succeeded or Failed (and sometimes Unknown). The kubelet and control plane coordinate scheduling, starting containers, restarts, and termination. Use ```kubectl describe pod <name>``` to see events for lifecycle transitions.


## 4) How to create a Pod
- Imperative (quick test)

    Create a single Pod from an image (good for quick tests):
    ```
    kubectl run my-nginx --image=nginx --restart=Never
    ```

    You could use the followin command to get the simple yaml file for a pod creation and past it in a separated yaml file (good for quick tests):
    ```
    kubectl run web-server --image=nginx --dry-run=client -o yaml
    ```

- Declarative (recommended for production)

    Create a YAML file (easier to version/control) ,Exmple `pod.yaml`

    After you create the yaml file run: 
    ```
    kubectl apply -f pod.yaml
    ```

## 5) How to list all Pods
- `kubectl get pods` retrieves and displays a summary list of all Pods in the current namespace of your Kubernetes cluster.

- Typical output:
    ```
    NAME            READY   STATUS    RESTARTS   AGE
    nginx-example   1/1     Running   0          2m
    ```
    Name: is the name of the pod 

    Ready: `ready containers / total container`

    Status: shows the status of the pod [ Pending, Running, Succeeded, Failed, Unknown ]

    Age: when the pod is created.

- To show more details (node, IP, etc.):
    ```
    kubectl get pods -o wide
    ```

## 6) How to get pod details
```
kubectl describe pod <pod-name>
```

This command queries the Kubernetes API and displays:

- Metadata (name, namespace, labels, annotations)

- Node assignment

- Container images and commands

- Resource requests and limits

- Environment variables

- Volume mounts

- Container states and probe status

- Recent events (very important for debugging)

## 7) How to delete a Pod
```
kubectl delete pod <pod-name>
```

## 8) Types of Pods
- Single-Container Pod
    - A single-container pod runs one main application process per
    pod.

    - This is the most common design — each pod focuses on one
    responsibility (e.g., a web server, API, or worker).

    - It’s simpler, easier to manage, and follows the “one process per
    container” philosophy.

- Multi-Container Pod
    - A multi-container pod runs two or more containers that work together
    and share the same network and storage.

    - They’re tightly coupled and designed to support each other — for
    example:
        - A main app container serving content.
        - A sidecar container handling logs, proxying traffic, or syncing data.