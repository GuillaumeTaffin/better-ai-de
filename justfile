# Better AI-DE — development commands
# Run `just --list` to see available recipes

# Default recipe: run server + dashboard in parallel
default:
    @just --list

# Serveur + dashboard en parallèle
dev:
    cd server && bun run dev:all

# Serveur seul (watch)
dev-server:
    cd server && bun run dev

# Dashboard Vite seul (HMR)
dev-dashboard:
    cd server/dashboard && bun run dev

# Build le dashboard
build:
    cd server && bun run build:dashboard

# Serveur prod (sert le dashboard buildé)
start:
    cd server && bun run start

# TypeScript check server + dashboard
check:
    cd server && bun run check:all

# TypeScript check serveur seul
check-server:
    cd server && bun run check

# Svelte-check dashboard seul
check-dashboard:
    cd server && bun run check:dashboard

# bun install dans le workspace
install:
    cd server && bun install

# Curl le health endpoint
health:
    curl -s localhost:3100/api/health | jq

# Supprime node_modules et dist
clean:
    rm -rf server/node_modules server/dashboard/dist
