import { getFirebase, isFirebaseConfigured, whenVisible } from './firebase';
import { showToast } from './clipboard';

const COLLECTION = 'guestbook';
const MAX_ENTRIES = 50;
const NAME_MAX = 20;
const MESSAGE_MAX = 200;

type Entry = { name: string; message: string; createdAt: Date | null };

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] ?? ch,
  );
}

function formatDate(date: Date | null): string {
  if (!date) return '';
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function renderEntries(list: HTMLElement, entries: Entry[]): void {
  if (entries.length === 0) {
    list.innerHTML = '<li class="guestbook__empty">첫 번째 축하 메시지를 남겨 주세요 🎈</li>';
    return;
  }
  list.innerHTML = entries
    .map(
      (entry) => `<li class="guestbook__item">
        <p class="guestbook__message">${escapeHtml(entry.message)}</p>
        <p class="guestbook__meta"><span>${escapeHtml(entry.name)}</span><time>${formatDate(entry.createdAt)}</time></p>
      </li>`,
    )
    .join('');
}

async function loadEntries(list: HTMLElement): Promise<void> {
  const { db } = await getFirebase();
  const { collection, getDocs, limit, orderBy, query } = await import('firebase/firestore/lite');
  const snapshot = await getDocs(query(collection(db, COLLECTION), orderBy('createdAt', 'desc'), limit(MAX_ENTRIES)));
  const entries: Entry[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      name: String(data.name ?? ''),
      message: String(data.message ?? ''),
      createdAt: data.createdAt?.toDate?.() ?? null,
    };
  });
  renderEntries(list, entries);
}

async function submitEntry(form: HTMLFormElement, list: HTMLElement): Promise<void> {
  const formData = new FormData(form);
  const name = String(formData.get('name') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  if (!name || !message) {
    showToast('이름과 메시지를 입력해 주세요');
    return;
  }
  if (name.length > NAME_MAX || message.length > MESSAGE_MAX) {
    showToast(`이름 ${NAME_MAX}자, 메시지 ${MESSAGE_MAX}자 이내로 적어 주세요`);
    return;
  }

  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (button) button.disabled = true;
  try {
    const { db, uid } = await getFirebase();
    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore/lite');
    await addDoc(collection(db, COLLECTION), { name, message, uid, createdAt: serverTimestamp() });
    form.reset();
    showToast('축하 메시지가 등록되었어요 💐');
    await loadEntries(list);
  } catch (error) {
    console.error(error);
    showToast('등록에 실패했어요. 잠시 후 다시 시도해 주세요.');
  } finally {
    if (button) button.disabled = false;
  }
}

export function initGuestbook(): void {
  const section = document.querySelector<HTMLElement>('[data-guestbook]');
  if (!section) return;
  if (!isFirebaseConfigured()) {
    section.hidden = true;
    return;
  }
  const form = section.querySelector<HTMLFormElement>('form');
  const list = section.querySelector<HTMLElement>('[data-guestbook-list]');
  if (!form || !list) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void submitEntry(form, list);
  });

  whenVisible(section, () => {
    loadEntries(list).catch((error) => {
      console.error(error);
      list.innerHTML = '<li class="guestbook__empty">메시지를 불러오지 못했어요.</li>';
    });
  });
}
