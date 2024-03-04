// Author: Timeplex
import SIQ from '../../dist/index.mjs';

// HTML Components
const inputRuns = document.getElementById('inputRuns');
const btnSetRunsInf = document.getElementById('btnSetRunsInf');

const inputAmount = document.getElementById('inputAmount');

const btnStartStop = document.getElementById('btnStartStop');
const enableRawData = document.getElementById('enableRawData');

const rawData = document.getElementById('rawData');
const rawDataTable = document.getElementById('rawDataTable');


const countRun = document.getElementById('countRun');
const resultAvgStoreIQ = document.getElementById('resultStorageIQ');
const resultAvgWebStorage = document.getElementById('resultWebstorage');
const resultAvgIndexedDB = document.getElementById('resultIndexDB');

// EVENTS
btnSetRunsInf?.addEventListener('click', () => {
  if (btnSetRunsInf.classList.contains('disabled')) {
    btnSetRunsInf.classList.remove('disabled');
    inputRuns.disabled = true;
    btnSetRunsInf.classList.add('enabled');
  } else {
    btnSetRunsInf.classList.remove('enabled');
    inputRuns.disabled = false;
    btnSetRunsInf.classList.add('disabled');
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

// @ts-check
// FUNCTIONS
var stopTest = false;
const storeIQ = new SIQ();

async function startTest() {
  await storeIQ.start();
  storeIQ.onError = (error) => { console.error(error) };

  let run = 0;
  // Get user set settings
  let runs = inputRuns.value;
  const infiniteRuns = btnSetRunsInf.classList.contains('enabled');
  const amount = inputAmount.value;

  let results = [];
  let avg = { storeIQ: 0, webStorage: 0, indexedDB: 0 };

  // Generate random data
  const data = await generateData(amount);
  // INIT ALL STORAGES
  {
    localStorage.clear();
    // SIQ
    let promises = [];
    for (let i = 0; i < data.length; i++) {
      promises.push(storeIQ.setItem(`s_${i}`, data[i]));
    }
    await Promise.all(promises);
    await storeIQ.clear(); // Make it fair

    // WebStorage
    for (let i = 0; i < data.length; i++) {
      localStorage.setItem(`w_${i}`, data[i]);
    }

    // IndexedDB
    const request = indexedDB.open('test', 1);
    request.onupgradeneeded = function () {
      const db = request.result;
      const store = db.createObjectStore('data');
    }
    request.onsuccess = function () {
      const db = request.result;
      const transaction = db.transaction('data', 'readwrite');
      const store = transaction.objectStore('data');
      for (let i = 0; i < data.length; i++) {
        store.put(data[i], `i_${i}`);
      }
      transaction.oncomplete = function () {
        db.close();
      }
    }
  }

  // Execute tests with data
  while (((runs--) > 0 || infiniteRuns) && !stopTest) { // Keep the brackets for easy reading
    countRun.innerText = run++ + 1;

    // Run tests
    const storeIQ = await testStoreIQ(data);
    avg.storeIQ += storeIQ;
    const webStorage = await testWebStorage(data);
    avg.webStorage += webStorage;
    const indexedDB = await testIndexedDB(data);
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
  let promises = [];
  const start = performance.now();
  for (let i = 0; i < data.length; i++) {
    promises.push(storeIQ.getItem(`s_${i}`));
  }
  await Promise.all(promises);
  const end = performance.now();

  //await storeIQ.delete(); // TODO: find out why this is only working once
  return end - start;
}

async function testWebStorage(data) {
  localStorage.clear();

  const start = performance.now();
  for (let i = 0; i < data.length; i++) {
    localStorage.getItem(`w_${i}`);
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
      for (let i = 0; i < data.length; i++) {
        store.get(`i_${i}`);
      }
      transaction.oncomplete = function () {
        const end = performance.now();
        db.close();
        resolve(end - start);
        // Clear indexedDB
        const deleteRequest = indexedDB.deleteDatabase('test');
        deleteRequest.onsuccess = function () {
          console.log('Deleted database successfully');
        };
      }
    }
  });
}

async function generateData(amount) {
  let data = [];
  for (let i = 0; i < amount; i++) {
    data[i] = generateString(1_000_000 / amount);
  }
  return data;
}

function generateString(size) { // Preventing += which leads to heavy memory leaks
  let letters = [...Array(size)];
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < size; i++)
    letters[i] = possible.charAt(Math.floor(Math.random() * possible.length));

  return letters.join('');
}