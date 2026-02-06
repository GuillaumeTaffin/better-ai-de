<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="min-h-screen bg-zinc-950 text-zinc-100">
  <header class="border-b border-zinc-800 px-6 py-4">
    <div class="flex items-center gap-3">
      <div class="size-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">
        AI
      </div>
      <h1 class="text-lg font-semibold tracking-tight">Better AI-DE</h1>
    </div>
  </header>
  <main class="p-6">
    {@render children()}
  </main>
</div>
