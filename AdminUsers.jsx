import React, { useEffect, useState } from 'react'
import api from '../api'
export default function AdminUsers(){
  const [rows,setRows]=useState([]); const [role,setRole]=useState('USER'); const [sel,setSel]=useState(null);
  const load=async()=>{ const {data}=await api.get('/admin/users'); setRows(data.data) }
  useEffect(()=>{ load() },[])
  const changeRole=async(id)=>{ await api.patch('/admin/users/'+id+'/role',{ role }); await load(); setSel(null) }
  return (<div style={{padding:20}}><h4>Admin Users</h4>
    <table style={{width:'100%',borderCollapse:'collapse'}}><thead><tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
    <tbody>{rows.map(u=>(<tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
      <td><button onClick={()=>setSel(u._id)}>Ubah Role</button></td></tr>))}</tbody></table>
    {sel && (<div style={{marginTop:10,padding:10,border:'1px solid #ddd'}}><div style={{display:'flex',gap:10,alignItems:'center'}}>
      <div>Role baru:</div>
      <div><select value={role} onChange={e=>setRole(e.target.value)}>
        <option>USER</option><option>MANAGER</option><option>ADMIN</option></select></div>
      <div><button onClick={()=>changeRole(sel)}>Simpan</button></div>
      <div><button onClick={()=>setSel(null)}>Batal</button></div>
    </div></div>)}
  </div>)
}
