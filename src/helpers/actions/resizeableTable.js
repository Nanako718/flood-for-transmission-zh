const RESIZING_CLASS = 'column-resizing';

function normalizeOptions(onChange) {
  if (typeof onChange === 'function') {
    return { onEnd: onChange };
  }
  return onChange ?? {};
}

export default function resizeableTable(handle, onChange) {
  const { onDrag, onEnd } = normalizeOptions(onChange);
  const column = handle.parentElement;
  const table = handle.closest('table');
  const columnId = column?.dataset?.columnId;
  let dragging = false;
  let handleStartX = 0;
  let columnStartWidth = 0;
  let tableStartWidth = 0;
  let rafId = null;
  let pendingDrag = null;

  const flushDrag = () => {
    rafId = null;
    if (!pendingDrag || !onDrag) return;
    onDrag(pendingDrag);
    pendingDrag = null;
  };

  const scheduleDrag = (detail) => {
    pendingDrag = detail;
    if (rafId !== null) return;
    rafId = requestAnimationFrame(flushDrag);
  };

  const handleMousedown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = true;
    handleStartX = e.pageX ?? e.touches[0].pageX;
    columnStartWidth = column.getBoundingClientRect().width;
    tableStartWidth = table.getBoundingClientRect().width;
    document.body.classList.add(RESIZING_CLASS);
  };

  const finishResize = () => {
    if (!dragging) return;

    document.body.classList.remove(RESIZING_CLASS);
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (pendingDrag && onDrag) {
      onDrag(pendingDrag);
      pendingDrag = null;
    }

    const columnWidth =
      pendingDrag?.columnWidth ?? column.getBoundingClientRect().width;
    onEnd?.(columnWidth);

    dragging = false;
  };

  const handleMousemove = (e) => {
    if (!dragging) return;

    e.preventDefault();
    const currentX = e.pageX ?? e.touches[0].pageX;
    const diffX = currentX - handleStartX;
    const columnWidth = Math.max(40, columnStartWidth + diffX);
    const tableWidth = tableStartWidth + (columnWidth - columnStartWidth);

    if (onDrag) {
      scheduleDrag({ columnId, columnWidth, tableWidth });
      return;
    }

    column.style.width = `${columnWidth}px`;
    table.style.width = `${tableWidth}px`;
  };

  handle.addEventListener('mousedown', handleMousedown);
  document.addEventListener('mouseup', finishResize);
  document.addEventListener('mousemove', handleMousemove);

  handle.addEventListener('touchstart', handleMousedown, { passive: false });
  document.addEventListener('touchend', finishResize);
  document.addEventListener('touchmove', handleMousemove, { passive: false });

  return {
    destroy() {
      document.body.classList.remove(RESIZING_CLASS);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      handle.removeEventListener('mousedown', handleMousedown);
      document.removeEventListener('mouseup', finishResize);
      document.removeEventListener('mousemove', handleMousemove);

      handle.removeEventListener('touchstart', handleMousedown);
      document.removeEventListener('touchend', finishResize);
      document.removeEventListener('touchmove', handleMousemove);
    },
  };
}
