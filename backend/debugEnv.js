import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env with support for quoted multi-line values
const raw = readFileSync(resolve(__dirname, '.env'), 'utf-8');
// Match KEY="...multi-line..." or KEY=single-line
const envRegex = /^([A-Z_][A-Z0-9_]*)=("[\s\S]*?(?<!\\)"|[^\n]*)/gm;
let m;
while ((m = envRegex.exec(raw)) !== null) {
  const key = m[1];
  let val = m[2];
  if (val.startsWith('"') && val.endsWith('"')) {
    val = val.slice(1, -1);
  }
  val = val.replace(/\\n/g, '\n');
  process.env[key] = val;
}

console.log('PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('DB_URL:', process.env.FIREBASE_DATABASE_URL);
console.log('KEY_START:', (process.env.FIREBASE_PRIVATE_KEY || '').slice(0, 60));
