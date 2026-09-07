import { initCopyButtons } from './clipboard';
import { initCountdown } from './countdown';
import { initKakaoMap, initKakaoShare, initLinkCopy } from './kakao';
import { initReveal } from './reveal';

initReveal();
initCountdown();
initCopyButtons();
initKakaoShare();
initLinkCopy();
void initKakaoMap().catch((error) => console.error(error));
