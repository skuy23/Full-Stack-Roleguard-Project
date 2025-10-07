const r = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
r.use(auth, async (req,res,next)=>{
  if(req.user.role !== 'ADMIN') return res.status(403).json({ error:{ message:'Forbidden' }});
  next();
});
r.get('/users', async (req,res)=>{
  const users = await User.find({}).select('name email role createdAt').lean();
  res.json({ data: users });
});
r.patch('/users/:id/role', async (req,res)=>{
  const { role } = req.body;
  if(!['USER','MANAGER','ADMIN'].includes(role)) return res.status(400).json({ error:{message:'Invalid role'} });
  const u = await User.findByIdAndUpdate(req.params.id, { role }, { new:true });
  res.json({ data: { id: u._id, role: u.role } });
});
module.exports = r;
