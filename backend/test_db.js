import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const uri = process.env.MONGO_URI;
console.log('Testing connection to DB...');

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('✅ Connection successful!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Connection failed!');
        console.error('Error Code:', err.code);
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        process.exit(1);
    });
