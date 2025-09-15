
#!/usr/bin/env bash
# Usage: switch-service.sh <service-name> [green|blue]
# Default toggles to green if current is blue
set -e
NS=ms-demo
if [ -z "$1" ]; then
  echo "Usage: $0 <service-name> [green|blue]"
  exit 1
fi
SERVICE=$1
TARGET=${2:-green}

CURRENT=$(kubectl get svc $SERVICE -n $NS -o jsonpath='{.spec.selector.version}')
echo "Current selector version for $SERVICE: $CURRENT"
echo "Switching $SERVICE -> version=$TARGET"
kubectl patch svc $SERVICE -n $NS -p "{"'"spec":{"selector":{"app": "'${SERVICE%-service}'-service'", "version": "'${TARGET}'"}}}'" || true
echo "Patched. New selector:"
kubectl get svc $SERVICE -n $NS -o yaml
