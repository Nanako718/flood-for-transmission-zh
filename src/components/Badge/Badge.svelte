<script>
  /** 列表标签等场景传入行内配色，覆盖默认徽章变量 */
  export let inlineStyle = '';
</script>

<div class="badge" class:custom={inlineStyle} style={inlineStyle || undefined}>
  <slot />
</div>

<style>
  .badge {
    color: var(--color-badge-text);
    background-color: var(--color-badge-background);
    border-radius: 100px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    margin-left: 10px;
    padding: 2px 5px;
    transition:
      background-color 0.25s,
      color 0.25s,
      border-color 0.25s;
    border: 1px solid transparent;
  }

  .badge.custom {
    margin-left: 0;
  }
</style>
