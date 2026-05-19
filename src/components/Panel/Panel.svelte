<script>
  import Graph from '~components/Graph';
  import Actions from '~components/Panel/Actions.svelte';
  import Filters from '~components/Filters';
  import DiskUsage from '~components/DiskUsage';
  import Icon from '~components/Icon';
  import { Settings } from '~components/Modal';
  import clickOutside from '~helpers/actions/clickOutside';
  import { panel, modals } from '~helpers/stores';

  const hidePanelOnMobile = () => {
    if (window.outerWidth > 550) return;
    panel.close();
  };

  const openSettings = () => {
    modals.open({
      component: Settings,
      large: true,
    });
  };
</script>

<div class="panel panel--with-chrome" use:clickOutside={hidePanelOnMobile}>
  <div class="panel-scroll">
    <Actions />
    <Graph />
    <Filters />
    <DiskUsage />
  </div>
  <footer class="panel-footer app-status-bar">
    <button
      type="button"
      class="panel-settings-btn"
      title="设置"
      aria-label="打开设置"
      on:click={openSettings}
    >
      <Icon name="SettingsIcon" viewBox="0 0 24 24" />
      <span>设置</span>
    </button>
  </footer>
</div>

<style>
  .panel {
    grid-area: panel;
    background: var(--color-panel-background);
    display: flex;
    flex-direction: column;
    height: 100dvh;
    overflow: hidden;
  }

  .panel-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .panel-settings-btn :global(.icon) {
    display: block;
    fill: currentColor;
    flex-shrink: 0;
    height: 16px;
    width: 16px;
  }
</style>
