<script lang="ts">
  let { onSend, disabled = false }: { onSend: (text: string) => void; disabled?: boolean } =
    $props();

  let text = $state("");

  function submit() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    text = "";
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }
</script>

<form onsubmit={e => { e.preventDefault(); submit(); }} class="flex gap-2">
  <textarea
    bind:value={text}
    onkeydown={handleKeydown}
    placeholder="Send a message..."
    rows={1}
    {disabled}
    class="flex-1 resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
           text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none
           disabled:opacity-50"
  ></textarea>
  <button
    type="submit"
    disabled={disabled || !text.trim()}
    class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white
           hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Send
  </button>
</form>
