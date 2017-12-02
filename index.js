const $$ = {
  clock: document.querySelector('#clock'),
  page1: document.querySelector('#page_1'),
  page2: document.querySelector('#page_2'),
  page3: document.querySelector('#page_3')
}

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
