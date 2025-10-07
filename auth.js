export function getAuth(){ return { accessToken: localStorage.getItem('accessToken'), refreshToken:
localStorage.getItem('refreshToken') } }
export function setAuth(a,r){ localStorage.setItem('accessToken',a);
localStorage.setItem('refreshToken',r) }
export function clearAuth(){ localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken') }
export function parseJwt(t){ try{ return JSON.parse(atob(t.split('.')[1])) }catch{ return null } }
