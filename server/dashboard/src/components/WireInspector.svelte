<script lang="ts">
  import type { WireOutgoingMessage, WireIncomingMessage } from "../lib/types";

  type WireEntry = WireOutgoingMessage | WireIncomingMessage;

  let { entries }: { entries: WireEntry[] } = $props();

  let scrollContainer: HTMLDivElement | undefined = $state();

  $effect(() => {
    // Re-run whenever entries length changes
    entries.length;
    requestAnimationFrame(() => {
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    });
  });

  function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  }
</script>

<div class="flex h-full flex-col border-l border-zinc-800 bg-zinc-950">
  <!-- Header -->
  <div class="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
    <span class="font-mono text-xs font-medium text-zinc-300">Wire Inspector</span>
    <span class="rounded-full bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
      {entries.length}
    </span>
  </div>

  <!-- Event list -->
  <div bind:this={scrollContainer} class="flex-1 overflow-y-auto">
    {#if entries.length === 0}
      <div class="flex h-full items-center justify-center p-4">
        <p class="text-center font-mono text-xs text-zinc-600">
          No wire events yet.<br />Send a message to see raw traffic.
        </p>
      </div>
    {:else}
      <div class="divide-y divide-zinc-900">
        {#each entries as entry, i}
          <div class="px-3 py-2">
            <div class="mb-1 flex items-center gap-2">
              {#if entry.type === "wire/outgoing"}
                <span class="rounded bg-amber-900/50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-400">
                  OUT
                </span>
              {:else}
                <span class="rounded bg-sky-900/50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-sky-400">
                  IN
                </span>
              {/if}
              <span class="font-mono text-[10px] text-zinc-600">
                {formatTime(entry.timestamp)}
              </span>
            </div>
            <pre class="overflow-x-auto whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-zinc-400">{#if entry.type === "wire/outgoing"}{entry.command} {entry.args.join(" ")}{:else}{JSON.stringify(entry.data, null, 2)}{/if}</pre>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
