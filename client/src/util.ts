import * as UAParser from 'ua-parser-js';

const ua = navigator.userAgent;
const result = new UAParser(ua).getResult();
const isMobile = result.device.type === 'mobile';
const isTablet = result.device.type === 'tablet';

export const isDesktop = () => !isMobile && !isTablet;

export const deleteCookie = (name: string) => (document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;');
