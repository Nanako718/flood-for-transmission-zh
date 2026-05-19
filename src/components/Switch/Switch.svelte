<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let checked;
  export let ariaLabel = '开关';

  const handleClick = () => {
    checked = !checked;
    dispatch('change', checked);
  };
</script>

<button
  type="button"
  role="switch"
  class="switch"
  class:checked={checked}
  aria-checked={checked}
  aria-label={ariaLabel || undefined}
  on:click={handleClick}
></button>

<style>
  .switch {
    background-color: var(--color-switch-inactive);
    border: none;
    padding: 0;
    width: 32px;
    height: 20px;
    border-radius: 10px;
    position: relative;
    margin: 0;
    padding: 0;
    border: 0;
    transition: background-color 0.3s cubic-bezier(0.35, 0, 0.25, 1);
    cursor: pointer;
    outline: none;
    flex-shrink: 0;
  }

  .switch::after {
    content: '';
    height: 14px;
    width: 14px;
    position: absolute;
    left: 3px;
    top: 3px;
    border-radius: 50%;
    background-color: var(--color-switch-handle);
    transition: transform 0.3s cubic-bezier(0.35, 0, 0.25, 1);
    transform: 0;
  }

  .checked {
    background-color: var(--color-switch-active);
  }

  .checked::after {
    transform: translateX(12px);
  }
</style>
