import React, { createContext, useState, useEffect, useMemo } from 'react'
import api from './api'; import { setAuth, clearAuth, getAuth, parseJwt } from './auth'
export const AuthContext = createContext(null);
export default function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAuth(data.data.accessToken, data.data.refreshToken);
    const payload = parseJwt(data.data.accessToken);
    setUser({ id: payload.sub, role: payload.role });
  };
  const logout = ()=>{ clearAuth(); setUser(null); }
  useEffect(()=>{
    const { accessToken } = getAuth(); if(accessToken){ const p = parseJwt(accessToken); if(p)
setUser({ id:p.sub, role:p.role }) }
  }, []);
  const value = useMemo(()=>({ user, login, logout }),[user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
