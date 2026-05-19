<script>
  import { slide } from 'svelte/transition';
  import { afterUpdate } from 'svelte';
  import { torrents, filters, selectedTorrents } from '~helpers/stores';
  import {
    labelFilter,
    statusFilter,
    trackerFilter,
    priorityFilter,
  } from '~helpers/filterHelper';
  import Icon from '~components/Icon';
  import Badge from '~components/Badge';

  const { labels, trackers } = torrents;

  const limitedLabelsCount = 3;
  const limitedTrackersCount = 4;
  let limitTrackers = true;
  let limitLabels = true;
  let previousLabelFiltersLength = 0;
  let previousTrackerFiltersLength = 0;

  $: statusFilters = [
    {
      label: '全部',
      value: null,
      iconName: 'All',
      count: $torrents.length,
    },
    {
      label: '活动',
      value: 'active',
      iconName: 'Active',
      count: $torrents.filter(statusFilter.bind(null, 'active')).length,
    },
    {
      label: '下载中',
      value: 'downloading',
      iconName: 'DownloadSmall',
      count: $torrents.filter(statusFilter.bind(null, 'downloading')).length,
    },
    {
      label: '已完成',
      value: 'complete',
      iconName: 'Completed',
      count: $torrents.filter(statusFilter.bind(null, 'complete')).length,
    },
    {
      label: '已停止',
      value: 'stopped',
      iconName: 'StopIcon',
      count: $torrents.filter(statusFilter.bind(null, 'stopped')).length,
    },
    {
      label: '校验中',
      value: 'checking',
      iconName: 'InformationIcon',
      count: $torrents.filter(statusFilter.bind(null, 'checking')).length,
    },
    {
      label: '做种中',
      value: 'seeding',
      iconName: 'SeedsIcon',
      count: $torrents.filter(statusFilter.bind(null, 'seeding')).length,
    },
    {
      label: '错误',
      value: 'error',
      iconName: 'ErrorIcon',
      count: $torrents.filter(statusFilter.bind(null, 'error')).length,
    },
  ];

  $: priorityFilters = [
    {
      label: '全部',
      value: null,
      count: $torrents.length,
    },
    {
      label: '高',
      value: 1,
      count: $torrents.filter(priorityFilter.bind(null, 1)).length,
    },
    {
      label: '普通',
      value: 0,
      count: $torrents.filter(priorityFilter.bind(null, 0)).length,
    },
    {
      label: '低',
      value: -1,
      count: $torrents.filter(priorityFilter.bind(null, -1)).length,
    },
  ];

  $: labelFilters = [
    {
      label: '全部',
      value: null,
      count: $torrents.length,
    },
    {
      label: '无标签',
      value: 'unlabeled',
      count: $torrents.filter(labelFilter.bind(null, 'unlabeled')).length,
    },
    ...$labels
      .map((label) => ({
        label,
        value: label,
        count: $torrents.filter(labelFilter.bind(null, label)).length,
      }))
      .slice(0, limitLabels ? limitedLabelsCount : $labels.length),
    $filters.label && {
      label: $filters.label,
      value: $filters.label,
      count: $torrents.filter(trackerFilter.bind(null, $filters.label)).length,
    },
  ]
    .filter(Boolean)
    .filter(
      (item, index, list) =>
        list.map((i) => i.value).indexOf(item.value) === index
    );

  $: trackerFilters = [
    {
      label: '全部',
      value: null,
      count: $torrents.length,
    },
    ...$trackers
      .map((tracker) => ({
        label: tracker,
        value: tracker,
        count: $torrents.filter(trackerFilter.bind(null, tracker)).length,
      }))
      .slice(0, limitTrackers ? limitedTrackersCount : $trackers.length),
    $filters.tracker && {
      label: $filters.tracker,
      value: $filters.tracker,
      count: $torrents.filter(trackerFilter.bind(null, $filters.tracker))
        .length,
    },
  ]
    .filter(Boolean)
    .filter(
      (item, index, list) =>
        list.map((i) => i.value).indexOf(item.value) === index
    );

  const setStatusFilter = (filter) => {
    selectedTorrents.clear();
    $filters.status = filter;
  };

  const setLabelFilter = (filter) => {
    selectedTorrents.clear();
    $filters.label = filter;
  };

  const setTrackerFilter = (filter) => {
    selectedTorrents.clear();
    $filters.tracker = filter;
  };

  const setPriorityFilter = (filter) => {
    selectedTorrents.clear();
    $filters.priority = filter;
  };

  afterUpdate(() => {
    previousLabelFiltersLength = labelFilters.length;
    previousTrackerFiltersLength = trackerFilters.length;
  });

  const getTransitionConfig = (
    direction,
    previousListLength,
    listLength,
    index
  ) => {
    const totalDuration = 250;
    let duration;
    let delay;

    if (direction === 'in') {
      const items_to_transition = listLength - previousListLength;
      duration = totalDuration / items_to_transition;
      delay = index * duration - previousListLength * duration;
    } else {
      const items_to_transition = previousListLength - listLength;
      duration = totalDuration / items_to_transition;
      delay =
        (items_to_transition - 1 - index) * duration + listLength * duration;
    }

    return { delay, duration };
  };
</script>

<div class="wrapper">
  <h2>按状态筛选</h2>
  <ul>
    {#each statusFilters as filter (filter.label)}
      <li>
        <button
          type="button"
          class="filter-item"
          class:active={$filters.status === filter.value}
          on:click={setStatusFilter.bind(null, filter.value)}
        >
          <Icon name={filter.iconName} />
          {filter.label}
          <Badge>{filter.count || 0}</Badge>
        </button>
      </li>
    {/each}
  </ul>

  <h2>按优先级筛选</h2>
  <ul>
    {#each priorityFilters as filter (filter.label)}
      <li>
        <button
          type="button"
          class="filter-item"
          class:active={$filters.priority === filter.value}
          on:click={setPriorityFilter.bind(null, filter.value)}
        >
          {filter.label}
          <Badge>{filter.count || 0}</Badge>
        </button>
      </li>
    {/each}
  </ul>

  <h2>按标签筛选</h2>
  <ul>
    {#each labelFilters as filter, index (filter.label)}
      <li
        in:slide={getTransitionConfig(
          'in',
          previousLabelFiltersLength,
          labelFilters.length,
          index
        )}
        out:slide={getTransitionConfig(
          'out',
          previousLabelFiltersLength,
          labelFilters.length,
          index
        )}
      >
        <button
          type="button"
          class="filter-item"
          class:active={$filters.label === filter.value}
          on:click={setLabelFilter.bind(null, filter.value)}
        >
          {filter.label}
          <Badge>{filter.count || 0}</Badge>
        </button>
      </li>
    {/each}
    {#if labelFilters.length > limitedLabelsCount}
      <li>
        <button
          type="button"
          class="filter-item filter-item--toggle"
          on:click={() => {
            limitLabels = !limitLabels;
          }}
        >
          {#if limitLabels}显示全部…{:else}收起部分…{/if}
        </button>
      </li>
    {/if}
  </ul>

  <h2>按 Tracker 筛选</h2>
  <ul>
    {#each trackerFilters as filter, index (filter.label)}
      <li
        in:slide={getTransitionConfig(
          'in',
          previousTrackerFiltersLength,
          trackerFilters.length,
          index
        )}
        out:slide={getTransitionConfig(
          'out',
          previousTrackerFiltersLength,
          trackerFilters.length,
          index
        )}
      >
        <button
          type="button"
          class="filter-item"
          class:active={$filters.tracker === filter.value}
          on:click={setTrackerFilter.bind(null, filter.value)}
        >
          {filter.label}
          <Badge>{filter.count || 0}</Badge>
        </button>
      </li>
    {/each}
    {#if trackerFilters.length > limitedTrackersCount}
      <li>
        <button
          type="button"
          class="filter-item filter-item--toggle"
          on:click={() => {
            limitTrackers = !limitTrackers;
          }}
        >
          {#if limitTrackers}显示全部…{:else}收起部分…{/if}
        </button>
      </li>
    {/if}
  </ul>
</div>

<style>
  .wrapper {
    margin: 30px 20px 0;
    color: var(--color-panel-text);
    fill: currentColor;
  }

  h2 {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    color: var(--color-panel-header);
  }

  ul {
    list-style: none;
    margin-bottom: 30px;
  }

  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .filter-item {
    align-items: center;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    display: flex;
    font: inherit;
    font-size: 13px;
    font-weight: 400;
    padding: 3px 0;
    text-align: left;
    transition:
      fill 0.25s,
      color 0.25s;
    width: 100%;
  }

  .filter-item:hover {
    color: var(--color-panel-hover);
  }

  .filter-item:hover > :global(.badge) {
    background-color: var(--color-panel-hover);
  }

  .filter-item.active {
    color: var(--color-panel-active);
    font-weight: 700;
  }

  .filter-item > :global(.icon) {
    height: 14px;
    margin-right: 7px;
  }

  .filter-item.active > :global(.badge) {
    background-color: var(--color-panel-active);
    color: var(--color-panel-badge-text);
  }

  .filter-item > :global(.badge) {
    background-color: var(--color-panel-badge-background);
    color: var(--color-panel-badge-text);
  }
</style>
