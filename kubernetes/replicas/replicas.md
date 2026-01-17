## 1) What is ReplicaSets ?

- Think of a ReplicaSet as a factory manager — if one worker (Pod) leaves, the manager instantly hires another to keep production running smoothly.

- A ReplicaSet's purpose is to maintain a stable set of replica Pods running at any given time. As such, it is often used to guarantee the availability of a specified number of identical Pods.

## 2) Why ReplicaSets Exist ?
ReplicaSets solve several core problems in distributed systems:

- High availability – Multiple replicas prevent single-Pod failure from causing downtime.

- Fault tolerance – Automatic replacement of failed Pods.

- Horizontal scaling – Increase or decrease replicas declaratively.

- Self-healing – Continuous reconciliation between desired and actual state.

ReplicaSets are part of Kubernetes’ control loop design, where controllers constantly reconcile actual cluster state with desired state.


## 3) How to list all ReplicaSets ?
You can then get the current ReplicaSets deployed:

```
kubectl get rs
```

Typical output:

```
NAME            DESIRED   CURRENT    READY  AGE
nginx-replicas   3         3         3       6s
```

## 4) How to check the state of the ReplicaSet:
```
kubectl describe rs/nginx-replicas
``` 

typical output: 
```
Name:           nginx-replicas
Namespace:      default
Selector:       app=web-server
Labels:         app=web-server-rs
Annotations:    <none>
Replicas:       3 current / 3 desired
Pods Status:    3 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:       app=web-server
  Containers:
   nginx:
    Image:      nginx:1.25
    Port:       80/TCP
    Host Port:  0/TCP
    Environment: <none>
    Mounts:     <none>
  Volumes:      <none>
Events:
  Type    Reason            Age    From                   Message
  ----    ------            ----   ----                   -------
  Normal  SuccessfulCreate  3m     replicaset-controller  Created pod: nginx-replicas-9k8fj
  Normal  SuccessfulCreate  3m     replicaset-controller  Created pod: nginx-replicas-qw2lm
  Normal  SuccessfulCreate  3m     replicaset-controller  Created pod: nginx-replicas-zp4h7

```
