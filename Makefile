.PHONY: start down dev

start:
	docker-compose up
down:
	docker-compose down
dev:
	docker-compose -f docker-compose.dev.yml up