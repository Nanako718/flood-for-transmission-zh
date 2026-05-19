<script>
  import { slide } from 'svelte/transition';

  export let items;
  export let itemName;
  export let itemNamePlural;
</script>

<div class="torrent-detail-page" class:has-selection={!!items.length || $$slots.form}>
  <slot />
</div>

{#if $$slots.form}
  <div class="torrent-detail-action-bar-form">
    <slot name="form" />
  </div>
{/if}

{#if items.length}
  <div class="torrent-detail-action-bar" transition:slide={{ duration: 250 }}>
    <div class="torrent-detail-action-bar-text">
      已选择 <span class="focus">{items.length}</span>
      个{itemName || itemNamePlural}
    </div>
    <slot name="actions" />
  </div>
{/if}

<style>
  .torrent-detail-page.has-selection {
    padding-bottom: 8px;
  }
</style>
