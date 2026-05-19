<script>
  import PriorityIndicator from '~components/PriorityIndicator';

  export let onItemClick;
  export let prio;
  export let onStart;
  export let onStartNow;
  export let onStop;
  export let onRemove;
  export let onVerify;
  export let onCopyMagnetLink;
  export let onAsk;
  export let onLabels;
  export let onLocation;
  export let onPrio;

  const handlePriority = (event) => {
    onItemClick(onPrio, [event], { shouldClose: false });
    prio = event.detail;
  };
</script>

<li class="context-menu-section" role="presentation">
  <div class="context-menu-section-inner">
    <span class="context-menu-section-title">传输</span>
    <div class="context-menu-items" role="group" aria-label="传输">
      <button
        type="button"
        role="menuitem"
        class="context-menu-item"
        on:click={(...args) => onItemClick(onStart, args)}>开始</button
      >
      <button
        type="button"
        role="menuitem"
        class="context-menu-item"
        on:click={(...args) => onItemClick(onStartNow, args)}>立即开始</button
      >
      <button
        type="button"
        role="menuitem"
        class="context-menu-item"
        on:click={(...args) => onItemClick(onStop, args)}>停止</button
      >
    </div>
  </div>
</li>

<li class="context-menu-section" role="presentation">
  <div class="context-menu-section-inner">
    <span class="context-menu-section-title">管理</span>
    <div class="context-menu-items" role="group" aria-label="管理">
      <button
        type="button"
        role="menuitem"
        class="context-menu-item"
        on:click={(...args) => onItemClick(onRemove, args)}>移除</button
      >
      <button
        type="button"
        role="menuitem"
        class="context-menu-item"
        on:click={(...args) => onItemClick(onVerify, args)}>校验本地数据</button
      >
      <button
        type="button"
        role="menuitem"
        class="context-menu-item"
        on:click={(...args) => onItemClick(onLabels, args)}>设置标签</button
      >
      <button
        type="button"
        role="menuitem"
        class="context-menu-item"
        on:click={(...args) => onItemClick(onLocation, args)}>设置位置</button
      >
    </div>
  </div>
</li>

<li class="context-menu-section" role="presentation">
  <div class="context-menu-section-inner">
    <span class="context-menu-section-title">Tracker</span>
    <div class="context-menu-items" role="group" aria-label="Tracker">
      <button
        type="button"
        role="menuitem"
        class="context-menu-item"
        on:click={(...args) => onItemClick(onCopyMagnetLink, args)}
      >
        复制磁力链接
      </button>
      <button
        type="button"
        role="menuitem"
        class="context-menu-item"
        on:click={(...args) => onItemClick(onAsk, args)}
      >
        向 Tracker 重新汇报
      </button>
    </div>
  </div>
</li>

<li class="context-menu-section context-menu-priority" role="presentation">
  <div class="context-menu-section-inner">
    <span class="context-menu-section-title">优先级</span>
    <div class="context-menu-items">
      <PriorityIndicator value={prio} on:click={handlePriority} />
    </div>
  </div>
</li>
