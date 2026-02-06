<script lang="ts">
  import type { Snippet } from "svelte";

  let { children, serverUp = null }: { children: Snippet; serverUp?: boolean | null } = $props();
</script>

<div class="flex flex-col h-screen bg-zinc-950 text-zinc-100">
  <header class="border-b border-zinc-800 px-6 py-4 shrink-0">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="size-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">
          AI
        </div>
        <h1 class="text-lg font-semibold tracking-tight">Better AI-DE</h1>
      </div>
      <div class="flex items-center gap-2">
        <div
          class="size-2.5 rounded-full {serverUp === true
            ? 'bg-emerald-500'
            : serverUp === false
              ? 'bg-red-500'
              : 'bg-amber-500 animate-pulse'}"
        ></div>
        <span class="text-xs text-zinc-500">Server</span>
      </div>
    </div>
  </header>
  <main class="flex flex-col flex-1 min-h-0">
    {@render children()}
  </main>
</div>
