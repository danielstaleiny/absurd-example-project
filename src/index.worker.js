import initSqlJs from '@jlongster/sql.js';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';

// need singleton pattern
let DBconnection = undefined
// initially run runQueries

async function init(st) {
  if(DBconnection) {
    console.log('Returned already loaded Connection ', st);
    return DBconnection
  }
  console.log('Connecting to DB');
  let SQL = await initSqlJs({ locateFile: file => file });
  let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
  SQL.register_for_idb(sqlFS);

  SQL.FS.mkdir('/sql');
  SQL.FS.mount(sqlFS, {}, '/sql');

  let db = new SQL.Database('/sql/db.sqlite', { filename: true });
  db.exec(`
    PRAGMA page_size=8192;
    PRAGMA journal_mode=MEMORY;
  `);

  DBconnection = db
  return db;
}

async function runQueries() {
  let db = await init("a");

  try {
    // db.exec('CREATE TABLE kv (key TEXT PRIMARY KEY, value TEXT)');
    db.exec('CREATE TABLE vvv (key TEXT PRIMARY KEY, value TEXT)');
  } catch (e) {console.log(e)}
  var stmt = db.prepare("SELECT * FROM vvv");
  while (stmt.step()) console.log(stmt.getAsObject());
  stmt.free();
}
runQueries();




onmessage = async (event) => {
  const db = await init('onmessage')
  const now = Date.now()
  console.log(parseInt(now));
  db.run(
        "INSERT OR REPLACE INTO vvv VALUES (:key, :value)",
    { ':key' : `${now}`, ':value' : event.data+'--' }
    );

  // const stmt = db.prepare(`SELECT * FROM vvv`);
  // stmt.step();
  // console.log('Result:', stmt.getAsObject());
  // stmt.free();
  // let stmt = db.prepare('INSERT OR REPLACE INTO vvv (key, value) VALUES (?, ?)');
  // const now = Date.now()
  // console.log(now);
  // stmt.run([1, "what"]);

  // const stmt2 = db.prepare(`SELECT * FROM vvv`);
  // stmt2.step();
  // console.log('Result:', stmt.getAsObject());
  // stmt2.free();

  // call back index.js
  // postMessage(`Hi, ${event.data}`);
};

