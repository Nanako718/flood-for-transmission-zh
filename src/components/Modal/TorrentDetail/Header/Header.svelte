<script>
  import Icon from '~components/Icon';
  import { torrentDetails, session, torrents } from '~helpers/stores';
  import {
    STATUSES,
    STATUS_DOWNLOADING,
    STATUS_STOPPED,
  } from '~helpers/constants/statuses';
  import {
    TRANSMISSION_COLUMN,
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SPEED,
    SESSION_COLUMN_UNITS_SIZE,
  } from '~helpers/constants/columns';
  import { getSize } from '~helpers/sizeHelper';
  import ArrivalRenderer from '~components/TorrentList/Renderers/ArrivalRenderer.svelte';
  import PriorityIndicator from '~components/PriorityIndicator/PriorityIndicator.svelte';
  import ProgressRenderer from '~components/TorrentList/Renderers/ProgressRenderer';
  import { generateTorrentStatusClass } from '~helpers/classHelper';

  export let torrentId;

  $: downloadSpeed = getSize(
    $torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_RATE] || 0,
    {
      isSpeed: true,
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
    }
  );
  $: uploadSpeed = getSize(
    $torrentDetails[TRANSMISSION_COLUMN.UPLOAD_RATE] || 0,
    {
      isSpeed: true,
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
    }
  );
  $: downloadSize = getSize(
    $torrentDetails[TRANSMISSION_COLUMN.DOWNLOADED] || 0,
    {
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
    }
  );
  $: uploadSize = getSize($torrentDetails[TRANSMISSION_COLUMN.UPLOADED] || 0, {
    perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
  });

  $: torrentStatus = $torrentDetails[TRANSMISSION_COLUMN.STATUS];
  $: isStopped = torrentStatus === STATUSES.indexOf(STATUS_STOPPED);
  $: isActive = torrentStatus > 0;

  const updatePriority = (event) => {
    const newPrio = event.detail;
    torrents.setTorrents([torrentId], {
      [TRANSMISSION_COLUMN.PRIORITY]: newPrio,
    });
    torrentDetails.update((torrent) => {
      torrent[TRANSMISSION_COLUMN.PRIORITY] = newPrio;
      return torrent;
    });
  };

  const startTorrent = () => {
    if ($torrentDetails[TRANSMISSION_COLUMN.STATUS] > 0) {
      return;
    }

    torrents.start([torrentId]);
    torrentDetails.update((torrent) => {
      torrent[TRANSMISSION_COLUMN.STATUS] =
        STATUSES.indexOf(STATUS_DOWNLOADING);
      return torrent;
    });
  };

  const stopTorrent = () => {
    if ($torrentDetails[TRANSMISSION_COLUMN.STATUS] === 0) {
      return;
    }

    torrents.stop([torrentId]);
    torrentDetails.update((torrent) => {
      torrent[TRANSMISSION_COLUMN.STATUS] = STATUSES.indexOf(STATUS_STOPPED);
      return torrent;
    });
  };

  const makeEditable = (e) => {
    e.target.setAttribute('contenteditable', true);
    e.target.focus();
    document.execCommand('selectAll', false, null);
  };

  const rename = (e) => {
    const newName = e.target.innerText.trim();

    if (!newName) {
      e.target.innerText = $torrentDetails[TRANSMISSION_COLUMN.NAME];
      return;
    }

    torrents.rename(
      [torrentId],
      $torrentDetails[TRANSMISSION_COLUMN.NAME],
      newName
    );
    torrentDetails.update((torrent) => {
      torrent[TRANSMISSION_COLUMN.NAME] = newName;
      torrent[TRANSMISSION_COLUMN.FILES] = torrent[
        TRANSMISSION_COLUMN.FILES
      ].map((file) => {
        const parts = file.name.split('/');
        parts[0] = newName;
        return { ...file, name: parts.join('/') };
      });
      return torrent;
    });
    e.target.removeAttribute('contenteditable');
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/html');
    const resultElement = document.createElement('div');
    resultElement.innerHTML = text;
    e.target.innerText = resultElement.innerText;
  };

  const handleEnter = (e) => {
    const key = e.keyCode;
    if (key === 13) e.target.blur();
  };
</script>

<div class="torrent-detail-header">
  <div
    class="torrent-detail-title"
    role="textbox"
    tabindex="0"
    aria-label="种子名称，双击可重命名"
    on:dblclick={makeEditable}
    on:blur={rename}
    on:paste={handlePaste}
    on:keydown={handleEnter}
  >
    {$torrentDetails[TRANSMISSION_COLUMN.NAME]}
  </div>
  <div class="torrent-detail-subheading">
    <ul class="torrent-detail-stats">
      <li
        class="torrent-detail-stat"
        class:torrent-detail-stat--active-download={!!downloadSpeed.value}
        title="下载速度"
      >
        <Icon name="Download" />
        <span>
          {downloadSpeed.value}<em>{downloadSpeed.size}</em>
          ·
          {downloadSize.value}<em>{downloadSize.size}</em>
        </span>
      </li>
      <li
        class="torrent-detail-stat"
        class:torrent-detail-stat--active-upload={!!uploadSpeed.value}
        title="上传速度"
      >
        <Icon name="Upload" />
        <span>
          {uploadSpeed.value}<em>{uploadSpeed.size}</em>
          ·
          {uploadSize.value}<em>{uploadSize.size}</em>
        </span>
      </li>
      <li class="torrent-detail-stat" title="分享率">
        <Icon name="RatioIcon" />
        {($torrentDetails[TRANSMISSION_COLUMN.RATIO] || 0).toFixed(2)}
      </li>
      <li class="torrent-detail-stat" title="剩余时间">
        <Icon name="ETA" />
        <ArrivalRenderer value={$torrentDetails[TRANSMISSION_COLUMN.ETA]} />
      </li>
    </ul>

    <div class="torrent-detail-toolbar">
      <div class="torrent-detail-priority-block">
        <span class="torrent-detail-priority-label">优先级</span>
        <PriorityIndicator
          value={$torrentDetails[TRANSMISSION_COLUMN.PRIORITY]}
          on:click={updatePriority}
        />
      </div>
      <div
        class="transport-group"
        role="group"
        aria-label="传输控制"
      >
        <button
          type="button"
          class="transport-btn transport-btn--labeled transport-btn--start"
          disabled={isActive}
          title={isActive ? '任务运行中' : '开始'}
          on:click={startTorrent}
        >
          <Icon name="StartIcon" />
          开始
        </button>
        <button
          type="button"
          class="transport-btn transport-btn--labeled transport-btn--stop"
          disabled={isStopped}
          title={isStopped ? '已停止' : '停止'}
          on:click={stopTorrent}
        >
          <Icon name="StopIcon" />
          停止
        </button>
      </div>
    </div>
  </div>
  <ProgressRenderer
    value={$torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_PROGRESS]}
    torrentStatus={STATUSES[$torrentDetails[TRANSMISSION_COLUMN.STATUS]]}
    torrentStatusClass={generateTorrentStatusClass($torrentDetails)}
    metadataProgress={$torrentDetails[TRANSMISSION_COLUMN.METADATA_PROGRESS]}
    checkingProgress={$torrentDetails[TRANSMISSION_COLUMN.RECHECK_PROGRESS]}
  />
</div>

