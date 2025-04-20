# ==== VARIABLES ====
ENV_FILE = .env
NODE_ENV = development

# ==== BASICS ====

install:
	@echo "📦 Installing dependencies..."
	npm install

dev:
	@echo "🚀 Starting dev server..."
	npx ts-node src/index.ts

build:
	@echo "🧱 Building TypeScript..."
	npm run build

start:
	@echo "🏁 Starting app (compiled)..."
	node dist/index.js

migrate:
	@echo "🧬 Running DB migrations..."
	npm run migrate

clean:
	@echo "🧹 Cleaning build output..."
	rm -rf dist

# ==== DOCKER ====

docker-up:
	@echo "🐳 Starting Docker services..."
	docker-compose up --build

docker-down:
	@echo "⛔ Stopping Docker services..."
	docker-compose down

docker-logs:
	docker-compose logs -f app

# ==== DB STUFF ====

db-shell:
	docker exec -it mysql mysql -uuser -ppassword -Dmydb

reset-db:
	@echo "💥 Dropping and recreating DB (only works in dev)..."
	docker exec mysql mysql -uroot -proot -e "DROP DATABASE IF EXISTS mydb; CREATE DATABASE mydb;"

# ==== FULL FLOWS ====

run-all: clean install build migrate start

dev-all: install migrate dev