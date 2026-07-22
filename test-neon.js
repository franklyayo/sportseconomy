const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

// Prevent it from stripping -pooler (if such an option exists)
// Actually, let's try HTTP mode just to see if it connects!
const { neon } = require('@neondatabase/serverless');
const sql = neon("postgresql://neondb_owner:npg_hoJud6Djva7P@ep-damp-breeze-avvcq12j-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

sql`SELECT 1 as res`.then(res => console.log("HTTP Success:", res)).catch(console.error);

