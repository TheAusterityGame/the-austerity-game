const $$ = {
  clock: document.querySelector('#clock'),
  page1: document.querySelector('#page_1'),
  page2: document.querySelector('#page_2'),
  page3: document.querySelector('#page_3')
}

const state = {

}

function getTime ()
{
  const d = new Date()
  let s = d.getSeconds()
  if (String(s).length === 1) s = `0${s}`
  let m = d.getMinutes()
  if (String(m).length === 1) m = `0${m}`
  let h = d.getHours()
  if (String(h).length === 1) h = `0${h}`
  let randomMinutes = Math.floor(Math.random()*60)
  if (String(randomMinutes).length === 1) randomMinutes = `0${randomMinutes}`
  return {
    hhmmss: `${h}:${m}:${s}`,
    hhmm: `${h}:${m}`,
    randomised: `${h}:${randomMinutes}`
  }
}

function tick () {
  $$.clock.innerText = getTime().hhmmss;
  requestAnimationFrame(tick);
}

function pickRandomlyFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

requestAnimationFrame(tick);

function moveToPage(pageNumber) {
  $('.page').removeClass('active');
  $('#page_' + pageNumber).addClass('active');
  document.dispatchEvent(new CustomEvent('PAGE DISPLAYED', {detail: pageNumber} ))
}
