
# Edit REGISTRY to point to your container registry (e.g. docker.io/yourname)
REGISTRY ?= docker.io/venuzs

build-frontend:
	docker build -t $(REGISTRY)/ms-frontend:latest frontend/

build-events:
	docker build -t $(REGISTRY)/events-service:latest events-service/

build-booking:
	docker build -t $(REGISTRY)/booking-service:latest booking-service/

build-images: build-frontend build-events build-booking

push-frontend:
	docker push $(REGISTRY)/ms-frontend:latest

push-events:
	docker push $(REGISTRY)/events-service:latest

push-booking:
	docker push $(REGISTRY)/booking-service:latest

push-images: push-frontend push-events push-booking
