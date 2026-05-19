<script>
  import { torrentDetails, ipAddress, session } from '~helpers/stores';
  import {
    TRANSMISSION_COLUMN_PEERS,
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SPEED,
  } from '~helpers/constants/columns';
  import { getSize } from '~helpers/sizeHelper';
  import Badge from '~components/Badge';
  import Icon from '~components/Icon';

  $: peers = $torrentDetails[TRANSMISSION_COLUMN_PEERS];
  $: ipAddress.add(peers.map((peer) => peer.address));

  const getDownloadSpeed = (peer) => {
    return getSize(peer.rateToClient, {
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
      isSpeed: true,
    });
  };

  const getUploadSpeed = (peer) => {
    return getSize(peer.rateToPeer, {
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
      isSpeed: true,
    });
  };
</script>

<div class="torrent-detail-page">
  {#if peers.length}
    <div class="torrent-detail-table-wrap">
      <table class="torrent-detail-table">
        <thead>
          <tr>
            <th class="torrent-detail-table-title">
              <span class="torrent-detail-table-title-inner">
                Peer
                <Badge>{peers.length}</Badge>
              </span>
            </th>
            <th>下</th>
            <th>上</th>
            <th>%</th>
            <th>客户端</th>
            <th>加密</th>
          </tr>
        </thead>
        <tbody>
          {#each peers as peer (peer.address)}
            <tr>
              <td class="torrent-detail-table-peer">
                {#if $ipAddress[peer.address]?.country_code}
                  <img
                    class="peer-flag"
                    src="images/flags/{$ipAddress[
                      peer.address
                    ].country_code.toLowerCase()}.png"
                    alt="{$ipAddress[peer.address].country_code}"
                    title="{$ipAddress[peer.address].country_name}"
                  />
                {:else}
                  <img
                    class="peer-flag"
                    src="images/flags/_unknown.png"
                    alt="未知"
                  />
                {/if}
                <span class="peer-address">{peer.address}</span>
              </td>
              <td>
                {getDownloadSpeed(peer).value}<em class="unit"
                  >{getDownloadSpeed(peer).size}</em
                >
              </td>
              <td>
                {getUploadSpeed(peer).value}<em class="unit"
                  >{getUploadSpeed(peer).size}</em
                >
              </td>
              <td>{Math.round(peer.progress * 100)}%</td>
              <td>{peer.clientName}</td>
              <td>
                {#if peer.isEncrypted}
                  <Icon name="Checkmark" />
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <p class="torrent-detail-empty">当前没有已连接的 Peer</p>
  {/if}
</div>
