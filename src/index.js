import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread';

function init() {
  let worker = new Worker(new URL('./index.worker.js', import.meta.url));
  // This is only required because Safari doesn't support nested
  // workers. This installs a handler that will proxy creating web
  // workers through the main thread
  initBackend(worker);
  return worker
}
const worker = init();


window.myFunction = () =>{
  console.log('click');
  // call worker.index.js
  worker.postMessage("index.js");
}

worker.onmessage = (event) => {
  console.log(`Worker said :`, event.data );
};

