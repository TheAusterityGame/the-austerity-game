const GAME_PERIOD = 2000; // 2 seconds
const INITIAL_EXTRA_FUNDING = 100; // + the initial spending = initial funding
const FUNDING_LOSS_PER_GAME_PERIOD = 1;
const INITIAL_CONSENSUS = 70;
const MIN_CONSENSUS = 20; // below this, the players are toppled


var totalSpending = 0;
var totalPopularity = 0;
var funding = INITIAL_EXTRA_FUNDING;
var duration = 0;

// all the questions, loaded from the spreadsheet in database.js
var questions = null,
    questionsCount = 0

var nameToDepartment = {};

function pickRandomQuestion()
{
  var question = questions[questionsCount]
  if (!question) console.error('we ran out of questions!')
  questionsCount ++
  return question
}

function displayQuestion(question, slotId)
{
  var template = '<div class="option fadein" id="' + question.id + '"><div class="option_text">';
  template += question.label;
  template += '</div><button class="yes">YAY</button><button class="no">NAY</button></div>';
  $('#options #' + slotId).append(template);

  $('#' + question.id + ' .yes').click(function()
  {
    updateDepartmentImpacts(question);
    replaceQuestion(question);
  })
  $('#' + question.id + ' .no').click(function()
  {
    replaceQuestion(question);
  })

  const BOX_MIN_BRIGHTNESS = 128;
  var colorR = 256 + Math.floor((Math.random() * BOX_MIN_BRIGHTNESS)) - BOX_MIN_BRIGHTNESS;
  var colorG = 256 + Math.floor((Math.random() * BOX_MIN_BRIGHTNESS)) - BOX_MIN_BRIGHTNESS;
  var colorB = 256 + Math.floor((Math.random() * BOX_MIN_BRIGHTNESS)) - BOX_MIN_BRIGHTNESS;
  $('#' + question.id).css("background-color", "rgb(" + colorR + "," + colorG + "," + colorB + ")");
}

function replaceQuestion(question)
{
  var questionBox = $('#' + question.id);
  var slotId = questionBox.parent().attr('id');
  questionBox.remove();
  displayQuestion(pickRandomQuestion(), slotId);
}

function updateDepartmentImpacts(question)
{
  console.log('updateDepartmentImpacts')
  console.log(question)

  // set the question as answered?
  question.answered = true

  // update the departments
  for(var i=0; i<question.impacts.length; i++)
  {
    var impact = question.impacts[i];    
    if (impact.department in nameToDepartment) {
      var department = nameToDepartment[impact.department];
      department.popularity += impact.popularity;    
      department.spending += impact.spending;
    } else {      
      console.error(impact.department + " does NOT exist");
    }    
  }
}

// when questions are loaded from the spreadsheet, display 3 random ones
document.addEventListener('QUESTIONS LOADED', function(event)
{
  console.log('QUESTIONS LOADED')

  // populate the questions array with the event's detail object
  questions = event.detail

  // display 3 random questions
  questions.shuffle()
  for (var slotIndex = 1; slotIndex <= 3; slotIndex++) {
    displayQuestion(pickRandomQuestion(), 'slot_' + slotIndex);
  }
})

function gameLoop() {
  totalSpending = 0;
  totalPopularity = 0;
  for (var i = 0; i < departments.length; i++) {
    var department = departments[i];
    $(department.bar).css('height', department.spending + '%');
    totalSpending += department.spending;
    totalPopularity += department.popularity;    
  }  
  duration += 1;
  funding -= FUNDING_LOSS_PER_GAME_PERIOD;
  totalPopularity /= departments.length;
  $('#status .budget').html(totalSpending);
  $('#status .funding').html(funding);
  $('#status').fadeIn();
  $('#score .duration').html(duration);
  $('#score .consensus').html(parseInt(totalPopularity));
  $('#score').fadeIn();
}

document.addEventListener('PAGE DISPLAYED', function(event) {
  if (event.detail == 2) {
    $('#status').hide();
    $('#score').hide();
    loadData(questionsUrl, 'QUESTIONS', parseQuestion);
    
    for (var i = 0; i < departments.length; i++) {
      var department = departments[i];
      department.popularity = INITIAL_CONSENSUS;
      department.spending = 100;
      funding += department.spending;
      nameToDepartment[department.name] = department;
      
      department.bar = $('.chart_bar.template').clone().appendTo('#chart').removeClass('template')
        .data('department', department.name);      
      $('.chart_bar_icon.template').clone().appendTo('#chart_x').removeClass('template')
        .find('.abbreviation').html(department.abbreviation);
    }
    $('.chart_bar.template').remove();
    $('.chart_bar_icon.template').remove();
    
    var gameLoopId = setInterval(gameLoop, GAME_PERIOD);
    document.addEventListener('PAGE DISPLAYED', function(event) {
      if (event.detail != 2) {
          clearInterval(gameLoopId);
      }
  });
  }
});