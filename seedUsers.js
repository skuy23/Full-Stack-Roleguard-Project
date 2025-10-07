require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack_roleguard';

async function ensureUser(name, email, password, role){
  const found = await User.findOne({ email });
  if(found){ console.log(`${email} already exists`); return; }
  const hash = await bcrypt.hash(password, 10);
  await User.create({ name, email, passwordHash: hash, role });
  console.log(`Created ${role}: ${email} / ${password}`);
}

async function main(){
  await mongoose.connect(uri);
  await ensureUser('Administrator', 'admin@example.com', 'Admin123!', 'ADMIN');
  await ensureUser('Manager', 'manager@example.com', 'Manager123!', 'MANAGER');
  await ensureUser('Regular User', 'user@example.com', 'User123!', 'USER');
  console.log('✅ Seed complete');
  process.exit(0);
}

main().catch(e=>{ console.error(e); process.exit(1); });
