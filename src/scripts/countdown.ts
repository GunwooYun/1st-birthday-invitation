const MS_PER_DAY = 24 * 60 * 60 * 1000;
const KST_OFFSET_MINUTES = 9 * 60;

// Calendar-day difference in KST, so "D-1" flips at midnight Korea time regardless of the viewer's zone.
function kstDayIndex(date: Date): number {
  const shifted = date.getTime() + (KST_OFFSET_MINUTES + date.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(shifted / MS_PER_DAY);
}

export function formatDday(now: Date, eventStart: Date): string {
  const diff = kstDayIndex(eventStart) - kstDayIndex(now);
  if (diff === 0) return 'D-DAY';
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

export function initCountdown(): void {
  const el = document.querySelector<HTMLElement>('[data-dday]');
  if (!el) return;
  const eventStart = new Date(el.dataset.dday ?? '');
  if (Number.isNaN(eventStart.getTime())) return;

  const render = () => {
    el.textContent = formatDday(new Date(), eventStart);
  };
  render();
  window.setInterval(render, 60 * 1000);
}
