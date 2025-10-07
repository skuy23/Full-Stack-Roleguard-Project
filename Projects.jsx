import React, { useEffect, useState, useContext } from 'react'
import api from '../api'
import { AuthContext } from '../AuthContext'

function Form({ initial, onCancel, onSave }){
  const [form, setForm] = useState(initial || { name:'', description:'', price:0, quantity:0 })
  useEffect(()=> setForm(initial || { name:'', description:'', price:0, quantity:0 }), [initial])
  return (<div style={{padding:10,border:'1px solid #ddd',background:'#fff'}} data-testid="project-form">
    <h5>{initial? 'Edit Project' : 'New Project'}</h5>
    <div style={{display:'grid',gap:8}}>
      <div><label>Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
      <div><label>Description</label><input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
      <div><label>Price</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})} /></div>
      <div><label>Quantity</label><input type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:Number(e.target.value)})} /></div>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={()=>onSave(form)}>{initial? 'Save' : 'Create'}</button>
      </div>
    </div>
  </div>)
}

export default function Projects(){
  const [rows,setRows]=useState([])
  const [loading,setLoading]=useState(false)
  const [editing,setEditing]=useState(null)
  const [showForm,setShowForm]=useState(false)
  const { user } = useContext(AuthContext)

  const load = async ()=>{
    setLoading(true)
    try{ const { data } = await api.get('/projects'); setRows(data.data || []) }catch(e){ console.error(e) }
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  const create = async (payload)=>{
    await api.post('/projects', payload)
    setShowForm(false); load()
  }
  const update = async (payload)=>{
    await api.patch('/projects/'+editing._id, payload)
    setEditing(null); setShowForm(false); load()
  }
  const remove = async (id)=>{
    if(!confirm('Hapus project ini?')) return;
    await api.delete('/projects/'+id); load()
  }

  return (<div style={{padding:10}}>
    <h4>Projects</h4>
    {user && (user.role==='MANAGER' || user.role==='ADMIN') && <div style={{marginBottom:10}}>
      <button onClick={()=>{ setEditing(null); setShowForm(true); }}>Tambah Project</button>
    </div>}
    {loading ? <div>Loading...</div> : (
      <table className="table" style={{width:'100%'}}>
        <thead><tr><th>Name</th><th>Description</th><th>Price</th><th>Quantity</th><th>Created</th><th></th></tr></thead>
        <tbody>
          {rows.map(r=>(<tr key={r._id}>
            <td>{r.name}</td>
            <td>{r.description}</td>
            <td>{r.price}</td>
            <td>{r.quantity}</td>
            <td>{new Date(r.createdAt).toLocaleString()}</td>
            <td>
              {(user?.role==='MANAGER' || user?.role==='ADMIN') && <>
                <button onClick={()=>{ setEditing(r); setShowForm(true); }}>Edit</button>
                <button onClick={()=>remove(r._id)}>Hapus</button>
              </>}
            </td>
          </tr>))}
        </tbody>
      </table>
    )}
    {showForm && <div style={{position:'fixed',left:0,top:0,width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <Form initial={editing} onCancel={()=>{ setShowForm(false); setEditing(null) }} onSave={async (data)=>{
        try{
          if(editing) await update(data); else await create(data);
        }catch(e){ alert('Error: '+(e?.response?.data?.error?.message || e.message)) }
      }} />
    </div>}
  </div>)
}
