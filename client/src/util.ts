import * as UAParser from 'ua-parser-js';

const ua = navigator.userAgent;
const result = new UAParser(ua).getResult();
const isMobile = result.device.type === 'mobile';
const isTablet = result.device.type === 'tablet';

export const isDesktop = () => !isMobile && !isTablet;
