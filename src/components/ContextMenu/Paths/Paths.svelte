<script>
  import { paths, modals, contextMenu } from '~helpers/stores';
  import { Settings } from '~components/Modal';

  export let onPathSelect;
  export let onItemClick;

  function onFallbackClick() {
    modals.open({
      component: Settings,
      large: true,
      props: { activePageId: 'user-interface' },
    });
    contextMenu.close();
  }
</script>

{#if $paths.length}
  <li class="context-menu-section" role="presentation">
    <div class="context-menu-section-inner">
      <span class="context-menu-section-title">常用路径</span>
      <div class="context-menu-items" role="group" aria-label="常用路径">
        {#each $paths as path (path)}
          <button
            type="button"
            role="menuitem"
            class="context-menu-item"
            on:click={onItemClick(onPathSelect, [path])}>{path}</button
          >
        {/each}
      </div>
    </div>
  </li>
{:else}
  <li class="context-menu-section" role="presentation">
    <div class="context-menu-section-inner">
      <div class="context-menu-items">
        <button
          type="button"
          role="menuitem"
          class="context-menu-item"
          on:click={onFallbackClick}
        >
          配置常用路径…
        </button>
      </div>
    </div>
  </li>
{/if}
