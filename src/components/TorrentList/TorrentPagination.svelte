<script>
  import {
    torrents,
    torrentPagination,
    PAGE_SIZE_OPTIONS,
  } from '~helpers/stores';

  const paginated = torrents.paginated;

  $: if ($paginated.page !== $torrentPagination.page) {
    torrentPagination.syncPage($paginated.page);
  }

  const goPrev = () => {
    if ($paginated.page > 1) torrentPagination.goToPage($paginated.page - 1);
  };

  const goNext = () => {
    if ($paginated.page < $paginated.totalPages) {
      torrentPagination.goToPage($paginated.page + 1);
    }
  };

  const handlePageSizeChange = (event) => {
    torrentPagination.setPageSize(Number(event.currentTarget.value));
  };
</script>

<footer class="pagination torrent-pagination app-status-bar" aria-label="种子列表分页">
  <span class="summary">
    {#if $paginated.total === 0}
      共 0 个种子
    {:else}
      显示 {$paginated.rangeStart}–{$paginated.rangeEnd} / 共 {$paginated.total} 个
    {/if}
  </span>

  <div class="controls">
    <label class="page-size">
      <span class="page-size-label">每页</span>
      <select
        value={$torrentPagination.pageSize}
        on:change={handlePageSizeChange}
        aria-label="每页显示数量"
      >
        {#each PAGE_SIZE_OPTIONS as size (size)}
          <option value={size}>{size}</option>
        {/each}
      </select>
    </label>

    <div class="pages" role="group" aria-label="翻页">
      <button
        type="button"
        class="nav"
        disabled={$paginated.page <= 1}
        on:click={goPrev}
        aria-label="上一页"
      >
        ‹
      </button>
      <span class="page-indicator">
        {$paginated.page} / {$paginated.totalPages}
      </span>
      <button
        type="button"
        class="nav"
        disabled={$paginated.page >= $paginated.totalPages}
        on:click={goNext}
        aria-label="下一页"
      >
        ›
      </button>
    </div>
  </div>
</footer>

<style>
  .pagination {
    flex: 0 0 auto;
  }

  .summary {
    color: var(--color-header);
    white-space: nowrap;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .page-size {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .page-size-label {
    color: var(--color-header);
  }

  select {
    background: var(--color-dropdown-menu-background);
    border: 1px solid var(--color-top-bar-border);
    border-radius: 4px;
    color: var(--color-top-bar-text);
    font-size: 12px;
    height: 26px;
    padding: 0 6px;
    cursor: pointer;
  }

  .pages {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .page-indicator {
    min-width: 4.5em;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .nav {
    background: transparent;
    border: 1px solid var(--color-top-bar-border);
    border-radius: 4px;
    color: var(--color-top-bar-active);
    cursor: pointer;
    font-size: 18px;
    height: 26px;
    line-height: 1;
    min-width: 28px;
    padding: 0;
  }

  .nav:hover:not(:disabled) {
    background: var(--color-top-bar-button-hover);
  }

  .nav:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
</style>
