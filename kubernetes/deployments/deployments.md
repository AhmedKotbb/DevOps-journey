## 1) What is Deployment in Kubernetes ? 
A Deployment in Kubernetes is a controller resource that manages the desired state for your applications running in Pods. Instead of manually creating and monitoring Pods, you describe what you want (e.g., number of replicas, container image, update strategy) and the Kubernetes control plane ensures the actual cluster state matches it.

Deployments operate above Pods and ReplicaSets. A ReplicaSet ensures a set number of identical Pods run, and a Deployment manages that ReplicaSet and its updates.

## 2) Why Deployments Exist ?
- Rollout a ReplicaSet. The ReplicaSet creates Pods in the background. Check the status of the rollout to see if it succeeds or not.

- Declare the new state of the Pods by updating the PodTemplateSpec of the Deployment. A new ReplicaSet is created, and the Deployment gradually scales it up while scaling down the old ReplicaSet, ensuring Pods are replaced at a controlled rate. Each new ReplicaSet updates the revision of the Deployment

- Rollback to an earlier Deployment revision if the current state of the Deployment is not stable. Each rollback updates the revision of the Deployment.

- Scale up the Deployment to facilitate more load.

- Pause the rollout of a Deployment to apply multiple fixes to its PodTemplateSpec and then resume it to start a new rollout.

- Use the status of the Deployment as an indicator that a rollout has stuck.

- Clean up older ReplicaSets that you don't need anymore.

## 3) How to create Deployments ?
- Imperative (quick test)

    ```
    kubectl create deployment nginx-deployment --image=nginx:1.25 --replicas=3
    ```


    You could use the followin command to get the simple yaml file for a deployment creation and past it in a separated yaml file (good for quick tests)

    ```
    kubectl create deployment nginx-deployment --image=nginx:1.25 --replicas=3 --dry-run=client -o yaml
    ```

- Declarative (recommended for production)

    Example: `nginx-deployment.yaml`

    After you create the yaml file run: 
    ```
    kubectl apply -f nginx-deployment.yaml
    ```

## 4) How to list all Deployments, check Deployment details, and get Pods created by Deployment ? 

- To list all deployments:
    ```
    kubectl get deployments
    ```

- To get deployment details:
    ```
    kubectl describe deployment nginx-deployment 
    ```

- To get the pods created by a deployment: 
    ```
    kubectl get pods -l <label>
    ```

- To see the Deployment rollout status:
    ```
    kubectl rollout status deployment/<deployment-name>
    ```


## 5) Updating a Deployment.

A Deployment's rollout is triggered if and only if the Deployment's Pod template (that is, .spec.template) is changed, for example if the labels or container images of the template are updated. Other updates, such as scaling the Deployment, do not trigger a rollout.

so for example if you change the nginx image in the `nginx-deployment.yaml`
to be `nginx:1.16.1` and use the apply command to apply changes a new rollout is created

Run `kubectl get rs` to see that the Deployment updated the Pods by creating a new ReplicaSet and scaling it up to 3 replicas, as well as scaling down the old ReplicaSet to 0 replicas.

Typical output: 

```
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-1564180365   3         3         3       6s
nginx-deployment-2035384211   0         0         0       36s
```

Next time you want to update these Pods, you only need to update the Deployment's Pod template again.

Note: When a change in the deployment happens, Kubernetes does not replace all Pods at once. Instead, it performs a rolling update, gradually replacing old Pods with new ones while keeping the application available. this ensures zero or minimal downtime.

## 6) Rolling Back a Deployment

First, check the revisions of this Deployment:

```
kubectl rollout history deployment/nginx-deployment
```

The output:

```
deployment.apps/nginx-deployment 
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```

To see the details of each revision:

```
kubectl rollout history deployment/nginx-deployment --revision=2
```

The output:

```
nginx-deployment --revision=2
deployment.apps/nginx-deployment with revision #2
Pod Template:
  Labels:       app=nginx-web-server
        pod-template-hash=6d7d4d8475
  Containers:
   nginx:
    Image:      nginx:1.16.1
    Port:       80/TCP
    Host Port:  0/TCP
    Environment:        <none>
    Mounts:     <none>
  Volumes:      <none>
  Node-Selectors:       <none>
  Tolerations:  <none>
```

To Rollback to the previous revision:

```
kubectl rollout undo deployment/nginx-deployment
```

Alternatively, you can rollback to a specific revision by specifying it with `--to-revision`:

```
kubectl rollout undo deployment/nginx-deployment --to-revision=1
```