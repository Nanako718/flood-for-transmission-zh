<script>
  import Input from '~components/Input';
  import Button from '~components/Button';
  import { modals, torrents, alerts, selectedTorrents } from '~helpers/stores';
  import { TRANSMISSION_COLUMN_LABELS } from '~helpers/constants/columns';

  let loading = false;
  let labelValue = $torrents
    .filter((t) => $selectedTorrents.includes(t.id))
    .flatMap((t) => t.labels)
    .filter(Boolean)
    .filter((item, index, list) => list.indexOf(item) === index)
    .join(', ');

  const handleLabel = () => {
    if (loading) return;

    loading = true;
    if (!$selectedTorrents.length) {
      loading = false;
      alerts.add('请至少选择一个种子', 'negative');
      return;
    }

    const labels = labelValue
      .split(',')
      .filter(Boolean)
      .map((v) => v.trim());
    torrents
      .setTorrents($selectedTorrents, { [TRANSMISSION_COLUMN_LABELS]: labels })
      .then(() => {
        alerts.add('标签设置成功');
        modals.close();
      })
      .catch(() => {
        alerts.add('标签设置失败', 'negative');
      });
  };
</script>

<h1>设置标签</h1>

<div class="content">
  <form on:submit|preventDefault={handleLabel}>
    <Input
      type="text"
      bind:value={labelValue}
      placeholder="输入标签"
      label="标签（逗号分隔）"
    />
    <div class="button-group">
      <Button priority="tertiary" on:click={modals.close}>取消</Button>
      <Button priority="primary" loading={loading} type="submit"
        >设置标签</Button
      >
    </div>
  </form>
</div>

<style>
  h1 {
    color: var(--color-modal-header);
    font-size: 20px;
    font-weight: 500;
    padding: 20px 25px 0;
  }

  .content {
    overflow-y: auto;
    padding: 20px 25px 20px 25px;
    color: var(--color-modal-text);
  }

  .button-group {
    display: flex;
    justify-content: flex-end;
    margin-top: 25px;
    gap: 10px;
  }
</style>
