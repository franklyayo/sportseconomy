const { Client } = require('pg');

const url = "postgresql://neondb_owner:npg_hoJud6Djva7P@ep-damp-breeze-avvcq12j.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require";
const client = new Client({ connectionString: url });

client.connect()
  .then(() => {
    console.log("Connected successfully with pg!");
    return client.query("SELECT 1 as result");
  })
  .then(res => {
    console.log(res.rows);
    client.end();
  })
  .catch(err => {
    console.error("Connection failed:", err);
    client.end();
  });
