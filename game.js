// all the questions, loaded from the spreadsheet in database.js
var questions = null,
    questionsCount = 0

// very temporary
var departments = {};

for (var i = 0; i < DEPARTMENTS.length; i++) {
  departments[DEPARTMENTS[i].name] = {
    popularity: 100,
    spending: 80
  };
}

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
    var department = departments[impact.department];
    department.popularity += impact.popularity;
    department.spending += impact.spending;
    
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

document.addEventListener('PAGE DISPLAYED', function(event) {
  if (event.detail == 2) {
    loadData(questionsUrl, 'QUESTIONS', parseQuestion);
  }
});