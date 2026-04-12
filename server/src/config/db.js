import mongoose from 'mongoose';
import dns from 'node:dns';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }
  mongoose.set('strictQuery', true);

  const opts = {
    serverSelectionTimeoutMS: 15_000,
  };

  // Optional: override DNS resolvers for restrictive networks (example: 8.8.8.8,1.1.1.1)
  if (process.env.MONGODB_DNS_SERVERS) {
    const servers = process.env.MONGODB_DNS_SERVERS.split(',').map((s) => s.trim()).filter(Boolean);
    if (servers.length > 0) {
      dns.setServers(servers);
      console.log(`Using custom DNS servers for MongoDB lookup: ${servers.join(', ')}`);
    }
  }

  // If you see querySrv ECONNREFUSED, forcing IPv4 can help in some networks.
  if (process.env.MONGODB_DNS_FAMILY === 'ipv4') {
    opts.family = 4;
  }

  const safeHost = uri.includes('@') ? uri.split('@')[1].split('/')[0] : 'unknown-host';
  console.log(`Connecting to MongoDB (${safeHost})...`);

  try {
    await mongoose.connect(uri, opts);
    console.log(`MongoDB connected (${safeHost})`);
  } catch (error) {
    console.error(`MongoDB connection failed (${safeHost}):`, error.message);
    if (error?.code === 'ECONNREFUSED' && error?.syscall === 'querySrv') {
      console.error('DNS SRV lookup failed. Try setting MONGODB_DNS_FAMILY=ipv4 and MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1 in .env');
      console.error('Alternative: use MongoDB Atlas "Standard connection string" (mongodb://...) instead of mongodb+srv://');
    }
    throw error;
  }
}
