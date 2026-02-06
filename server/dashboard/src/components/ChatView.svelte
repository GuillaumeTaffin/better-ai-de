<script lang="ts">
  import { WsClient } from "../lib/ws.svelte";
  import type { ChatEntry, ServerMessage, WireOutgoingMessage, WireIncomingMessage } from "../lib/types";
  import ChatMessage from "./ChatMessage.svelte";
  import ChatInput from "./ChatInput.svelte";
  import WireInspector from "./WireInspector.svelte";

  const ws = new WsClient();

  let messages = $state<ChatEntry[]>([]);
  let wireEntries = $state<(WireOutgoingMessage | WireIncomingMessage)[]>([]);
  let wireOpen = $state(false);
  let scrollContainer: HTMLDivElement | undefined = $state();

  function scrollToBottom() {
    // Use tick-like delay so DOM updates first
    requestAnimationFrame(() => {
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    });
  }

  ws.onMessage = (msg: ServerMessage) => {
    switch (msg.type) {
      case "chat/delta": {
        const last = messages[messages.length - 1];
        if (last && last.role === "assistant") {
          last.text += msg.text;
          // Trigger reactivity by reassigning
          messages = messages;
        } else {
          messages = [...messages, { role: "assistant", text: msg.text }];
        }
        scrollToBottom();
        break;
      }
      case "chat/done":
        scrollToBottom();
        break;
      case "chat/error":
        messages = [...messages, { role: "assistant", text: `Error: ${msg.message}` }];
        scrollToBottom();
        break;
      case "wire/outgoing":
      case "wire/incoming":
        wireEntries = [...wireEntries, msg];
        break;
    }
  };

  function handleSend(text: string) {
    messages = [...messages, { role: "user", text }];
    scrollToBottom();
    ws.send(text);
  }

  export function getWs() {
    return ws;
  }
</script>

{#if ws.state === "disconnected"}
  <div class="flex flex-1 items-center justify-center">
    <button
      onclick={() => ws.connect()}
      class="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500"
    >
      Connect
    </button>
  </div>
{:else if ws.state === "connecting"}
  <div class="flex flex-1 items-center justify-center">
    <p class="text-zinc-400 text-sm">Connecting...</p>
  </div>
{:else}
  <div class="flex flex-1 min-h-0">
    <!-- Chat area -->
    <div class="flex flex-1 flex-col min-h-0 min-w-0">
      <!-- Messages -->
      <div bind:this={scrollContainer} class="flex-1 overflow-y-auto space-y-3 p-4">
        {#each messages as entry}
          <ChatMessage {entry} />
        {/each}
        {#if ws.sessionStatus === "streaming"}
          <div class="flex justify-start">
            <span class="text-xs text-zinc-500 animate-pulse">Claude is thinking...</span>
          </div>
        {/if}
      </div>

      <!-- Input -->
      <div class="border-t border-zinc-800 p-4">
        <div class="flex gap-2">
          <div class="flex-1">
            <ChatInput onSend={handleSend} disabled={ws.sessionStatus === "streaming"} />
          </div>
          <button
            onclick={() => wireOpen = !wireOpen}
            class="shrink-0 self-end rounded-lg border px-3 py-2 font-mono text-xs font-medium transition-colors {wireOpen ? 'border-amber-500 bg-amber-900/40 text-amber-400' : 'border-zinc-600 bg-zinc-800 text-zinc-300 hover:border-zinc-500 hover:text-zinc-200'}"
          >
            {wireOpen ? '⚡ Wire' : '⚡ Wire'}
          </button>
        </div>
      </div>
    </div>

    <!-- Wire sidebar -->
    {#if wireOpen}
      <div class="w-1/2 min-w-0">
        <WireInspector entries={wireEntries} />
      </div>
    {/if}
  </div>
{/if}
