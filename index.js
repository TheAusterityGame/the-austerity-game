const $ = {
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
  return `${d.getHours()}:${d.getMinutes()}:${s}`
}

function tick () {
  $.clock.innerText = time()
  requestAnimationFrame(tick)
}

requestAnimationFrame(tick)

$.page1.className += ' active';
