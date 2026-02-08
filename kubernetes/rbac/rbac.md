## 1) What is RBAC in kubernetes ?
RBAC (Role-Based Access Control) is a core Kubernetes security
mechanism that lets you define who can do what on which resources
inside the cluster.

It gives you fine-grained control over:

- Users
- Service Accounts
- Workloads (pods, controllers, CI/CD pipelines)

## 2) Why we need RBAC ? 
RBAC ensures that every interaction with the cluster follows the principle
of least privilege - meaning users or services get only the permissions
they absolutely need.

## 3) Core RBAC Objects

### Role

A Role defines a set of permissions within a specific **namespace**. It grants verbs (actions) like `get`, `list`, `watch`, `create`, `update`, `delete` on resources such as Pods, Services, or ConfigMaps.

### RoleBinding

A RoleBinding links a Role to one or more subjects (users, groups, or ServiceAccounts) within the same namespace. It grants the permissions defined in the Role to those subjects.

### ClusterRole

A ClusterRole is like a Role but cluster-wide (not namespaced). It can grant permissions on cluster-scoped resources (e.g., nodes, PersistentVolumes) or can be used across namespaces when referenced by a ClusterRoleBinding.

### ClusterRoleBinding

A ClusterRoleBinding links a ClusterRole to subjects cluster-wide. Any subject in the binding gets the ClusterRole permissions across the entire cluster.

## 4) How to Create RBAC Resources

- Imperative (quick test)

    Create a Role:
    ```
    kubectl create role pod-reader --verb=get,list,watch --resource=pods
    ```

    Create a RoleBinding:
    ```
    kubectl create rolebinding pod-reader-binding --role=pod-reader --user=ahmed
    ```

    To get the YAML for quick tests:
    ```
    kubectl create role pod-reader --verb=get,list,watch --resource=pods --dry-run=client -o yaml
    ```

- Declarative (recommended for production)

    Example files in this directory:
    - `pod-reader.yaml` – Role that allows `get`, `watch`, `list` on Pods in the default namespace.
    - `pod-reader-role-binding.yaml` – RoleBinding that grants the `pod-reader` Role to user `ahmed`.

    Apply in order (Role first, then RoleBinding):
    ```
    kubectl apply -f pod-reader.yaml
    kubectl apply -f pod-reader-role-binding.yaml
    ```

    Or apply the whole directory:
    ```
    kubectl apply -f .
    ```

## 5) How to List RBAC Resources

- To list Roles:
    ```
    kubectl get roles
    ```

- To list RoleBindings:
    ```
    kubectl get rolebindings
    ```

- To list ClusterRoles:
    ```
    kubectl get clusterroles
    ```

- To list ClusterRoleBindings:
    ```
    kubectl get clusterrolebindings
    ```

- Typical output (Roles):
    ```
    NAME         CREATED AT
    pod-reader   2025-02-08T12:00:00Z
    ```

## 6) How to Get RBAC Details

- Role details:
    ```
    kubectl describe role pod-reader
    ```

- RoleBinding details (shows roleRef and subjects):
    ```
    kubectl describe rolebinding pod-reader-binding
    ```

- To view as YAML:
    ```
    kubectl get role pod-reader -o yaml
    kubectl get rolebinding pod-reader-binding -o yaml
    ```

## 7) How to Delete RBAC Resources

- Delete a RoleBinding (remove permissions first; deleting the RoleBinding does not delete the Role):
    ```
    kubectl delete rolebinding pod-reader-binding
    ```

- Delete a Role (after removing all RoleBindings that reference it):
    ```
    kubectl delete role pod-reader
    ```

- Delete by file:
    ```
    kubectl delete -f pod-reader-role-binding.yaml -f pod-reader.yaml
    ```
