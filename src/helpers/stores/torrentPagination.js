import { get, writable } from 'svelte/store';
import { filters } from './filters';

const STORAGE_KEY = 'torrent-pagination';
export const DEFAULT_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || typeof stored.page !== 'number') {
      throw new Error('invalid');
    }
    const pageSize = PAGE_SIZE_OPTIONS.includes(stored.pageSize)
      ? stored.pageSize
      : DEFAULT_PAGE_SIZE;
    return { page: Math.max(1, stored.page), pageSize };
  } catch {
    return { page: 1, pageSize: DEFAULT_PAGE_SIZE };
  }
}

function persist(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createTorrentPaginationStore() {
  const { subscribe, update, set } = writable(loadState());

  const write = (fn) => {
    update((state) => {
      const next = fn(state);
      persist(next);
      return next;
    });
  };

  let lastFilterKey = JSON.stringify(get(filters));

  filters.subscribe(($filters) => {
    const filterKey = JSON.stringify($filters);
    if (filterKey === lastFilterKey) return;
    lastFilterKey = filterKey;
    write((state) => ({ ...state, page: 1 }));
  });

  return {
    subscribe,
    goToPage(page) {
      write((state) => ({
        ...state,
        page: Math.max(1, Math.floor(page) || 1),
      }));
    },
    setPageSize(pageSize) {
      if (!PAGE_SIZE_OPTIONS.includes(pageSize)) return;
      write((state) => ({ ...state, page: 1, pageSize }));
    },
    syncPage(page) {
      update((state) => {
        if (state.page === page) return state;
        const next = { ...state, page };
        persist(next);
        return next;
      });
    },
    reset() {
      set(loadState());
    },
  };
}

export const torrentPagination = createTorrentPaginationStore();
