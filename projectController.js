const Project = require('../models/Project');
exports.list = async (req,res)=>{
  const rows = await Project.find({}).sort('-createdAt').lean();
  res.json({ data: rows });
};
exports.create = async (req,res)=>{
  const { name, description, price, quantity } = req.body;
  if(!name) return res.status(400).json({ error:{ message:'Name required' } });
  if(!['MANAGER','ADMIN'].includes(req.user.role)) return res.status(403).json({ error:{ message:'Forbidden' } });
  const p = await Project.create({ name, description, price: Number(price||0), quantity: Number(quantity||0), createdBy: req.user.sub });
  res.status(201).json({ data: p });
};
exports.update = async (req,res)=>{
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;
  if(!['MANAGER','ADMIN'].includes(req.user.role)) return res.status(403).json({ error:{ message:'Forbidden' } });
  const p = await Project.findByIdAndUpdate(id, { name, description, price: Number(price||0), quantity: Number(quantity||0) }, { new:true });
  if(!p) return res.status(404).json({ error:{ message:'Not found' } });
  res.json({ data: p });
};
exports.remove = async (req,res)=>{
  const { id } = req.params;
  if(!['MANAGER','ADMIN'].includes(req.user.role)) return res.status(403).json({ error:{ message:'Forbidden' } });
  await Project.findByIdAndDelete(id);
  res.json({ data: { ok:true } });
};
