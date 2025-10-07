const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cfg = require('../config/jwt');

function signAccess(user){
  return jwt.sign({ sub: user._id.toString(), role: user.role, tokenVersion: user.tokenVersion },
cfg.accessSecret, { expiresIn: cfg.accessTtl });
}
function signRefresh(user){
  return jwt.sign({ sub: user._id.toString(), tokenVersion: user.tokenVersion }, cfg.refreshSecret,
{ expiresIn: cfg.refreshTtl });
}

exports.register = async (req,res)=>{
  const { name, email, password } = req.body;
  if(!name||!email||!password) return res.status(400).json({ error:{message:'Missing fields'} });
  const exists = await User.findOne({ email });
  if(exists) return res.status(409).json({ error:{message:'Email already used'} });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role:'USER' });
  res.status(201).json({ data:{ id: user._id } });
};
exports.login = async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(401).json({ error:{message:'Invalid credentials'} });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(401).json({ error:{message:'Invalid credentials'} });
  res.json({ data:{ accessToken: signAccess(user), refreshToken: signRefresh(user) } });
};
exports.refresh = async (req,res)=>{
  const { token } = req.body;
  if(!token) return res.status(400).json({ error:{message:'Missing token'} });
  try{
    const p = jwt.verify(token, cfg.refreshSecret);
    const u = await User.findById(p.sub);
    if(!u || u.tokenVersion !== p.tokenVersion) return res.status(401).json({
error:{message:'Revoked'} });
    res.json({ data:{ accessToken: signAccess(u), refreshToken: signRefresh(u) } });
  }catch(e){ res.status(401).json({ error:{message:'Invalid/Expired'} }) }
};
