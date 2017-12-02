const $ = {
  'clock': document.querySelector('#clock')
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
