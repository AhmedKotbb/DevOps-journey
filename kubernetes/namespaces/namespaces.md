## 1) What Is a Namespace in Kubernetes ?

A namespace is a logical partition within a Kubernetes cluster that allows you to group, isolate, and manage Kubernetes resources. Namespaces provide a mechanism for dividing a single physical cluster into multiple virtual clusters.

Namespaces do not provide strong security isolation by themselves; they primarily serve as an organizational and administrative boundary.

Think of a Kubernetes cluster like an apartment building. Each
namespace is a separate apartment — tenants live independently, but
they all share the same building infrastructure. 


## 2) Why Namespaces Exist ?

Namespaces are designed to solve several operational problems:

- Resource name collisions

    You can have multiple objects with the same name as long as they are in different namespaces.

- Multi-tenancy

    Different teams or projects can share a cluster while maintaining separation.

- Environment separation

    Commonly used to isolate dev, test, staging, and production.

- Access control (RBAC)

    Permissions can be granted at the namespace level.

- Resource governance

    Resource quotas and limits can be enforced per namespace.


## 3) Default Namespaces in Kubernetes

A standard Kubernetes cluster ships with several predefined namespaces:

| Namespace         | Purpose                                     |
| ----------------- | ------------------------------------------- |
| `default`         | Used when no namespace is specified         |
| `kube-system`     | Core Kubernetes system components           |
| `kube-public`     | Publicly readable data (e.g., cluster info) |
| `kube-node-lease` | Node heartbeat and lease objects            |

Important Note: You should never deploy application workloads into kube-system.

## 4) Namespaced vs Cluster-Scoped Resources
Not all Kubernetes resources live inside namespaces.

Namespaced resources :

- Pods

- Deployments

- Services

- ConfigMaps

- Secrets

- Ingress

- StatefulSets

Cluster-scoped resources :

- Nodes

- PersistentVolumes

- StorageClasses

- Namespaces themselves

- ClusterRoles / ClusterRoleBindings

## 5) Creating a namespace 

- Imperative

```
kubectl create namespace <namespace-name>
```

- Declarative

Example: `development-namespace.yaml`

## 6) Working with Kubernetes namespaces

List all namesapces

```
kubectl get ns
```
List all pods in a namespace 

```
kubectl get pods --namespace=namespace-name
```
Describe a namespace

```
kubectl describe namespace <namespace-name>
```

Delete namespaces 

```
kubectl delete namespace <namespace-name>
```
