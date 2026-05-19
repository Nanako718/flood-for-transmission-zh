<script>
  import Icon from '~components/Icon';

  export let value;
  export const torrentStatusClass = null;

  let seconds;
  let minutes;
  let hours;
  let days;

  $: {
    seconds = Math.floor(value % 60);
    if (seconds < 10) seconds = `0${seconds}`;
    minutes = Math.floor((value / 60) % 60);
    if (minutes < 10) minutes = `0${minutes}`;
    hours = Math.floor((value / 60 / 60) % 24);
    days = Math.floor(value / 60 / 60 / 24);
  }
</script>

<span>
  {#if value <= 0}
    <Icon name="InfinityIcon" />
  {:else if days}
    {days}
    <em>天</em>
    {hours}
    <em>时</em>
  {:else if hours}
    {hours}
    <em>时</em>
    {minutes}
    <em>分</em>
  {:else if minutes}
    {minutes}
    <em>分</em>
    {seconds}
    <em>秒</em>
  {:else}{seconds} <em>秒</em>{/if}
</span>

<style>
  em {
    font-style: normal;
    font-size: 10px;
  }

  span > :global(.icon) {
    fill: currentColor;
    height: 13px;
    vertical-align: middle;
  }
</style>
