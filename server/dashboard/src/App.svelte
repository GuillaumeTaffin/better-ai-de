<script lang="ts">
  import Layout from "./components/Layout.svelte";
  import ChatView from "./components/ChatView.svelte";
  import { fetchHealth } from "./lib/api";

  let serverUp = $state<boolean | null>(null);

  $effect(() => {
    fetchHealth()
      .then(() => {
        serverUp = true;
      })
      .catch(() => {
        serverUp = false;
      });
  });
</script>

<Layout {serverUp}>
  <ChatView />
</Layout>
