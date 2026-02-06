# Better AI-DE - État des lieux du projet

## Vision

Créer une **expérience IDE augmentée par IA** plutôt qu'une IDE complète. Architecture modulaire basée sur un **protocole standardisé** (type LSP) que différentes IDEs peuvent implémenter.

## Architecture globale

```
IntelliJ Plugin ←→ Better AI-DE Server ←→ Proxy Bun ←→ Vibe Kanban ←→ Claude Code
     ↑                    ↑                                              ↑
  (PoC initial)    (protocole standard)                          (agent initial)
```

### Composants

#### 1. IntelliJ Plugin (PoC)
- **Pourquoi IntelliJ:** Bonne connaissance de l'écosystème JetBrains
- **Forme initiale:** Plugin simple ou même Notebook IntelliJ
- **Rôle:** Client du protocole Better AI-DE
- **Objectif:** Proof of concept minimal pour valider l'architecture

#### 2. Better AI-DE Server
- **Concept clé:** Serveur avec protocole standard (inspiré LSP)
- **API bien définie:** Flows UX, actions, capabilities
- **Agnostique IDE:** D'autres IDEs (VS Code, etc.) pourraient implémenter le même protocole
- **Runtime:** Bun (performance WebSocket native, TypeScript natif)

#### 3. Proxy Bun JSON-RPC
- **Rôle:** Couche d'abstraction entre Better AI-DE Server et Vibe Kanban
- **Format:** JSON-RPC pour standardisation
- **Avantages:**
  - Vibe Kanban reste intact (updates gratuites)
  - API standardisée agnostique de l'agent
  - Migration facile si changement de backend

#### 4. Vibe Kanban Server (réutilisation)
- **Source:** Projet open source (Apache 2.0)
- **Ce qu'on garde:**
  - Process spawner multi-agents
  - Gestion stdin/stdout + émulation TTY
  - Communication WebSocket
- **Ce qu'on jette:**
  - Système Kanban/task management
  - DB SQLite (projets, tasks, attempts)
  - Worktrees, orchestration parallèle

#### 5. Agent de coding
- **Initial:** Claude Code
- **Extensible:** Gemini CLI, Codex, Amp, autres agents

## Philosophie du design

### Pas une nouvelle IDE
- Réutilisation d'IDEs existantes (IntelliJ, VS Code, Cursor, etc.)
- Augmentation via protocole standardisé
- Éviter de réinventer la roue (éditeur, debugger, etc.)

### Protocole Better AI-DE
- **Standard ouvert** pour "AI-augmented development"
- **Comparable au LSP** mais pour interactions IA/agent
- Permet à n'importe quelle IDE de brancher les mêmes capabilities
- Flows UX bien définis dans l'API

### Analogie
**LSP** (Language Server Protocol) : support langage :: **Better AI-DE Protocol** : augmentation IA

## Décisions techniques

### Pourquoi Bun vs Node.js?
- Performance WebSocket native quasi-Rust
- TypeScript natif (pas de transpilation)
- Startup time quasi instantané
- Moins de RAM
- **Pas de bottleneck perf:** Le vrai bottleneck reste la latence LLM

### Pourquoi proxy JSON-RPC vs extraction directe du code Vibe Kanban?
- Vibe Kanban reste intact → updates gratuites
- API standardisée agnostique de l'agent
- Migration facile si changement de backend
- Séparation des préoccupations claire

### Stack backend
- **Better AI-DE Server:** Bun + TypeScript
- **Proxy:** JSON-RPC over WebSocket
- **Agent communication:** Via Vibe Kanban (Rust)

### Stack frontend (PoC)
- **Initial:** Plugin IntelliJ Platform
- **Futur:** Protocole ouvert → autres IDEs possibles

## Licensing & coûts

- **Vibe Kanban:** Open source Apache 2.0 ✅
- **Claude Code:** Nécessite licence API Anthropic (non couvert par Cloud Max)
- **Better AI-DE:** À définir (probablement open source)

## Prochaines étapes

### Phase 1: Spécification
1. Définir le protocole Better AI-DE
   - Messages / commandes disponibles
   - Flows UX principaux
   - Capabilities et négociation
2. Documenter l'API JSON-RPC du proxy

### Phase 2: Infrastructure
1. Implémenter le serveur Better AI-DE (Bun)
2. Implémenter le proxy JSON-RPC
3. Tester la communication bout-en-bout avec Vibe Kanban

### Phase 3: PoC Client
1. Plugin/Notebook IntelliJ minimal
2. Valider les flows UX de base
3. Itérer sur l'expérience utilisateur

### Phase 4: Expansion
1. Raffiner le protocole
2. Support d'autres IDEs?
3. Support d'autres agents?

## Questions ouvertes

- Quels sont les flows UX prioritaires pour le PoC?
- Comment gérer l'authentification/session agent?
- Quelle granularité pour les capabilities du protocole?
- Mode de déploiement: local uniquement ou support remote?

---

*Document créé le: 2025-02-05*
