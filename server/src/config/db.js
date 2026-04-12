import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);

  const opts = {
    serverSelectionTimeoutMS: 15_000,
  };
  // If you see querySrv ECONNREFUSED on Windows/networks with flaky SRV DNS, set MONGODB_DNS_FAMILY=ipv4 in .env
  if (process.env.MONGODB_DNS_FAMILY === 'ipv4') {
    opts.family = 4;
  }

  await mongoose.connect(uri, opts);
  console.log('MongoDB connected');
}
