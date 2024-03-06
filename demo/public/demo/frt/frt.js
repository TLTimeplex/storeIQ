// Author: Timeplex
import SIQ from '../../dist/index.mjs';

// HTML Components
const inputMaxOrders = document.getElementById('inputRuns');
const btnSetMaxOrdersInf = document.getElementById('btnSetRunsInf');

const inputMeasureAfterX = document.getElementById('inputAmount');

const enableOrderLog = document.getElementById('enableOrderLog');

const btnStartStop = document.getElementById('btnStartStop');
const enableRawData = document.getElementById('enableRawData');

const rawData = document.getElementById('rawData');
const rawDataTable = document.getElementById('rawDataTable');

const countRun = document.getElementById('countRun');
const resultAvgStoreIQ = document.getElementById('resultStorageIQ');
const resultAvgWebStorage = document.getElementById('resultWebstorage');
const resultAvgIndexedDB = document.getElementById('resultIndexDB');

// EVENTS
btnSetMaxOrdersInf?.addEventListener('click', () => {
  if (btnSetMaxOrdersInf.classList.contains('disabled')) {
    btnSetMaxOrdersInf.classList.remove('disabled');
    inputMaxOrders.disabled = true;
    btnSetMaxOrdersInf.classList.add('enabled');
  } else {
    btnSetMaxOrdersInf.classList.remove('enabled');
    inputMaxOrders.disabled = false;
    btnSetMaxOrdersInf.classList.add('disabled');
  }
});

enableRawData?.addEventListener('click', () => {
  if (enableRawData.checked) {
    rawData.classList.remove('hidden');
  } else {
    rawData.classList.add('hidden');
  }
});

btnStartStop?.addEventListener('click', () => {
  if (btnStartStop.classList.contains('disabled')) {
    stopTest = true;
    btnStartStop.classList.remove('disabled');
    btnStartStop.classList.add('enabled');
    btnStartStop.innerText = 'Start';
  } else {
    stopTest = false;
    btnStartStop.classList.remove('enabled');
    btnStartStop.classList.add('disabled');
    btnStartStop.innerText = 'Stop';
    startTest();
  }
});

countRun.addEventListener('click', async () => {
  countRun.innerText = "Reset...";
  countRun.style.backgroundColor = "red";
  await storeIQ.start();
  await reset();
  countRun.style.height = "4rem";
  countRun.innerText = "Reload Page!";
  countRun.style.backgroundColor = "green";
});

// @ts-check
// FUNCTIONS
var stopTest = false;
const storeIQ = new SIQ();

async function reset() {
  localStorage.clear();
  indexedDB.deleteDatabase('test');
  sessionStorage.clear();
  await storeIQ.delete();
}

async function startTest() {
  await storeIQ.start();
  storeIQ.onError = (error) => { console.error(error) };

  let run = 0;
  // Get user set settings
  let orders = inputMaxOrders.value;
  const infiniteOrders = btnSetMaxOrdersInf.classList.contains('enabled');
  const frequency = inputMeasureAfterX.value;

  let results = [];
  let avg = { storeIQ: 0, webStorage: 0, indexedDB: 0 };
  let carrySimulation = new Map();

  // Execute tests with data
  while (((orders--) > 0 || infiniteOrders) && !stopTest) { // Keep the brackets for easy reading
    // Generate random orders
    const { orders, simulation } = await generateOrders(frequency, carrySimulation);
    carrySimulation = simulation;
    countRun.innerText = run++ + 1;

    if (enableOrderLog.checked) {
      console.log(orders, simulation);
    }

    // Run tests
    const storeIQ = await testStoreIQ(orders);
    avg.storeIQ += storeIQ;
    const webStorage = await testWebStorage(orders);
    avg.webStorage += webStorage;
    const indexedDB = await testIndexedDB(orders);
    avg.indexedDB += indexedDB;

    // Update the results
    results.push({ storeIQ, webStorage, indexedDB });

    resultAvgStoreIQ.innerText = (avg.storeIQ / results.length).toFixed(2);
    resultAvgWebStorage.innerText = (avg.webStorage / results.length).toFixed(2);
    resultAvgIndexedDB.innerText = (avg.indexedDB / results.length).toFixed(2);

    // Add a row to the raw data table
    if (rawDataTable) {
      const row = rawDataTable.insertRow(-1);
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      cell1.innerText = run;
      cell2.innerText = storeIQ.toFixed(2);
      cell3.innerText = webStorage.toFixed(2);
      cell4.innerText = indexedDB.toFixed(2);
    }
  }

}

async function testStoreIQ(data) {
  const start = performance.now();

  for (let i = 0; i < data.length; i++) {
    const order = data[i];
    switch (order.type) {
      case 'set':
        storeIQ.setItem(`s_${order.key}`, order.value);
        break;
      case 'get':
        const result = await storeIQ.getItem(`s_${order.key}`);
        if (result !== order.expected) {
          console.error(`{${i}} Expected ${order.expected} but got ${result}`);
        }
        break;
      case 'delete':
        storeIQ.removeItem(`s_${order.key}`);
        break;
    }
  }

  const end = performance.now();

  return end - start;
}

async function testWebStorage(data) {

  const start = performance.now();

  for (let i = 0; i < data.length; i++) {
    const order = data[i];
    switch (order.type) {
      case 'set':
        localStorage.setItem(`w_${order.key}`, JSON.stringify(order.value));
        break;
      case 'get':
        const result = JSON.parse(localStorage.getItem(`w_${order.key}`));
        if (result != order.expected) {
          console.error(`{${i}} Expected ${order.expected} but got ${result}`);
        }
        break;
      case 'delete':
        localStorage.removeItem(`w_${order.key}`);
        break;
    }
  }

  const end = performance.now();

  return end - start;
}

async function testIndexedDB(data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('test', 1);

    request.onupgradeneeded = function () {
      const db = request.result;
      const store = db.createObjectStore('data');
    }

    request.onsuccess = function () {
      const db = request.result;
      const transaction = db.transaction('data', 'readwrite');
      const store = transaction.objectStore('data');

      const start = performance.now();
      executeIndexedDBOrder(data, store).then(() => {
        transaction.commit();
      });
      transaction.oncomplete = function () {
        const end = performance.now();
        db.close();
        resolve(end - start);
      }
    }
  });
}

/**
 * 
 * @param {*} orders 
 * @param {IDBObjectStore} store 
 */
async function executeIndexedDBOrder(orders, store) {
  var I = 0;
  for (const order of orders) {
    new Promise((resolve, reject) => {
      const i = I++;
      switch (order.type) {
        case 'set':
          var set = store.put(order.value, `i_${order.key}`);
          set.onsuccess = function () {
            resolve();
          }
          break;
        case 'get':
          const result = store.get(`i_${order.key}`);
          result.onsuccess = function () {
            if (result.result != order.expected && !(result.result === undefined && order.expected === null)) {
              console.error(`{${i}} Expected ${order.expected} but got ${result.result}`);
            }
            resolve();
          }
          break;
        case 'delete':
          const del = store.delete(`i_${order.key}`);
          del.onsuccess = function () {
            resolve();
          }
          break;
      }
    });
  }
}

async function generateOrders(amount, simulation = new Map()) {
  let orders = [];
  for (let i = 0; i < amount; i++) {
    let orderType = Math.random();
    // SET
    if (orderType < 0.5) {
      let key = Math.floor(Math.random() * 100);
      let value = generateData();
      orders.push({ type: 'set', key, value });
      simulation.set(key, value);
    }
    // GET
    else if (orderType < 0.8) {
      let key = Math.floor(Math.random() * 100);
      let expected = simulation.get(key);
      orders.push({ type: 'get', key, expected: expected || null });
    }
    // DELETE
    else {
      let key = Math.floor(Math.random() * 100);
      orders.push({ type: 'delete', key });
      simulation.delete(key);
    }
  }
  return { orders, simulation };
}

function generateData(depth = 0) {
  var typeOfData = Math.random();
  // String 40%
  if (typeOfData < 0.4) {
    var length = Math.floor(Math.random() * 1000);
    return generateString(length);
  }
  // Number 20%
  else if (typeOfData < 0.6) {
    return Math.random() * Number.MAX_SAFE_INTEGER;
  }
  // Object 20%
  else if (typeOfData < 0.8 || depth > 5) {
    var length = Math.floor(Math.random() * 100);
    return { data: generateString(length) };
  }
  // Array 20%
  else {
    var length = Math.floor(Math.random() * 5);
    return [...Array(length)].map(() => generateData(depth + 1));
  }

}

function generateString(size) { // Preventing += which leads to heavy memory leaks
  let letters = [...Array(size)];
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < size; i++)
    letters[i] = possible.charAt(Math.floor(Math.random() * possible.length));

  return letters.join('');
}