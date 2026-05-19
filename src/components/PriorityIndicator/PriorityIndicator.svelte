<script>
  import { createEventDispatcher } from 'svelte';

  /** @type {number | null} 为 null 时表示多项优先级不一致（批量操作） */
  export let value = 0;
  export let allowDisabled = false;
  /** 文件列表等窄行使用短标签 */
  export let compact = false;
  /** @deprecated 保留以兼容旧用法 */
  export const showLabel = false;

  const dispatch = createEventDispatcher();

  $: options = allowDisabled
    ? [
        { label: compact ? '禁' : '不下载', value: -2, level: 'off' },
        { label: '低', value: -1, level: 'low' },
        { label: compact ? '普' : '普通', value: 0, level: 'normal' },
        { label: '高', value: 1, level: 'high' },
      ]
    : [
        { label: '低', value: -1, level: 'low' },
        { label: compact ? '普' : '普通', value: 0, level: 'normal' },
        { label: '高', value: 1, level: 'high' },
      ];

  $: mixed = value === null || value === undefined;

  const select = (next) => {
    if (mixed || next !== value) {
      dispatch('click', next);
    }
  };
</script>

<div
  class="priority-select"
  class:compact
  class:priority-select--mixed={mixed}
  role="group"
  aria-label="优先级"
>
  {#each options as opt (opt.value)}
    <button
      type="button"
      class="priority-select__option priority-select__option--{opt.level}"
      class:active={!mixed && value === opt.value}
      aria-pressed={!mixed && value === opt.value}
      title={opt.label}
      on:click={() => select(opt.value)}
    >
      {opt.label}
    </button>
  {/each}
</div>
