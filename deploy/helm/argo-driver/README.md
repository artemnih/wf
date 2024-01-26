# Argo Compute driver

This Chart includes Argo Chart as a dependency. Argo Chart is a wrapper around bitnami/argo-workflows Chart with SSO secret template added.

## Prerequisites

1. Configure SSO with LabShare Auth

    We are following [Argo Server SSO docs](https://argoproj.github.io/argo-workflows/argo-server-sso/#to-start-argo-server-with-sso).

    a. In LabShare Auth create a new Web App

    - Callback URLs: https://<argo_ingress_url>/oauth2/callback
    - Post logout redirect URLs: https://<argo_ingress_url>/oauth2/logout
    - Response types: code
    - Grant types: authorization_code, refresh_token
    - Token Endpoint Auth Method: client_secret_post
    - Providers: (choose any you wish to enable)

    b. Enable the following fields in the values.yaml

    ```yaml
    argo:
        argoworkflows:
            server:
                auth:
                    sso:
                        issuer: https://<LabShare Auth URL>/auth/<tenant>
                        clientId:
                            value: <client_id>
                        clientSecret:
                            value: <client_secret>
                        redirectUrl: https://<argo_ingress_url>/oauth2/callback
    ```

2. Create PVC for Argo

    ```yaml
    apiVersion: v1
     kind: PersistentVolumeClaim
     metadata:
     name: compute-pv-claim
     spec:
     accessModes:
         - ReadWriteMany
     resources:
         requests:
         storage: 50Gi
     storageClassName: test-efs-sc
    ```

3. Create Docker pull secret

    ```yaml
    apiVersion: v1
     kind: Secret
     type: kubernetes.io/dockerconfigjson
     metadata:
     name: polusai-docker-pull-secret
     namespace: default
     data:
     .dockerconfigjson: <redacted>
    ```

## Installation

```bash
helm dependency update
helm dependency build
helm install compute-argo . --values <values_file>.yaml
```

## Accessing Argo and Argo Compute driver

1. Accessing Argo UI
2. Accessing Argo API from local machine (advanced)
3. Accessing Argo Compute driver API from OpenAPI Explorer UI
4. Accessing Argo Compute driver API

## Cleaning up

```bash
helm uninstall <release-name>

# Clean up secrets
kubectl delete secret sso
kubectl delete secret polusai-docker-pull-secret

# Clean up storage
kubectl delete pvc compute-pv-claim
kubectl delete pvc data-compute-argo-postgresql-0
```
