<script>
  import { onMount } from 'svelte';
  import Icon from '~components/Icon';
  import Search from '~components/Search';
  import { Add, Remove } from '~components/Modal';
  import { torrents, modals, selectedTorrents, panel } from '~helpers/stores';

  const sortedTorrents = torrents.sorted;

  onMount(() => {
    const url = new URL(window.location.href);
    const magnet = url.searchParams.get('addtorrent');

    if (magnet) {
      modals.open({
        component: Add,
        props: { fileNames: [decodeURIComponent(magnet)] },
      });

      url.searchParams.delete('addtorrent');
      history.replaceState(null, '', url.toString());
    }
  });

  const togglePanel = () => {
    panel.toggle();
  };

  const handleSelectAll = () => {
    selectedTorrents.set($sortedTorrents.map((t) => t.id));
  };

  const handleStart = () => {
    torrents.start($selectedTorrents);
  };

  const handleStop = () => {
    torrents.stop($selectedTorrents);
  };

  const handleAdd = () => {
    modals.open({ component: Add });
  };

  const handleRemove = () => {
    modals.open({ component: Remove });
  };
</script>

<nav class="header" aria-label="主工具栏">
  <div class="left">
    <button
      type="button"
      class="button button--menu"
      on:click={togglePanel}
      title="侧栏筛选"
      aria-label="打开或关闭侧栏筛选"
    >
      <Icon name="MenuIcon" viewBox="0 0 60 60" />
    </button>
    <div class="search-slot">
      <Search variant="topbar" />
    </div>
  </div>

  <div class="right">
    <button
      type="button"
      class="button button--select"
      on:click={handleSelectAll}
      title="全选当前列表"
      aria-label="全选"
    >
      <Icon name="CheckAllIcon" viewBox="0 0 16 16" />
    </button>

    <div class="divider" aria-hidden="true"></div>

    <div class="transport-group" role="group" aria-label="传输控制">
      <button
        type="button"
        class="transport-btn transport-btn--icon transport-btn--start"
        on:click={handleStart}
        title="开始"
        aria-label="开始选中的种子"
      >
        <Icon name="StartIcon" viewBox="0 0 60 60" />
      </button>
      <button
        type="button"
        class="transport-btn transport-btn--icon transport-btn--stop"
        on:click={handleStop}
        title="停止"
        aria-label="停止选中的种子"
      >
        <Icon name="StopIcon" viewBox="0 0 60 60" />
      </button>
    </div>

    <div class="divider" aria-hidden="true"></div>

    <div class="group group--library" role="group" aria-label="种子管理">
      <button
        type="button"
        class="button button--add"
        on:click={handleAdd}
        title="添加种子"
        aria-label="添加种子"
      >
        <Icon name="Add" viewBox="0 0 60 60" />
      </button>
      <button
        type="button"
        class="button button--remove"
        on:click={handleRemove}
        title="移除种子"
        aria-label="移除种子"
      >
        <Icon name="Remove" viewBox="0 0 60 60" />
      </button>
    </div>
  </div>
</nav>

<style>
  .header {
    background: var(--color-top-bar-background);
    border-bottom: 1px solid var(--color-top-bar-border);
    color: var(--color-top-bar-text);
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    min-height: 40px;
    height: 40px;
    justify-content: space-between;
    gap: 8px;
    padding: 0 4px 0 0;
  }

  .left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    gap: 4px;
    padding-left: 2px;
  }

  .search-slot {
    align-items: center;
    display: flex;
    flex: 1;
    height: 100%;
    max-width: 520px;
    min-width: 0;
    padding: 0 10px 0 6px;
  }

  .right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 100%;
  }

  .group {
    display: flex;
    align-items: center;
    height: 100%;
    gap: 2px;
    padding: 0 4px;
  }

  .button {
    align-items: center;
    background-color: transparent;
    border: 0;
    border-radius: var(--radius-sm);
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    fill: currentColor;
    flex-shrink: 0;
    height: 34px;
    justify-content: center;
    margin: 0 1px;
    max-height: 34px;
    min-height: 34px;
    padding: 0;
    transition:
      background-color 0.2s,
      fill 0.2s,
      transform 0.1s;
    width: 38px;
    max-width: 38px;
    min-width: 38px;
  }

  .button:active {
    transform: scale(0.94);
  }

  .button :global(.icon) {
    display: block;
    flex-shrink: 0;
    height: 16px;
    max-height: 16px;
    max-width: 16px;
    width: 16px;
  }

  .right :global(.transport-btn--icon) {
    box-sizing: border-box;
    flex-shrink: 0;
    height: 34px;
    max-height: 34px;
    min-height: 34px;
    margin: 0 1px;
    max-width: 38px;
    min-width: 38px;
    padding: 0;
    width: 38px;
  }

  .right :global(.transport-btn--icon) :global(.icon) {
    display: block;
    flex-shrink: 0;
    height: 16px;
    max-height: 16px;
    max-width: 16px;
    width: 16px;
  }

  .button--menu {
    color: var(--color-toolbar-menu);
    fill: var(--color-toolbar-menu);
  }

  .button--menu:hover {
    background: var(--color-toolbar-menu-bg-hover);
    fill: var(--color-top-bar-text);
  }

  .button--select {
    color: var(--color-toolbar-select);
    fill: var(--color-toolbar-select);
  }

  .button--select:hover {
    background: var(--color-toolbar-select-bg-hover);
  }

  .button--add {
    background: var(--color-toolbar-add-bg);
    color: var(--color-toolbar-add);
    fill: var(--color-toolbar-add);
  }

  .button--add:hover {
    background: var(--color-toolbar-add-bg-hover);
  }

  .button--remove {
    background: var(--color-toolbar-remove-bg);
    color: var(--color-toolbar-remove);
    fill: var(--color-toolbar-remove);
  }

  .button--remove:hover {
    background: var(--color-toolbar-remove-bg-hover);
  }

  .divider {
    background: var(--color-top-bar-divider);
    flex-shrink: 0;
    height: 22px;
    width: 1px;
    margin: 0 4px;
  }

  @media (max-width: 640px) {
    .search-slot {
      max-width: none;
      padding-right: 4px;
    }

    .button {
      width: 34px;
    }
  }
</style>
