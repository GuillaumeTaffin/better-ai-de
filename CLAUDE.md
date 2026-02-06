# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Better AI-DE is an **AI-augmented IDE experience** built around a standardized protocol (LSP-like but for AI/agent interactions). It wraps the open-source Vibe Kanban server to reuse its process spawning and WebSocket capabilities.

Architecture: `IntelliJ Plugin ←→ Better AI-DE Server (Bun) ←→ JSON-RPC Proxy ←→ Vibe Kanban ←→ Claude Code`

## Project Layout

- `docs/` — Project documentation and specifications
- `server/` — Better AI-DE server (Bun + TypeScript) and JSON-RPC proxy
- `ide-plugin/` — IntelliJ Platform plugin (PoC client)
- `vibe-kanban/` — Git submodule (dependency, **read-only** — see below)

## Critical Guideline: Do Not Modify `vibe-kanban/`

The `vibe-kanban/` directory is a **git submodule** pointing to [BloopAI/vibe-kanban](https://github.com/BloopAI/vibe-kanban). It is treated as a **read-only dependency**.

- **Never edit, add, or delete files** inside `vibe-kanban/`.
- All integration must be done through **wrapping and proxying** (JSON-RPC proxy layer), not by patching the dependency.
- You may **read** vibe-kanban source code to understand its APIs, WebSocket messages, and behavior.
- This constraint exists to keep the submodule cleanly upgradeable without managing merge conflicts.
