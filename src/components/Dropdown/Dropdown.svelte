<script>
  import { createEventDispatcher, onDestroy, tick } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  export let header;
  export let lists;
  /** @type {'start' | 'end'} */
  export let align = 'start';

  let open = false;
  let triggerAnchor;
  let menuElement;
  let menuStyle = '';

  const toggleOpen = (onlyClose) => {
    if (onlyClose) {
      open = false;
      return;
    }
    open = !open;
  };

  const optionSelect = (option, event) => {
    event.stopPropagation();
    if (option.selected) return;
    dispatch('select', option);
    open = false;
  };

  const listAccentClass = (listHeader) => {
    if (listHeader === '下载' || listHeader === '下载限速') return 'list--download';
    if (listHeader === '上传' || listHeader === '上传限速') return 'list--upload';
    return '';
  };

  const positionMenu = () => {
    if (!open || !triggerAnchor || !menuElement) return;

    const rect = triggerAnchor.getBoundingClientRect();
    const pad = 8;
    const gap = 6;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mw = menuElement.offsetWidth || 220;
    const mh = menuElement.offsetHeight || 200;

    let left =
      align === 'end' ? rect.right - mw : rect.left;
    left = Math.max(pad, Math.min(left, vw - mw - pad));

    let top = rect.bottom + gap;
    if (top + mh > vh - pad) {
      top = rect.top - mh - gap;
    }
    top = Math.max(pad, Math.min(top, vh - mh - pad));

    menuStyle = `left:${left}px;top:${top}px;min-width:${Math.max(mw, rect.width)}px;`;
  };

  const handleDocumentClick = (event) => {
    if (!open) return;
    if (triggerAnchor?.contains(event.target)) return;
    if (menuElement?.contains(event.target)) return;
    open = false;
  };

  const handleWindowChange = () => {
    if (open) positionMenu();
  };

  $: if (open) {
    tick().then(() => {
      if (menuElement?.parentNode !== document.body) {
        document.body.appendChild(menuElement);
      }
      positionMenu();
    });
  }

  $: if (open) {
    document.addEventListener('click', handleDocumentClick, true);
    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);
  } else {
    document.removeEventListener('click', handleDocumentClick, true);
    window.removeEventListener('resize', handleWindowChange);
    window.removeEventListener('scroll', handleWindowChange, true);
  }

  onDestroy(() => {
    document.removeEventListener('click', handleDocumentClick, true);
    window.removeEventListener('resize', handleWindowChange);
    window.removeEventListener('scroll', handleWindowChange, true);
  });
</script>

<div class="wrapper">
  <div
    class="trigger-anchor"
    bind:this={triggerAnchor}
    role="button"
    tabindex="0"
    aria-expanded={open}
    aria-haspopup="menu"
    on:click|stopPropagation={toggleOpen.bind(null, false)}
    on:keydown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleOpen(false);
      }
    }}
  >
    <slot name="trigger" />
  </div>

  {#if open}
    <div
      bind:this={menuElement}
      class="menu menu--portal"
      style={menuStyle}
      role="menu"
      tabindex="-1"
      transition:fade={{ duration: 150 }}
      on:pointerdown|stopPropagation
    >
      <div class="menu-header">
        <span class="menu-title">{header}</span>
        <button
          type="button"
          class="menu-close"
          aria-label="关闭"
          on:click={() => (open = false)}
        >
          ×
        </button>
      </div>
      <div class="lists">
        {#each Object.entries(lists) as [listHeader, options] (listHeader)}
          <div class="list {listAccentClass(listHeader)}">
            <span class="list-header">{listHeader}</span>
            <ul>
              {#each options as option (option.name)}
                <li>
                  <button
                    type="button"
                    role="menuitemradio"
                    class="option"
                    class:selected={option.selected}
                    aria-checked={option.selected}
                    on:click={(event) => optionSelect(option, event)}
                  >
                    <span class="option-label">{option.name}</span>
                    {#if option.selected}
                      <span class="option-check" aria-hidden="true">✓</span>
                    {/if}
                  </button>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
      <div class="bottom">
        <slot name="bottom" />
      </div>
    </div>
  {/if}
</div>

<style>
  .wrapper {
    position: relative;
  }

  .trigger-anchor {
    cursor: pointer;
    display: block;
    outline: none;
    width: 100%;
  }

  .trigger-anchor:focus-visible {
    border-radius: 6px;
    box-shadow: 0 0 0 2px rgba(var(--rgb-lavender), 0.35);
  }

  .menu {
    background: var(--color-dropdown-menu-background);
    border: 1px solid var(--color-modal-menu-border);
    border-radius: var(--radius-md);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    color: var(--color-text);
    min-width: 220px;
  }

  .menu--portal {
    position: fixed;
    z-index: 200;
  }

  .menu-header {
    align-items: center;
    border-bottom: 1px solid var(--color-panel-border);
    display: flex;
    justify-content: space-between;
    padding: 10px 12px;
  }

  .menu-title {
    color: var(--color-modal-header);
    font-size: 13px;
    font-weight: 600;
  }

  .menu-close {
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--color-modal-text-light);
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    padding: 2px 6px;
  }

  .menu-close:hover {
    background: rgba(var(--rgb-surface1), 0.6);
    color: var(--color-modal-header);
  }

  .list-header {
    color: var(--color-dropdown-header);
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    padding: 0 12px 6px;
    text-transform: uppercase;
  }

  .list--download .list-header {
    color: var(--color-download);
  }

  .list--upload .list-header {
    color: var(--color-upload);
  }

  .bottom {
    border-top: 1px solid var(--color-panel-border);
  }

  .lists {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 8px;
  }

  .lists:has(.list:nth-child(2)) {
    flex-direction: row;
    gap: 4px;
    padding: 10px 8px;
  }

  .list {
    flex: 1;
    min-width: 0;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0;
  }

  .option {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--color-modal-text);
    cursor: pointer;
    display: flex;
    font-size: 13px;
    justify-content: space-between;
    padding: 6px 10px;
    text-align: left;
    transition:
      background-color 0.15s,
      color 0.15s;
    width: 100%;
  }

  .option:hover {
    background-color: rgba(var(--rgb-surface1), 0.65);
  }

  .option.selected {
    background: rgba(var(--rgb-mauve), 0.12);
    color: var(--color-modal-tab-label-active);
    font-weight: 600;
  }

  .list--download .option.selected {
    background: rgba(var(--rgb-green), 0.12);
    color: var(--color-download);
  }

  .list--upload .option.selected {
    background: rgba(var(--rgb-blue), 0.12);
    color: var(--color-upload);
  }

  .option-check {
    font-size: 12px;
    margin-left: 8px;
    opacity: 0.9;
  }
</style>
