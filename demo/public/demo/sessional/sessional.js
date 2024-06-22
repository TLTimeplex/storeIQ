// Author: Timeplex
import SIQ from '../../dist/index.mjs';

// HTML Components
const sessionID = document.getElementById('sessionID');

const stringInput = document.getElementById('stringInput');
const btnStringSave = document.getElementById('stringSave');

const numberInput = document.getElementById('numberInput');
const btnNumberSave = document.getElementById('numberSave');

const objectInput = document.getElementById('objectInput');
const btnObjectSave = document.getElementById('objectSave');
const objectPreview = document.getElementById('objectPreview');
const btnObjectDownload = document.getElementById('objectDownload');

// @ts-check
// FUNCTIONS
const instance = new SIQ({});

await instance.start();

// This is just a showcase. The sessionID has no real use for a dev outside of the SIQ library.
sessionID.innerText = "Session ID: " + instance.instanceData.SessionID;

// STRING
btnStringSave.addEventListener('click', async () => {
  await instance.setItem('string', stringInput.value, { sessional: true });
  btnStringSave.innerText = "Saved";
});

var string = await instance.getItem('string');
if (string) {
  stringInput.value = string;
}

// NUMBER
btnNumberSave.addEventListener('click', async () => {
  await instance.setItem('number', numberInput.value, { sessional: true });
  btnNumberSave.innerText = "Saved";
});

var number = await instance.getItem('number');
if (number) {
  numberInput.value = number;
}

// OBJECT
btnObjectSave.addEventListener('click', async () => {
  // Serialize the file input
  const file = objectInput.files[0];
  const reader = new FileReader();

  reader.onload = async function (e) {
    const object = { content: e.target.result, name: file.name, type: file.type };
    await instance.setItem('object', object, { sessional: true });
    btnObjectSave.innerText = "Saved";
    objectPreview.src = reader.result;
  }

  reader.readAsText(file);
});

var object = await instance.getItem('object');
if (object) {
  const file = new Blob([object.content], { type: object.type });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = object.name;

  btnObjectDownload.addEventListener('click', () => {
    link.click();
  });

  objectPreview.src = url;
}

