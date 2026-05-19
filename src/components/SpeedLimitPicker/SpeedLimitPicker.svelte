<script>
  import Dropdown from '~components/Dropdown';
  import { session } from '~helpers/stores';
  import { buildSpeedLimitOptions } from '~helpers/speedLimitOptions';
  import {
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SPEED,
    SESSION_COLUMN_ALT_SPEED_ENABLED,
  } from '~helpers/constants/columns';

  /** @type {'download' | 'upload'} */
  export let direction;

  const speedLimitStore = session.speedLimit(direction);

  $: perSize =
    $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED] ?? 1024;
  $: altSpeedEnabled = !!$session[SESSION_COLUMN_ALT_SPEED_ENABLED];
  $: listLabel = direction === 'download' ? '下载限速' : '上传限速';
  $: lists = {
    [listLabel]: buildSpeedLimitOptions($speedLimitStore, direction, perSize),
  };

  const handleSelect = ({ detail: option }) => {
    session.updateSpeedLimit(
      direction,
      option.value != null,
      option.value,
      altSpeedEnabled
    );
  };
</script>

<Dropdown
  header={listLabel}
  {lists}
  align={direction === 'upload' ? 'end' : 'start'}
  on:select={handleSelect}
>
  <svelte:fragment slot="trigger">
    <slot />
  </svelte:fragment>
</Dropdown>
