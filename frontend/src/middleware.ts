import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // skip i18n routing for next internals, files, the /api proxy, and the /admin app
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
};
