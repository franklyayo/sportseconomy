const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const url = "postgresql://neondb_owner:npg_hoJud6Djva7P@ep-damp-breeze-avvcq12j-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({ connectionString: url });
pool.query('SELECT 1').then(res => {
  console.log("Success:", res.rows);
}).catch(err => {
  console.error("Error:", err);
});
