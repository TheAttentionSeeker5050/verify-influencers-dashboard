import mongoose from 'mongoose';

// create a mongoose client connection singleton instance
let client: mongoose.Connection | null = null;

export default function getClient() {
  if (!client) {
    client = mongoose.createConnection('mongodb://localhost:27017/test', {
        
    });

  }
  return client;
}