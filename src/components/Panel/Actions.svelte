<script>
  import Switch from '~components/Switch';
  import { Settings } from '~components/Modal';
  import { session, modals } from '~helpers/stores';
  import { SESSION_COLUMN_ALT_SPEED_ENABLED } from '~helpers/constants/columns';

  $: altSpeedEnabled = !!$session[SESSION_COLUMN_ALT_SPEED_ENABLED];

  const openSpeedSettings = () => {
    modals.open({
      component: Settings,
      large: true,
      props: { activePageId: 'speed' },
    });
  };

  const toggleAltSpeedEnabled = ({ detail: newAltSpeedEnabled }) => {
    session.toggleAltSpeeds(newAltSpeedEnabled);
  };
</script>

<div class="actions">
  <div class="alt-speed-bar">
    <div class="alt-speed-info">
      <span class="alt-speed-title">备用速度</span>
      <span class="alt-speed-hint">启用后使用设置中的备用限速</span>
    </div>
    <Switch
      ariaLabel="备用速度限制"
      checked={altSpeedEnabled}
      on:change={toggleAltSpeedEnabled}
    />
  </div>
  <button type="button" class="speed-settings-link" on:click={openSpeedSettings}>
    详细速度设置…
  </button>
</div>

<style>
  .actions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 8px 4px;
  }

  .alt-speed-bar {
    align-items: center;
    background: rgba(var(--rgb-base), 0.45);
    border: 1px solid var(--color-panel-border);
    border-radius: var(--radius-md);
    display: flex;
    gap: 10px;
    justify-content: space-between;
    padding: 8px 10px;
  }

  .alt-speed-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .alt-speed-title {
    color: var(--color-panel-active);
    font-size: 12px;
    font-weight: 600;
  }

  .alt-speed-hint {
    color: var(--color-modal-text-light);
    font-size: 10px;
    line-height: 1.3;
  }

  .speed-settings-link {
    background: transparent;
    border: none;
    color: var(--color-modal-link);
    cursor: pointer;
    font-size: 11px;
    padding: 2px 4px;
    text-align: left;
    width: fit-content;
  }

  .speed-settings-link:hover {
    text-decoration: underline;
  }
</style>
