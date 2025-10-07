import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
export default function Login(){
  const { login } = useContext(AuthContext); const nav = useNavigate();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const
[err,setErr]=useState(null);
  const onSubmit=async(e)=>{ e.preventDefault(); setErr(null); try{ await login(email,password);
nav('/'); }catch(e){ console.error(e); setErr('Login gagal'); } }
  return (<div style={{maxWidth:420,margin:'40px auto'}}>
    <h3 className="mb-3">Login</h3>{err && <div style={{color:'red'}}>{err}</div>}
    <form onSubmit={onSubmit} style={{display:'grid',gap:10}}>
      <div><label>Email</label><input style={{width:'100%'}} type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
      <div><label>Password</label><input style={{width:'100%'}} type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
      <button>Login</button>
    </form></div>);
}
