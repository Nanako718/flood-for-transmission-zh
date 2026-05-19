<script>
  import InputPath from '~components/InputPath';
  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';
  import Icon from '~components/Icon';
  import {
    modals,
    torrents,
    alerts,
    selectedTorrents,
    session,
  } from '~helpers/stores';
  import { PATH_VALIDATION_REGEX } from '~helpers/constants/paths';
  import { SESSION_COLUMN_DOWNLOAD_DIR } from '~helpers/constants/columns';

  let loadingInitial = true;
  let loadingSubmit = false;
  let location = null;
  let moveData = true;

  session
    .addColumns([SESSION_COLUMN_DOWNLOAD_DIR])
    .then(($session) => {
      location = $session[SESSION_COLUMN_DOWNLOAD_DIR];
    })
    .finally(() => {
      loadingInitial = false;
    });

  const handleLocation = () => {
    if (loadingSubmit) return;

    loadingSubmit = true;
    if (!$selectedTorrents.length) {
      loadingSubmit = false;
      alerts.add('请至少选择一个种子', 'negative');
      return;
    }

    torrents
      .setLocation($selectedTorrents, location, moveData)
      .then(() => {
        alerts.add('位置设置成功');
        modals.close();
      })
      .catch(() => {
        alerts.add('位置设置失败', 'negative');
        loadingSubmit = false;
      });
  };
</script>

<h1>设置种子位置</h1>

<div class="content" class:loading-initial={loadingInitial}>
  <Icon name="SpinnerIcon" />
  <form on:submit|preventDefault={handleLocation}>
    <InputPath
      type="text"
      bind:value={location}
      placeholder="保存位置"
      label="种子位置"
      pattern={PATH_VALIDATION_REGEX}
      validationMessage="保存位置必须是绝对路径。"
      required
    />
    <div class="button-group">
      <Checkbox label="移动数据" bind:checked={moveData} />
      <Button priority="tertiary" on:click={modals.close}>取消</Button>
      <Button priority="primary" loading={loadingSubmit} type="submit">
        设置种子位置
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

  .content.loading-initial {
    display: flex;
    align-items: center;
    justify-content: center;
    fill: var(--color-modal-loading);
  }

  .content > :global(.icon) {
    position: absolute;
    height: 30px;
    width: 30px;
    display: none;
  }

  .content.loading-initial > :global(.icon) {
    display: inherit;
  }

  .content.loading-initial form {
    visibility: hidden;
  }

  .button-group {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    margin-top: 25px;
    gap: 10px;
  }
</style>
