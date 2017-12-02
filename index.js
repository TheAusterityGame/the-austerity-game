const $$ = {
  clock: document.querySelector('#clock'),
  page1: document.querySelector('#page_1'),
  page2: document.querySelector('#page_2'),
  page3: document.querySelector('#page_3')
}

const DEPARTMENTS = [
  { name: "Healthcare", vestedInterest: "a private hospital" },
  { name: "Education", vestedInterest: "a posh private school" },
  { name: "Housing", vestedInterest: "a real-estate company" },
  { name: "Transport", vestedInterest: "a private taxi fleet" },
  { name: "Sanitation", vestedInterest: "a company running an incinerator facility" },
  { name: "Recreation and Parklands", vestedInterest: "a popular fitness centre chain" },
  { name: "Museums and Libraries", vestedInterest: "a multiplex cinema" }
];

const state = {

}

function time () {
  const d = new Date()
  let s = d.getSeconds()
  if (String(s).length === 1) {
    s = `0${s}`
  }  
  return {
    hhmmss: `${d.getHours()}:${d.getMinutes()}:${s}`,
    hhmm: `${d.getHours()}:${d.getMinutes()}`
  };
}

function tick () {
  $$.clock.innerText = time().hhmmss;
  requestAnimationFrame(tick);
}

function pickRandomlyFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

requestAnimationFrame(tick);

$$.page2.className += ' active';
