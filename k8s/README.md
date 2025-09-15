
Kubernetes manifests for the minimal microservices app.

- Apply namespace: kubectl apply -f namespace.yaml
- Apply all resources: kubectl apply -f .
- Edit manifests to replace REPLACE_REGISTRY with your image registry (or use sed):
  sed -i 's|REPLACE_REGISTRY|docker.io/yourname|g' *.yaml
- To switch traffic from blue -> green for a service: bash switch-service.sh events-service green
