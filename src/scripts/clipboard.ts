const TOAST_DURATION_MS = 1800;

let toastTimer: number | undefined;

export function showToast(message: string): void {
  let toast = document.querySelector<HTMLDivElement>('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast?.classList.remove('is-visible'), TOAST_DURATION_MS);
}

function legacyCopy(text: string): boolean {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  area.setSelectionRange(0, text.length);
  const ok = document.execCommand('copy');
  document.body.removeChild(area);
  return ok;
}

export async function copyText(text: string, successMessage = '복사되었습니다'): Promise<boolean> {
  let ok = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      ok = true;
    } else {
      ok = legacyCopy(text);
    }
  } catch {
    ok = legacyCopy(text);
  }
  showToast(ok ? successMessage : '복사에 실패했어요. 길게 눌러 복사해 주세요.');
  return ok;
}

// Wires every `[data-copy]` button: copies its `data-copy` value.
export function initCopyButtons(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-copy]').forEach((el) => {
    el.addEventListener('click', () => {
      const value = el.dataset.copy ?? '';
      const label = el.dataset.copyLabel ?? '복사되었습니다';
      void copyText(value, label);
    });
  });
}
