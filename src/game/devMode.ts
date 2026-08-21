export const isDeveloperRoute = import.meta.env.DEV && window.location.pathname.replace(/\/+$/, '') === '/dev';
