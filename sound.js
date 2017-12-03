// var x = document.getElementById("myAudio")

// pass in an HTML element
function playClip(clip)
{
  clip.play()
}

// pass in an HTML element
function pauseClip(clip)
{
  clip.pause()
}


// events
document.addEventListener('PAGE DISPLAYED', function(event)
{
  if (event.detail == 1) // first page
  {
    playClip(document.getElementById('news-theme'))
  }
  else if (event.detail == 3)
  {
    playClip(document.getElementById('you-lose'))
  }
})

document.addEventListener('TWEETED', function(event)
{
  var randomPop = 'pop-0' + Math.ceil(Math.random()*5)
  setTimeout(function()
  {
    console.log('play ' + randomPop)
    playClip(document.getElementById(randomPop))
  }, 900)
})

document.addEventListener('FUNDING WARNING', function(event)
{
  playClip(document.getElementById('alarm'))
})
