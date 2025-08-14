POSTGRES_IMAGE_TAG=postgres:16
POSTGRES_CONTAINER_NAME=local_server

_CHECK_ENV := $(shell if [ ! -f .env ]; then cp .env.example .env; fi)

include .env
export $(shell sed 's/=.*//' .env)

# Makefile for Simagis Server
# Simple commands for local development

.PHONY: help db-up db-down prep run migrate seed reset

# Default target
help: ## Show available commands
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# =============================================================================
# DATABASE
# =============================================================================

db-start:
	@docker start $(POSTGRES_CONTAINER_NAME) 2>/dev/null || \
	docker run --name $(POSTGRES_CONTAINER_NAME) \
		-e POSTGRES_USER=$(DB_USER) \
		-e POSTGRES_PASSWORD=$(DB_PASS) \
		-e POSTGRES_DB=$(DB_NAME) \
		-p $(PORT):5432 \
		-d $(IMAGE)

db-stop:
	@docker stop $(POSTGRES_CONTAINER_NAME)

db-restart:
	@docker restart $(POSTGRES_CONTAINER_NAME)

db-remove:
	@docker rm -f $(POSTGRES_CONTAINER_NAME)

db-logs:
	@docker logs -f $(POSTGRES_CONTAINER_NAME)

db-shell:
	@docker exec -it $(POSTGRES_CONTAINER_NAME) bash

db-psql:
	@docker exec -it $(POSTGRES_CONTAINER_NAME) psql -U $(DB_USER) -d $(DB_NAME)

# =============================================================================
# DEVELOPMENT
# =============================================================================

prep: ## Install dependencies and generate Prisma client
	@echo "Installing dependencies..."
	npm install
	@echo "Generating Prisma client..."
	npm run prisma:generate

run: ## Start development server
	@echo "Starting development server..."
	npm run dev

# =============================================================================
# DATABASE OPERATIONS
# =============================================================================

migrate: ## Run database migrations
	@echo "Running database migrations..."
	npx prisma migrate dev

seed: ## Seed the database
	@echo "Seeding the database..."
	npx prisma db seed

# =============================================================================
# QUICK COMMANDS
# =============================================================================

setup: db-up prep migrate seed ## Complete setup (db + prep + migrate + seed)

start: db-up run ## Start database and development server

stop: db-down ## Stop database
