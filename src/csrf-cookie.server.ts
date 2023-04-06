// import { createCookieSessionStorage } from '@remix-run/node';
// import { generateCsrfToken } from 'auth0-remix-server';
// import { CSRF_TOKEN_KEY } from '~/csrfToken.server';
//
// const csrfCookieStorage = createCookieSessionStorage({
//   cookie: {
//     name: '__csrf-token',
//     httpOnly: true,
//     path: '/',
//     sameSite: false,
//     secrets: [process.env.CSRF_SESSION_SECRET || 'secret'],
//     secure: true
//   }
// });
//
// export const getCsrfCookieStorage = () => csrfCookieStorage;
//
// export const createCsrfCookie = async (request: Request, { refreshToken } = { refreshToken: false }): Promise<string> => {
//   const session = await csrfCookieStorage.getSession(request.headers.get('Cookie'));
//   console.log('[createCsrfCookie] session', session.data);
//   if (!session.has(CSRF_TOKEN_KEY) || refreshToken) {
//     if (!session.has(CSRF_TOKEN_KEY)) {
//       console.log('generating missing CSRF token');
//     }
//     if (refreshToken) {
//       console.log('refreshing with new CSRF token');
//     }
//     session.set(CSRF_TOKEN_KEY, generateCsrfToken());
//   }
//   return csrfCookieStorage.commitSession(session);
// };
//
// export const destroyCsrfCookie = async (request: Request): Promise<string> => {
//   const session = await csrfCookieStorage.getSession(request.headers.get('Cookie'));
//   return csrfCookieStorage.destroySession(session);
// };
// export const getCsrfToken = async (request: Request): Promise<undefined | string> => {
//   const cookieStr = request.headers.get('Cookie');
//   const session = await csrfCookieStorage.getSession(cookieStr);
//   return session.get<string>(CSRF_TOKEN_KEY);
// };
