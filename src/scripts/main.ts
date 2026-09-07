import { initCopyButtons } from './clipboard';
import { initCountdown } from './countdown';
import { initDoljabi } from './doljabi';
import { initGuestbook } from './guestbook';
import { initKakaoMap, initKakaoShare, initLinkCopy } from './kakao';
import { initReveal } from './reveal';

initReveal();
initCountdown();
initCopyButtons();
initKakaoShare();
initLinkCopy();
initGuestbook();
initDoljabi();
void initKakaoMap().catch((error) => console.error(error));
