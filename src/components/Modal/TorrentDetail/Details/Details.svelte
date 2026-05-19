<script>
  import { torrentDetails, session } from '~helpers/stores';
  import {
    TRANSMISSION_COLUMN,
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SIZE,
  } from '~helpers/constants/columns';
  import { getSize } from '~helpers/sizeHelper';
  import DateRenderer from '~components/TorrentList/Renderers/DateRenderer.svelte';
  import BooleanRenderer from '~components/TorrentList/Renderers/BooleanRenderer.svelte';
  import Badge from '~components/Badge';
  import { getLabelInlineStyle } from '~helpers/labelColorHelper';
  import Input from '~components/Input';
  import Select from '~components/Select';
  import Checkbox from '~components/Checkbox';
  import InputPath from '~components/InputPath';
  import Button from '~components/Button';

  let downloadLimit = null;
  let downloadLimitEnabled = null;
  let uploadLimit = null;
  let uploadLimitEnabled = null;
  let honorsSessionLimits = null;
  let location = null;
  let peerLimit = null;
  let queuePosition = null;
  let seedIdleLimit = null;
  let seedIdleMode = null;
  let seedRatioLimit = null;
  let seedRatioMode = null;
  let sequentialDownload = null;

  let loadingInitial = true;
  let loadingSubmit = false;

  const seedModeOptions = [
    { label: '全局', value: 0 },
    { label: '自定义', value: 1 },
    { label: '不限', value: 2 },
  ];

  $: {
    if (loadingInitial && $torrentDetails.loaded) {
      setServerValues();
    }
  }

  function setServerValues() {
    downloadLimit = $torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_LIMIT];
    downloadLimitEnabled =
      $torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_LIMIT_ENABLED];
    uploadLimit = $torrentDetails[TRANSMISSION_COLUMN.UPLOAD_LIMIT];
    uploadLimitEnabled =
      $torrentDetails[TRANSMISSION_COLUMN.UPLOAD_LIMIT_ENABLED];
    honorsSessionLimits =
      $torrentDetails[TRANSMISSION_COLUMN.HONORS_SESSION_LIMITS];
    location = $torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_DIR];
    peerLimit = $torrentDetails[TRANSMISSION_COLUMN.PEER_LIMIT];
    queuePosition = $torrentDetails[TRANSMISSION_COLUMN.QUEUE_POSITION];
    seedIdleLimit = $torrentDetails[TRANSMISSION_COLUMN.SEED_IDLE_LIMIT];
    seedIdleMode = $torrentDetails[TRANSMISSION_COLUMN.SEED_IDLE_MODE];
    seedRatioLimit = $torrentDetails[TRANSMISSION_COLUMN.SEED_RATIO_LIMIT];
    seedRatioMode = $torrentDetails[TRANSMISSION_COLUMN.SEED_RATIO_MODE];
    sequentialDownload =
      $torrentDetails[TRANSMISSION_COLUMN.SEQUENTIAL_DOWNLOAD];

    loadingInitial = false;
  }

  function handleSubmit() {
    loadingSubmit = true;

    torrentDetails
      .setDetails($torrentDetails, {
        [TRANSMISSION_COLUMN.DOWNLOAD_LIMIT]: downloadLimit,
        [TRANSMISSION_COLUMN.DOWNLOAD_LIMIT_ENABLED]: downloadLimitEnabled,
        [TRANSMISSION_COLUMN.UPLOAD_LIMIT]: uploadLimit,
        [TRANSMISSION_COLUMN.UPLOAD_LIMIT_ENABLED]: uploadLimitEnabled,
        [TRANSMISSION_COLUMN.HONORS_SESSION_LIMITS]: honorsSessionLimits,
        [TRANSMISSION_COLUMN.DOWNLOAD_DIR]: location,
        [TRANSMISSION_COLUMN.PEER_LIMIT]: peerLimit,
        [TRANSMISSION_COLUMN.QUEUE_POSITION]: queuePosition,
        [TRANSMISSION_COLUMN.SEED_IDLE_LIMIT]: seedIdleLimit,
        [TRANSMISSION_COLUMN.SEED_IDLE_MODE]: seedIdleMode,
        [TRANSMISSION_COLUMN.SEED_RATIO_LIMIT]: seedRatioLimit,
        [TRANSMISSION_COLUMN.SEED_RATIO_MODE]: seedRatioMode,
        [TRANSMISSION_COLUMN.SEQUENTIAL_DOWNLOAD]: sequentialDownload,
      })
      .catch(() => {
        setServerValues();
      })
      .finally(() => {
        loadingSubmit = false;
      });
  }

  $: size = getSize($torrentDetails[TRANSMISSION_COLUMN.SIZE], {
    perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
  });

  $: downloaded = getSize($torrentDetails[TRANSMISSION_COLUMN.DOWNLOADED], {
    perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
  });

  $: uploaded = getSize($torrentDetails[TRANSMISSION_COLUMN.UPLOADED], {
    perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
  });
</script>

<form on:submit|preventDefault={handleSubmit} class="torrent-detail-page">
  <section class="torrent-detail-section">
    <h2>常规</h2>
    <div class="torrent-detail-info-grid">
      <div class="torrent-detail-label">添加时间</div>
    <div class="torrent-detail-value">
      <DateRenderer value={$torrentDetails[TRANSMISSION_COLUMN.ADDED]} />
    </div>

    <div class="torrent-detail-label">完成时间</div>
    <div class="torrent-detail-value">
      <DateRenderer value={$torrentDetails[TRANSMISSION_COLUMN.DONE]} />
    </div>

    <div class="torrent-detail-label">标签</div>
    <div class="torrent-detail-value torrent-detail-value--labels">
      {#if $torrentDetails[TRANSMISSION_COLUMN.LABELS]}
        {#each $torrentDetails[TRANSMISSION_COLUMN.LABELS] as label (label)}
          <Badge inlineStyle={getLabelInlineStyle(label)}>{label}</Badge>
        {/each}
      {/if}
    </div>
    </div>
  </section>

  <section class="torrent-detail-section torrent-detail-form-block">
    <InputPath bind:value={location} label="下载位置" />
  </section>

  <section class="torrent-detail-section">
    <h2>传输</h2>
    <div class="torrent-detail-info-grid">
      <div class="torrent-detail-label">下载进度</div>
    <div class="torrent-detail-value">
      {Math.round(
        $torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_PROGRESS] * 10000
      ) / 100}%
    </div>

    <div class="torrent-detail-label">已下载</div>
    <div class="torrent-detail-value">{downloaded.value}{downloaded.size}</div>

    <div class="torrent-detail-label">已上传</div>
    <div class="torrent-detail-value">{uploaded.value}{uploaded.size}</div>

    <div class="torrent-detail-label">下载连接</div>
    <div class="torrent-detail-value">
      {$torrentDetails[TRANSMISSION_COLUMN.DOWNLOADING_FROM]}
      /
      {$torrentDetails[TRANSMISSION_COLUMN.PEERS_CONNECTED]}
    </div>

    <div class="torrent-detail-label">上传连接</div>
    <div class="torrent-detail-value">
      {$torrentDetails[TRANSMISSION_COLUMN.SEEDING_TO]}
      /
      {$torrentDetails[TRANSMISSION_COLUMN.PEERS_CONNECTED]}
    </div>
    </div>
  </section>

  <section class="torrent-detail-section torrent-detail-form-block">
    <div class="torrent-detail-form-row">
      <Checkbox
        bind:checked={downloadLimitEnabled}
        label="下载限速 (kB/s)"
      />
      <Input bind:value={downloadLimit} type="number" />
    </div>

    <div class="torrent-detail-form-row">
      <Checkbox bind:checked={uploadLimitEnabled} label="上传限速 (kB/s)" />
      <Input bind:value={uploadLimit} type="number" />
    </div>

    <div class="torrent-detail-form-row">
      <Checkbox
        bind:checked={honorsSessionLimits}
        label="遵守全局限速"
        hint="关闭后不遵守全局限速"
      />
    </div>

    <div class="torrent-detail-form-row">
      <Checkbox
        bind:checked={sequentialDownload}
        label="顺序下载"
        hint="按顺序下载文件块，而非随机下载"
      />
    </div>

    <div class="torrent-detail-form-row">
      <Input
        bind:value={peerLimit}
        type="number"
        label="Peer 上限"
      />
    </div>

    <div class="torrent-detail-form-row">
      <Input bind:value={queuePosition} type="number" label="队列位置" />
    </div>

    <div class="torrent-detail-form-row torrent-detail-form-row--split">
      <Select
        options={seedModeOptions}
        on:change={(event) => (seedIdleMode = event.detail)}
        value={seedIdleMode}
        direction="below"
        label="空闲做种"
      />
      <Input
        bind:value={seedIdleLimit}
        type="number"
        label="空闲做种限制"
        disabled={seedIdleMode !== 1}
      />
    </div>

    <div class="torrent-detail-form-row torrent-detail-form-row--split">
      <Select
        options={seedModeOptions}
        on:change={(event) => (seedRatioMode = event.detail)}
        value={seedRatioMode}
        direction="below"
        label="分享率模式"
      />
      <Input
        bind:value={seedRatioLimit}
        type="number"
        label="分享率限制"
        step="0.01"
        disabled={seedRatioMode !== 1}
      />
    </div>
  </section>

  <section class="torrent-detail-section">
    <h2>种子信息</h2>
    <div class="torrent-detail-info-grid">
      <div class="torrent-detail-label">备注</div>
    <div class="torrent-detail-value">
      {$torrentDetails[TRANSMISSION_COLUMN.COMMENT]}
    </div>

    <div class="torrent-detail-label">创建日期</div>
    <div class="torrent-detail-value">
      <DateRenderer value={$torrentDetails[TRANSMISSION_COLUMN.CREATED]} />
    </div>

    <div class="torrent-detail-label">哈希</div>
    <div class="torrent-detail-value">
      {$torrentDetails[TRANSMISSION_COLUMN.HASH]}
    </div>

    <div class="torrent-detail-label">大小</div>
    <div class="torrent-detail-value">{size.value}{size.size}</div>

    <div class="torrent-detail-label">私有</div>
    <div class="torrent-detail-value">
      <BooleanRenderer value={$torrentDetails[TRANSMISSION_COLUMN.PRIVATE]} />
    </div>

    <div class="torrent-detail-label">错误信息</div>
    <div class="torrent-detail-value">
      {$torrentDetails[TRANSMISSION_COLUMN.ERROR_STRING]}
    </div>
    </div>
  </section>

  <div class="torrent-detail-page-buttons">
    <Button type="button" priority="tertiary" on:click={setServerValues}>
      重置
    </Button>
    <Button type="submit" priority="primary" loading={loadingSubmit}>
      保存配置
    </Button>
  </div>
</form>


