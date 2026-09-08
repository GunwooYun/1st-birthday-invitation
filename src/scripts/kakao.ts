import { PUBLIC_KAKAO_JS_KEY } from 'astro:env/client';
import { copyText, showToast } from './clipboard';

const MAP_SDK_URL = 'https://dapi.kakao.com/v2/maps/sdk.js';
const SHARE_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.9/kakao.min.js';
const MAP_ZOOM_LEVEL = 3;

type KakaoMapsNamespace = {
  load: (callback: () => void) => void;
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (el: HTMLElement, options: { center: unknown; level: number }) => { setCenter: (pos: unknown) => void };
  Marker: new (options: { map: unknown; position: unknown }) => unknown;
  services: {
    Status: { OK: string };
    Places: new () => {
      keywordSearch: (keyword: string, callback: (result: { x: string; y: string }[], status: string) => void) => void;
    };
  };
};

type KakaoShareSdk = {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: {
    sendDefault: (options: Record<string, unknown>) => void;
  };
};

declare global {
  interface Window {
    kakao?: { maps: KakaoMapsNamespace };
    Kakao?: KakaoShareSdk;
  }
}

const scriptCache = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  const cached = scriptCache.get(src);
  if (cached) return cached;
  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
  scriptCache.set(src, promise);
  return promise;
}

export function isKakaoConfigured(): boolean {
  return Boolean(PUBLIC_KAKAO_JS_KEY);
}

export async function initKakaoMap(): Promise<void> {
  const container = document.querySelector<HTMLElement>('[data-kakao-map]');
  if (!container) return;
  if (!isKakaoConfigured()) {
    container.hidden = true;
    return;
  }
  const keyword = container.dataset.keyword ?? '';
  const fallbackLat = Number(container.dataset.lat);
  const fallbackLng = Number(container.dataset.lng);

  try {
    await loadScript(`${MAP_SDK_URL}?appkey=${PUBLIC_KAKAO_JS_KEY}&autoload=false&libraries=services`);
  } catch (error) {
    console.error(error);
    container.hidden = true;
    return;
  }
  const maps = window.kakao?.maps;
  if (!maps) {
    container.hidden = true;
    return;
  }

  maps.load(() => {
    const draw = (lat: number, lng: number) => {
      container.replaceChildren(); // drop the "loading" placeholder before the map renders
      const center = new maps.LatLng(lat, lng);
      const map = new maps.Map(container, { center, level: MAP_ZOOM_LEVEL });
      new maps.Marker({ map, position: center });
    };
    if (!keyword) {
      draw(fallbackLat, fallbackLng);
      return;
    }
    new maps.services.Places().keywordSearch(keyword, (result, status) => {
      const first = result[0];
      if (status === maps.services.Status.OK && first) {
        draw(Number(first.y), Number(first.x));
      } else {
        draw(fallbackLat, fallbackLng);
      }
    });
  });
}

export function initKakaoShare(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-kakao-share]');
  if (!button) return;
  if (!isKakaoConfigured()) {
    button.hidden = true;
    return;
  }
  const {
    title = '',
    description = '',
    image = '',
    url = window.location.href,
    buttonLabel = '초대장 보기',
  } = button.dataset;

  button.addEventListener('click', async () => {
    try {
      await loadScript(SHARE_SDK_URL);
      const sdk = window.Kakao;
      if (!sdk) throw new Error('Kakao SDK unavailable');
      if (!sdk.isInitialized()) sdk.init(PUBLIC_KAKAO_JS_KEY);
      sdk.Share.sendDefault({
        objectType: 'feed',
        content: {
          title,
          description,
          imageUrl: image,
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [{ title: buttonLabel, link: { mobileWebUrl: url, webUrl: url } }],
      });
    } catch (error) {
      console.error(error);
      showToast('카카오톡 공유를 열 수 없어요. 링크 복사를 이용해 주세요.');
    }
  });
}

export function initLinkCopy(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-copy-link]');
  if (!button) return;
  button.addEventListener('click', () => {
    void copyText(window.location.href, '초대장 링크가 복사되었어요');
  });
}
