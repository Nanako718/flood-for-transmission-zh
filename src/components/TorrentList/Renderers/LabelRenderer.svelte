<script>
  import Badge from '~components/Badge';
  import { getLabelInlineStyle } from '~helpers/labelColorHelper';

  export let value;
  export let torrentStatusClass = null;

  $: muted =
    torrentStatusClass?.includes('stopped') &&
    !torrentStatusClass?.includes('error');
</script>

<div class="labels {torrentStatusClass}">
  {#each value as label (label)}
    <Badge inlineStyle={getLabelInlineStyle(label, { muted })}>{label}</Badge>
  {/each}
</div>

<style>
  .labels {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 4px;
    min-height: 22px;
    padding: 2px 0;
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100%;
    contain: layout style;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  .labels > :global(.badge) {
    margin-left: 0;
    flex-shrink: 0;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    border: 1px solid;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  }
</style>
