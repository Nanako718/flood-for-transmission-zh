<script>
  export let activePageId;
  export let pages;
</script>

<nav class="menu" aria-label="设置分类">
  <h1>设置</h1>

  <ul class="items">
    {#each pages as page (page.id)}
      <li>
        <button
          type="button"
          class="item"
          class:active={page.id === activePageId}
          aria-current={page.id === activePageId ? 'page' : undefined}
          on:click={() => {
            activePageId = page.id;
          }}
        >
          {page.name}
        </button>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .menu {
    background: rgba(var(--rgb-crust), 0.35);
    border-right: 1px solid var(--color-modal-menu-border);
    display: flex;
    flex-direction: column;
    grid-area: menu;
    line-height: 1.25;
    overflow: hidden;
    padding: 16px 0 16px 12px;
  }

  h1 {
    color: var(--color-modal-header);
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 12px;
    padding: 0 8px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0 0 2px;
  }

  .item {
    background: transparent;
    border: none;
    border-left: 3px solid transparent;
    border-radius: 0 6px 6px 0;
    color: var(--color-modal-tab-label);
    cursor: pointer;
    display: block;
    font-size: 13px;
    font-weight: 500;
    margin-right: 0;
    padding: 8px 12px 8px 10px;
    text-align: left;
    transition:
      background-color 0.2s,
      border-color 0.2s,
      color 0.2s;
    width: 100%;
  }

  .item:hover {
    background: rgba(var(--rgb-surface1), 0.45);
    color: var(--color-modal-header);
  }

  .item.active {
    background: rgba(var(--rgb-mauve), 0.12);
    border-left-color: var(--color-modal-tab-label-active);
    color: var(--color-modal-tab-label-active);
    font-weight: 600;
  }

  @media (max-width: 700px) {
    .menu {
      border-bottom: 1px solid var(--color-modal-menu-border);
      border-right: none;
      padding: 12px 12px 8px;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    li {
      margin: 0;
    }

    .item {
      border: 1px solid transparent;
      border-left: 1px solid transparent;
      border-radius: 6px;
      padding: 6px 12px;
    }

    .item.active {
      border-color: rgba(var(--rgb-mauve), 0.45);
    }
  }
</style>
