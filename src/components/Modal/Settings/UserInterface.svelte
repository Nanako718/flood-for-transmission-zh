<script>
  import Header from './Header.svelte';
  import Button from '~components/Button';
  import InputMultiple from '~components/InputMultiple';
  import Checkbox from '~components/Checkbox';
  import Select from '~components/Select';
  import {
    modals,
    alerts,
    uiColumns,
    paths,
    darkMode,
    switchSpeedColors,
    timeConfig,
    tableHeaderConfig,
    diskUsage,
  } from '~helpers/stores';
  import { orderable } from '~helpers/actions';
  import { PATH_VALIDATION_REGEX } from '~helpers/constants/paths';

  const newColumns = structuredClone($uiColumns);
  let newPaths = [...$paths];
  let newSwitchSpeedColors = $switchSpeedColors;
  let newTimeConfig = $timeConfig;
  let newTableHeaderConfig = $tableHeaderConfig;
  const configuredDarkMode = darkMode.configuredValue;
  let newDarkMode = $configuredDarkMode;
  let newDiskUsage = $diskUsage;

  const darkModeOptions = [
    { label: '自动', value: 'auto' },
    { label: '启用', value: 'enabled' },
    { label: '禁用', value: 'disabled' },
  ];

  const handleSubmit = () => {
    const pathPattern = new RegExp(PATH_VALIDATION_REGEX);
    const sanitizedPaths = newPaths.map((path) => path.trim()).filter(Boolean);
    const invalidPath = sanitizedPaths.find((path) => !pathPattern.test(path));

    if (invalidPath) {
      alerts.add(`路径无效：${invalidPath}`, 'negative');
      return;
    }

    try {
      uiColumns.set(newColumns);
      paths.set(sanitizedPaths);
      switchSpeedColors.set(newSwitchSpeedColors);
      timeConfig.set(newTimeConfig);
      tableHeaderConfig.set(newTableHeaderConfig);
      darkMode.set(newDarkMode);
      diskUsage.set(newDiskUsage);
      alerts.add('界面设置已保存');
      modals.close();
    } catch (e) {
      console.error(e);
      alerts.add('界面设置保存失败，请重试', 'negative');
    }
  };

  const handleColumnDrop = (sorting) => {
    newColumns.sort((a, b) => sorting.indexOf(a.id) - sorting.indexOf(b.id));
  };
</script>

<form
  novalidate
  onsubmit={(event) => {
    event.preventDefault();
    handleSubmit();
  }}
>
  <Header text="配色" />
  <div class="list">
    <Select
      options={darkModeOptions}
      on:change={(event) => (newDarkMode = event.detail)}
      value={newDarkMode}
      direction="below"
      label="深色模式"
    />
  </div>

  <div class="list">
    <Checkbox
      label="交换上下行颜色"
      hint="交换上传与下载的颜色显示（默认为下载绿色、上传蓝色）。"
      bind:checked={newSwitchSpeedColors}
    />
  </div>

  <Header text="格式" />
  <div class="list">
    <Checkbox
      label="24 小时制"
      hint="启用时使用 24 小时制，禁用时使用 12 小时制"
      bind:checked={newTimeConfig}
    />
  </div>

  <div class="list">
    <Checkbox
      label="表头文字自动换行"
      hint="启用后表头列文字可换行"
      bind:checked={newTableHeaderConfig}
    />
  </div>

  <Header text="常用路径" />
  <p class="hint">
    这些路径会显示在路径选择器的放大镜菜单中。
  </p>
  <InputMultiple bind:values={newPaths} />

  <div class="list">
    <Checkbox
      label="显示磁盘用量"
      hint="在侧栏根据常用路径显示磁盘用量"
      bind:checked={newDiskUsage}
    />
  </div>

  <Header text="种子列" />
  <div class="list">
    {#each Object.values(newColumns) as column (column.id)}
      <div
        class="column"
        draggable="true"
        use:orderable={handleColumnDrop}
        id={column.id}
      >
        <span>{uiColumns.getColumnLabel(column.id)}</span>
        <Checkbox bind:checked={column.enabled} label="启用" />
      </div>
    {/each}
  </div>

  <div class="buttons">
    <Button type="button" priority="tertiary" onclick={() => modals.close()}>
      取消
    </Button>
    <Button type="submit" priority="primary">保存设置</Button>
  </div>
</form>

<style>
  form {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    line-height: 1;
    color: var(--color-modal-text);
  }

  form :global(.checkbox) :global(.indicator) {
    background: var(--color-checkbox-background-dark);
    border-color: var(--color-checkbox-border-dark);
  }

  .buttons {
    flex-grow: 1;
    align-items: flex-end;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .list {
    margin-bottom: 15px;
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .column {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-modal-user-interface-column-background);
    border: 1px solid var(--color-modal-user-interface-column-border);
    cursor: move;
    height: 30px;
    padding: 0 5px;
    font-size: 13px;
  }

  .hint {
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 8px;
  }
</style>
