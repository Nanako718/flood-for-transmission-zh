<script>
  import Menu from './Menu.svelte';
  import Torrents from './Torrents.svelte';
  import Speed from './Speed.svelte';
  import Peers from './Peers.svelte';
  import Network from './Network.svelte';
  import UserInterface from './UserInterface.svelte';
  import About from './About.svelte';

  export let activePageId = 'torrents';

  const pages = [
    { id: 'torrents', component: Torrents, name: '种子' },
    { id: 'speed', component: Speed, name: '速度' },
    { id: 'peers', component: Peers, name: 'Peer' },
    { id: 'network', component: Network, name: '网络' },
    { id: 'user-interface', component: UserInterface, name: '界面' },
    { id: 'about', component: About, name: '关于' },
  ];

  $: activePage = pages.find((page) => page.id === activePageId) ?? pages[0];
</script>

<div class="wrapper">
  <Menu bind:activePageId={activePageId} pages={pages} />
  <div class="content settings-content">
    <svelte:component this={activePage.component} />
  </div>
</div>

<style>
  .wrapper {
    display: grid;
    grid-template: 'menu content' 100% / 188px 1fr;
    overflow: hidden;
    height: 100%;
  }

  .content {
    padding: 20px 25px;
    overflow-y: auto;
    flex-grow: 1;
    position: relative;
    grid-area: content;
  }

  @media (max-width: 700px) {
    .wrapper {
      grid-template: 'menu' auto 'content' 1fr / 1fr;
    }

    .content {
      padding: 10px 25px;
    }
  }
</style>
