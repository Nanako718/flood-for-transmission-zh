<script>
  import Icon from '~components/Icon';
  import Header from '~components/Modal/TorrentDetail/Header';
  import Details from '~components/Modal/TorrentDetail/Details';
  import Files from '~components/Modal/TorrentDetail/Files';
  import Peers from '~components/Modal/TorrentDetail/Peers';
  import Trackers from '~components/Modal/TorrentDetail/Trackers';
  import { torrentDetails } from '~helpers/stores';
  import { onMount, onDestroy } from 'svelte';

  export let torrentId;

  const pages = [
    {
      name: '详情',
      component: Details,
    },
    {
      name: '文件',
      component: Files,
    },
    {
      name: 'Peer',
      component: Peers,
    },
    {
      name: 'Tracker',
      component: Trackers,
    },
  ];
  let page = pages[0];

  onMount(() => {
    torrentDetails.setTorrentId(torrentId);
  });

  onDestroy(() => {
    torrentDetails.clearTorrentId();
  });

  $: loadingInitial = !Object.keys($torrentDetails).length;
</script>

<div class="container" class:loading-initial={loadingInitial}>
  <Icon name="SpinnerIcon" />
  <Header torrentId={torrentId} />
  <div class="body">
    <nav class="torrent-detail-nav" aria-label="种子详情分类">
      {#each pages as { name, component } (name)}
        <button
          type="button"
          class="torrent-detail-nav-item"
          class:active={page.name === name}
          aria-current={page.name === name ? 'page' : undefined}
          on:click={() => (page = { name, component })}
        >
          {name}
        </button>
      {/each}
    </nav>
    <div class="page-content">
      <svelte:component this={page.component} />
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .container.loading-initial {
    align-items: center;
    justify-content: center;
    fill: var(--color-modal-loading);
    height: 100%;
  }

  .container > :global(.icon) {
    position: absolute;
    height: 30px;
    width: 30px;
    display: none;
  }

  .container.loading-initial > :global(.icon) {
    display: inherit;
  }

  .container.loading-initial > :global(.torrent-detail-header) {
    display: none;
  }

  .container.loading-initial > .body {
    display: none;
  }

  .body {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .page-content {
    flex: 1;
    min-height: 0;
    min-width: 0;
  }

  @media (max-width: 700px) {
    .body {
      flex-direction: column;
    }
  }
</style>
