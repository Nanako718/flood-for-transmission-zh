<script>
  import Input from '~components/Input';
  import Icon from '~components/Icon';
  import { filters } from '~helpers/stores';

  /** @type {'panel' | 'topbar'} */
  export let variant = 'panel';
</script>

<div class="wrapper {variant}" class:active={$filters.search}>
  <Icon name="Search" />
  <Input placeholder="搜索种子" bind:value={$filters.search} />
</div>

<style>
  .wrapper {
    position: relative;
  }

  .wrapper > :global(.icon) {
    fill: var(--color-search-icon);
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: fill 0.25s;
  }

  .wrapper.active > :global(.icon),
  .wrapper:focus-within > :global(.icon) {
    fill: var(--color-search-icon-active);
    opacity: 1;
  }

  /* 侧栏（保留样式供兼容） */
  .wrapper.panel > :global(.icon) {
    height: 22px;
    left: 17px;
    width: 22px;
  }

  .wrapper.panel :global(.input) {
    border: 1px solid var(--color-search-border);
    border-left: none;
    border-right: none;
    border-radius: 0;
    background-color: var(--color-search-background);
    display: block;
    font-size: 16px;
    outline: none;
    padding: 12px 0 12px 45px;
    transition:
      background-color 0.25s,
      border 0.25s;
    width: 100%;
    height: auto;
  }

  .wrapper.panel :global(.input::placeholder) {
    color: var(--color-search-placeholder);
    font-style: italic;
    transition: color 0.25s;
  }

  .wrapper.panel.active :global(.input),
  .wrapper.panel:focus-within :global(.input) {
    color: var(--color-search-text);
    background: var(--color-search-background-active);
    border-bottom: 1px solid var(--color-search-border-active);
    border-top: 1px solid var(--color-search-border-active);
    padding-right: 45px;
  }

  /* 顶栏 */
  .wrapper.topbar {
    align-items: center;
    display: flex;
    height: 32px;
    min-width: 140px;
    width: 100%;
  }

  .wrapper.topbar :global(.input-container) {
    flex: 1;
    margin-bottom: 0;
    min-width: 0;
    width: 100%;
  }

  .wrapper.topbar :global(.input-wrapper) {
    width: 100%;
  }

  .wrapper.topbar > :global(.icon) {
    height: 14px;
    left: 11px;
    width: 14px;
    z-index: 1;
  }

  .wrapper.topbar :global(.input) {
    background: var(--color-search-topbar-background);
    border: 1px solid var(--color-search-topbar-border);
    border-radius: var(--radius-sm);
    box-sizing: border-box;
    color: var(--color-top-bar-text);
    display: block;
    font-size: 13px;
    height: 32px;
    line-height: 30px;
    margin: 0;
    outline: none;
    padding: 0 10px 0 34px;
    transition:
      background-color 0.2s,
      border-color 0.2s,
      box-shadow 0.2s;
    width: 100%;
  }

  .wrapper.topbar :global(.input::placeholder) {
    color: var(--color-search-placeholder);
    font-style: normal;
  }

  .wrapper.topbar.active :global(.input),
  .wrapper.topbar:focus-within :global(.input) {
    background: var(--color-search-background-active);
    border-color: var(--color-search-topbar-border-active);
    box-shadow: 0 0 0 1px rgba(var(--rgb-lavender), 0.12);
    color: var(--color-search-text);
  }
</style>
