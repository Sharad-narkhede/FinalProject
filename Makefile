.PHONY: up down logs ps restart sh-backend sh-frontend db-shell build

up:
	docker compose up -d --build

down:
	docker compose down

build:
	docker compose build --no-cache

logs:
	docker compose logs -f | cat

ps:
	docker compose ps

restart:
	docker compose restart

sh-backend:
	docker compose exec backend bash || docker compose exec backend sh

sh-frontend:
	docker compose exec frontend bash || docker compose exec frontend sh

db-shell:
	docker compose exec db psql -U $$POSTGRES_USER -d $$POSTGRES_DB

