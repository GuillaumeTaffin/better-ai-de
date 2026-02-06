<script lang="ts">
  import Layout from "./components/Layout.svelte";
  import { fetchHealth } from "./lib/api";

  let status = $state<string>("checking...");
  let service = $state<string>("");

  $effect(() => {
    fetchHealth()
      .then((data) => {
        status = data.status;
        service = data.service;
      })
      .catch(() => {
        status = "error";
        service = "unreachable";
      });
  });
</script>

<Layout>
  <div class="max-w-2xl">
    <h2 class="text-2xl font-bold tracking-tight mb-6">Dashboard</h2>
    <div class="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div class="flex items-center gap-3 mb-4">
        <div
          class="size-3 rounded-full {status === 'ok'
            ? 'bg-emerald-500'
            : status === 'checking...'
              ? 'bg-amber-500 animate-pulse'
              : 'bg-red-500'}"
        ></div>
        <span class="text-sm font-medium text-zinc-400">Server Status</span>
      </div>
      {#if service}
        <p class="text-zinc-200">
          Connected to <code class="text-indigo-400 font-mono text-sm">{service}</code>
          &mdash; Status: <span class="font-semibold">{status}</span>
        </p>
      {:else}
        <p class="text-zinc-500">{status}</p>
      {/if}
    </div>
  </div>
</Layout>
