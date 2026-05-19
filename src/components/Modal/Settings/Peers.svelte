<script>
  import Header from './Header.svelte';
  import Checkbox from '~components/Checkbox';
  import Input from '~components/Input';
  import Icon from '~components/Icon';
  import Button from '~components/Button';
  import Select from '~components/Select';
  import { session, modals, alerts } from '~helpers/stores';
  import {
    SESSION_COLUMN_BLOCKLIST_ENABLED,
    SESSION_COLUMN_BLOCKLIST_SIZE,
    SESSION_COLUMN_BLOCKLIST_URL,
    SESSION_COLUMN_DHT_ENABLED,
    SESSION_COLUMN_ENCRYPTION,
    SESSION_COLUMN_LPD_ENABLED,
    SESSION_COLUMN_PEER_LIMIT_GLOBAL,
    SESSION_COLUMN_PEER_LIMIT_PER_TORRENT,
    SESSION_COLUMN_PEX_ENABLED,
  } from '~helpers/constants/columns';

  let loadingInitial = true;
  let submitLoading = false;
  let blocklistUpdateLoading = false;

  let maxPeersPerTorrent = null;
  let maxPeersOverall = null;
  let pexEnabled = null;
  let dhtEnabled = null;
  let lpdEnabled = null;
  let blocklistUrl = null;
  let blocklistEnabled = null;
  let blocklistSize = 0;
  let encryption = null;

  const numberFormatter = new Intl.NumberFormat();
  const encryptionOptions = [
    { label: '必需', value: 'required' },
    { label: '首选', value: 'preferred' },
    { label: '允许', value: 'tolerated' },
  ];

  session
    .addColumns([
      SESSION_COLUMN_BLOCKLIST_ENABLED,
      SESSION_COLUMN_BLOCKLIST_SIZE,
      SESSION_COLUMN_BLOCKLIST_URL,
      SESSION_COLUMN_DHT_ENABLED,
      SESSION_COLUMN_ENCRYPTION,
      SESSION_COLUMN_LPD_ENABLED,
      SESSION_COLUMN_PEER_LIMIT_GLOBAL,
      SESSION_COLUMN_PEER_LIMIT_PER_TORRENT,
      SESSION_COLUMN_PEX_ENABLED,
    ])
    .then(($session) => {
      maxPeersPerTorrent = $session[SESSION_COLUMN_PEER_LIMIT_PER_TORRENT];
      maxPeersOverall = $session[SESSION_COLUMN_PEER_LIMIT_GLOBAL];
      pexEnabled = $session[SESSION_COLUMN_PEX_ENABLED];
      dhtEnabled = $session[SESSION_COLUMN_DHT_ENABLED];
      lpdEnabled = $session[SESSION_COLUMN_LPD_ENABLED];
      blocklistUrl = $session[SESSION_COLUMN_BLOCKLIST_URL];
      blocklistEnabled = $session[SESSION_COLUMN_BLOCKLIST_ENABLED];
      blocklistSize = $session[SESSION_COLUMN_BLOCKLIST_SIZE];
      encryption = $session[SESSION_COLUMN_ENCRYPTION];
      loadingInitial = false;
    })
    .catch(() => {
      alerts.add('暂时无法获取数据，请稍后再试。', 'negative');
    })
    .finally(() => {
      loadingInitial = false;
    });

  const updateBlocklist = () => {
    blocklistUpdateLoading = true;

    session
      .update({
        'blocklist-url': blocklistUrl,
      })
      .then(session.updateBlocklist)
      .then((newBlocklistSize) => {
        blocklistSize = newBlocklistSize;
        alerts.add('屏蔽列表已更新');
      })
      .catch(() => {
        alerts.add(
          '屏蔽列表更新失败，请重试',
          'negative'
        );
      })
      .finally(() => {
        blocklistUpdateLoading = false;
      });
  };

  const handleSubmit = () => {
    submitLoading = true;

    session
      .update({
        'peer-limit-per-torrent': maxPeersPerTorrent,
        'peer-limit-global': maxPeersOverall,
        'pex-enabled': pexEnabled,
        'dht-enabled': dhtEnabled,
        'lpd-enabled': lpdEnabled,
        'blocklist-url': blocklistUrl,
        'blocklist-enabled': blocklistEnabled,
        'encryption': encryption,
      })
      .then(() => {
        alerts.add('Peer 设置已保存');
        modals.close();
      })
      .catch(() => {
        alerts.add(
          'Peer 设置保存失败，请重试',
          'negative'
        );
      })
      .finally(() => {
        submitLoading = false;
      });
  };
</script>

<div class="wrapper" class:loading-initial={loadingInitial}>
  <Icon name="SpinnerIcon" />
  <form
    novalidate
    onsubmit={(event) => {
      event.preventDefault();
      handleSubmit();
    }}
  >
    <Header text="连接" />
    <Input
      bind:value={maxPeersPerTorrent}
      label="单种 Peer 上限"
      type="number"
    />
    <Input
      bind:value={maxPeersOverall}
      label="全局 Peer 上限"
      type="number"
    />

    <Header text="选项" />
    <Checkbox bind:checked={pexEnabled} label="启用 PEX" />
    <Checkbox bind:checked={dhtEnabled} label="启用 DHT" />
    <Checkbox bind:checked={lpdEnabled} label="启用 LPD" />

    <Header text="隐私" />
    <Select
      options={encryptionOptions}
      on:change={(event) => (encryption = event.detail)}
      value={encryption}
      direction="below"
      label="加密"
    />

    <Header text="屏蔽列表" />
    <Checkbox bind:checked={blocklistEnabled} label="启用屏蔽列表" />
    <Input
      bind:value={blocklistUrl}
      type="url"
      hint="屏蔽列表共有 {numberFormatter.format(blocklistSize)} 条规则"
    />
    <div class="update-wrapper">
      <Button
        type="button"
        priority="tertiary"
        on:click={updateBlocklist}
        loading={blocklistUpdateLoading}>更新屏蔽列表</Button
      >
    </div>

    <div class="buttons">
      <Button type="button" priority="tertiary" onclick={() => modals.close()}>
        取消
      </Button>
      <Button type="submit" priority="primary" loading={submitLoading}>
        保存设置
      </Button>
    </div>
  </form>
</div>

<style>
  .wrapper {
    min-height: 100%;
    display: flex;
  }

  .wrapper.loading-initial {
    align-items: center;
    justify-content: center;
    fill: var(--color-modal-loading);
  }

  .wrapper > :global(.icon) {
    position: absolute;
    height: 30px;
    width: 30px;
    display: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .wrapper.loading-initial > :global(.icon) {
    display: inherit;
  }

  .wrapper.loading-initial form {
    visibility: hidden;
    pointer-events: none;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    line-height: 1;
    color: var(--color-modal-text);
  }

  form :global(.checkbox),
  form :global(.select) {
    margin-bottom: 15px;
  }

  .update-wrapper {
    margin-bottom: 15px;
  }

  .buttons {
    flex-grow: 1;
    align-items: flex-end;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
</style>
