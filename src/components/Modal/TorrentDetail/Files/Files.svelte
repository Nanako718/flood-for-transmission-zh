<script>
  import { torrentDetails } from '~helpers/stores';
  import {
    TRANSMISSION_COLUMN_DOWNLOAD_DIR,
    TRANSMISSION_COLUMN_FILES,
    TRANSMISSION_COLUMN_FILE_STATS,
  } from '~helpers/constants/columns';

  import PriorityIndicator from '~components/PriorityIndicator';
  import ActionBarView from '~components/Modal/TorrentDetail/ActionBarView';
  import Folder from './Folder';
  import {
    getFolderStructure,
    getMainFolder,
  } from '~helpers/folderStructureHelper';

  let selectedFiles = [];

  const filePriority = (index) =>
    $torrentDetails[TRANSMISSION_COLUMN_FILE_STATS]?.[index]?.priority ?? 0;

  $: bulkFilePriority = (() => {
    if (!selectedFiles.length) return 0;
    const first = filePriority(selectedFiles[0]);
    return selectedFiles.every((i) => filePriority(i) === first) ? first : null;
  })();

  $: files = $torrentDetails[TRANSMISSION_COLUMN_FILES].toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );
  $: structure = getFolderStructure(files);

  const handleBulkFilePrioChange = (event) => {
    if (!selectedFiles.length) return;
    torrentDetails.setPriority($torrentDetails, selectedFiles, event.detail);
  };

  const handleSingleFilePrioChange = (fileIndex, event) => {
    torrentDetails.setPriority($torrentDetails, [fileIndex], event.detail);
  };
</script>

<div class="torrent-detail-files">
  <ActionBarView items={selectedFiles} itemName="文件">
    {#if files.length}
      <Folder
        structure={structure}
        bind:selectedFiles={selectedFiles}
        iconName="Disk"
        folderName={getMainFolder(
          $torrentDetails[TRANSMISSION_COLUMN_DOWNLOAD_DIR],
          files[0]
        )}
        collapsible={false}
        strong={true}
        onSingleFilePrioChange={handleSingleFilePrioChange}
      />
    {:else}
      <p class="torrent-detail-empty">
        暂无文件可显示，可能缺少元数据。
      </p>
    {/if}

    <div slot="actions" class="bulk-priority">
      <PriorityIndicator
        allowDisabled
        value={bulkFilePriority}
        on:click={handleBulkFilePrioChange}
      />
    </div>
  </ActionBarView>
</div>

<style>
  .torrent-detail-files {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .bulk-priority {
    flex-shrink: 0;
  }
</style>
