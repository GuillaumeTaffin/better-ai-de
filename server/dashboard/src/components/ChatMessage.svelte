<script lang="ts">
  import type { ChatEntry } from "../lib/types";

  let { entry }: { entry: ChatEntry } = $props();
</script>

<div class="flex {entry.role === 'user' ? 'justify-end' : 'justify-start'}">
  <div
    class="max-w-[80%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap {entry.role === 'user'
      ? 'bg-indigo-600 text-white'
      : 'bg-zinc-800 text-zinc-200'}"
  >
    {entry.text}
  </div>
</div>
