import { getFirebase, isFirebaseConfigured, whenVisible } from './firebase';
import { showToast } from './clipboard';

const COLLECTION = 'doljabi_votes';
const MAX_VOTES_READ = 1000;
const STORAGE_KEY = 'doljabi-vote';

type Counts = Record<string, number>;

function readLocalVote(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeLocalVote(itemId: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, itemId);
  } catch {
    // Storage may be unavailable in private mode; the server-side uid check still prevents double votes.
  }
}

function renderResults(section: HTMLElement, counts: Counts, myVote: string | null): void {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  section.querySelectorAll<HTMLElement>('li[data-doljabi-item]').forEach((item) => {
    const id = item.dataset.doljabiItem ?? '';
    const count = counts[id] ?? 0;
    const percent = total === 0 ? 0 : Math.round((count / total) * 100);
    const bar = item.querySelector<HTMLElement>('[data-bar]');
    const label = item.querySelector<HTMLElement>('[data-percent]');
    if (bar) bar.style.width = `${percent}%`;
    if (label) label.textContent = `${percent}% (${count}표)`;
    item.classList.toggle('is-mine', id === myVote);
  });
  const totalEl = section.querySelector<HTMLElement>('[data-total]');
  if (totalEl) totalEl.textContent = `${total}명 참여`;
  section.classList.add('has-results');
}

function setVoted(section: HTMLElement, voted: boolean): void {
  section.querySelectorAll<HTMLButtonElement>('button[data-doljabi-item]').forEach((button) => {
    button.disabled = voted;
  });
}

async function loadCounts(): Promise<Counts> {
  const { db } = await getFirebase();
  const { collection, getDocs, limit, query } = await import('firebase/firestore/lite');
  const snapshot = await getDocs(query(collection(db, COLLECTION), limit(MAX_VOTES_READ)));
  const counts: Counts = {};
  snapshot.forEach((doc) => {
    const item = String(doc.data().item ?? '');
    counts[item] = (counts[item] ?? 0) + 1;
  });
  return counts;
}

async function castVote(section: HTMLElement, itemId: string): Promise<void> {
  setVoted(section, true);
  try {
    const { db, uid } = await getFirebase();
    const { doc, serverTimestamp, setDoc } = await import('firebase/firestore/lite');
    // Document id = anonymous uid → one vote per browser session; rules forbid updates.
    await setDoc(doc(db, COLLECTION, uid), { item: itemId, createdAt: serverTimestamp() });
    writeLocalVote(itemId);
    showToast('투표 완료! 결과를 확인해 보세요 🎉');
    renderResults(section, await loadCounts(), itemId);
  } catch (error) {
    console.error(error);
    const alreadyVoted = (error as { code?: string }).code === 'permission-denied';
    showToast(alreadyVoted ? '이미 투표하셨어요' : '투표에 실패했어요. 잠시 후 다시 시도해 주세요.');
    if (!alreadyVoted) setVoted(section, false);
  }
}

export function initDoljabi(): void {
  const section = document.querySelector<HTMLElement>('[data-doljabi]');
  if (!section) return;
  if (!isFirebaseConfigured()) {
    section.hidden = true;
    return;
  }

  const myVote = readLocalVote();
  if (myVote) setVoted(section, true);

  section.querySelectorAll<HTMLButtonElement>('button[data-doljabi-item]').forEach((button) => {
    button.addEventListener('click', () => {
      const itemId = button.dataset.doljabiItem;
      if (itemId) void castVote(section, itemId);
    });
  });

  whenVisible(section, () => {
    loadCounts()
      .then((counts) => {
        if (myVote) renderResults(section, counts, myVote);
      })
      .catch((error) => console.error(error));
  });
}
