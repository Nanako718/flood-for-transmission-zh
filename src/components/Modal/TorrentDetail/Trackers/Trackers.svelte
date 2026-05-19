<script>
  import { torrentDetails } from '~helpers/stores';
  import { TRANSMISSION_COLUMN_TRACKERS } from '~helpers/constants/columns';
  import Badge from '~components/Badge';
  import Input from '~components/Input';
  import ActionBarView from '~components/Modal/TorrentDetail/ActionBarView';
  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';

  $: trackers = $torrentDetails[TRANSMISSION_COLUMN_TRACKERS];
  let selectedTrackers = [];
  let newTracker = null;

  const toggleSelectedTracker = (event) => {
    if (!selectedTrackers.includes(event.target.value)) {
      selectedTrackers = [...selectedTrackers, event.target.value];
      return;
    }

    selectedTrackers = selectedTrackers.filter((t) => t !== event.target.value);
  };

  const removeTrackers = () => {
    let newTrackers = structuredClone(
      $torrentDetails[TRANSMISSION_COLUMN_TRACKERS]
    );
    newTrackers = newTrackers.filter(
      (t) => !selectedTrackers.includes(t.id.toString())
    );
    newTrackers = newTrackers.map((tracker) => tracker.announce).join('\n\n');
    torrentDetails.setTrackers($torrentDetails, newTrackers);
    selectedTrackers = [];
  };

  const addTracker = (event) => {
    event.preventDefault();

    let newTrackers = structuredClone(
      $torrentDetails[TRANSMISSION_COLUMN_TRACKERS]
    );
    newTrackers = newTrackers.map((tracker) => tracker.announce);
    newTrackers = [...newTrackers, newTracker.trim()].join('\n\n');
    torrentDetails.setTrackers($torrentDetails, newTrackers);
    newTracker = null;
  };
</script>

<div class="torrent-detail-trackers">
  <ActionBarView
    items={selectedTrackers}
    itemName="tracker"
    itemNamePlural="trackers"
  >
    {#if trackers.length}
      <div class="torrent-detail-table-wrap">
        <table class="torrent-detail-table">
          <thead>
            <tr>
              <th class="torrent-detail-table-title">
                <span class="torrent-detail-table-title-inner">
                  Tracker
                  <Badge>{trackers.length}</Badge>
                </span>
              </th>
              <th>层级</th>
            </tr>
          </thead>
          <tbody>
            {#each trackers as tracker (tracker.id)}
              <tr>
                <td class="torrent-detail-table-tracker">
                  <Checkbox
                    on:change={toggleSelectedTracker}
                    group={selectedTrackers}
                    value={tracker.id.toString()}
                  />
                  {tracker.announce}
                </td>
                <td>{tracker.tier}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <p class="torrent-detail-empty">暂无 Tracker</p>
    {/if}

    <form
      class="torrent-detail-tracker-add"
      slot="form"
      on:submit={addTracker}
    >
      <Input
        bind:value={newTracker}
        class="new-tracker-input"
        name="tracker"
        type="url"
        placeholder="Tracker Announce 地址"
      />
      <Button type="submit">添加 Tracker</Button>
    </form>

    <div slot="actions">
      <Button priority="tertiary" on:click={removeTrackers}>
        移除所选
      </Button>
    </div>
  </ActionBarView>
</div>

<style>
  .torrent-detail-trackers {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
