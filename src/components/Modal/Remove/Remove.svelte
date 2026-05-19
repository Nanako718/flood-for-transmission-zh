<script>
  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';
  import { modals, torrents, alerts, selectedTorrents } from '~helpers/stores';

  let loading = false;
  let deleteData = false;

  const term = '个种子';

  const handleRemove = () => {
    if (loading) return;

    loading = true;
    if (!$selectedTorrents.length) {
      loading = false;
      alerts.add('请至少选择一个种子', 'negative');
      return;
    }
    torrents
      .remove($selectedTorrents, deleteData)
      .then(() => {
        torrents.set(
          $torrents.filter((t) => !$selectedTorrents.includes(t.id))
        );
        alerts.add(`已成功移除 ${$selectedTorrents.length} ${term}`);
        selectedTorrents.clear();
        modals.close();
      })
      .catch(() => {
        alerts.add(`移除失败（${$selectedTorrents.length} ${term}）`, 'negative');
      });
  };
</script>

<h1>移除种子</h1>

<div class="content">
  <form on:submit|preventDefault={handleRemove}>
    <p>确定要移除 {$selectedTorrents.length} {term} 吗？</p>
    <Checkbox label="同时删除本地数据" bind:checked={deleteData} />
    <div class="button-group">
      <Button priority="tertiary" on:click={modals.close}>取消</Button>
      <Button priority="primary" loading={loading} type="submit">
        移除种子
      </Button>
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

  p {
    font-size: 14px;
    margin-bottom: 15px;
  }
</style>
