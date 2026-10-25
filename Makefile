BACKEND := docker compose run --rm backend
FRONTEND := docker compose run --rm --no-deps frontend

.PHONY: build up down logs test watch cov lint format shell \
	front-test front-watch front-lint front-format front-type-check front-shell

build:
	docker compose build

up:
	docker compose up -d --renew-anon-volumes

down:
	docker compose down

logs:
	docker compose logs -f

# --- backend ---

test:
	$(BACKEND) pytest

watch:
	$(BACKEND) ptw . --now

cov:
	$(BACKEND) pytest --cov --cov-report=term-missing

lint:
	$(BACKEND) sh -c "ruff check . && ruff format --check ."

format:
	$(BACKEND) sh -c "ruff format . && ruff check --fix ."

shell:
	$(BACKEND) bash

# --- frontend ---

front-test:
	$(FRONTEND) npm test

front-watch:
	$(FRONTEND) npm run watch

front-lint:
	$(FRONTEND) npm run lint

front-format:
	$(FRONTEND) npm run format

front-type-check:
	$(FRONTEND) npm run type-check

front-shell:
	$(FRONTEND) bash
