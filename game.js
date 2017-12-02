// all the questions, loaded from the spreadsheet in database.js
var questions = null,
    questionsCount = 0

// very temporary
var departments =
{
  'Education':
  {
    popularity: 53, // popularity of the department head
    spending: 12 // current spending
  },
  'Transport':
  {
    popularity: 68,
    spending: 23
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
  displayQuestion(pickRandomQuestion())
  displayQuestion(pickRandomQuestion())
  displayQuestion(pickRandomQuestion())
})

function pickRandomQuestion()
{
  var question = questions[questionsCount]
  if (!question) console.error('we ran out of questions!')
  questionsCount ++
  return question
}

function displayQuestion(question)
{
  var template = '<div class="option" id="' + question.id + '"><div class="option_text">'
  template += question.label
  template += '</div><button class="yes">YAY</button><button class="no">NAY</button></div>'
  $('#options').append(template)

  $('#' + question.id + ' .yes').click(function()
  {
    updateDepartmentImpacts(question)
    replaceQuestion(question)
  })
  $('#' + question.id + ' .no').click(function()
  {
    replaceQuestion(question)
  })
}

function replaceQuestion(question)
{
  $('#' + question.id).remove()
  displayQuestion(pickRandomQuestion())
}

function updateDepartmentImpacts(question)
{
  console.log('updateDepartmentImpacts')
  console.log(question)

  // set the question as answered?
  question.answered = true

  // update the departments
  for(var i=0; i<question.impacts.lengths; i++)
  {
    var impact = question.impacts[i]
    var department = departments[impact.department]
    department.popularity += impact.popularity
    department.spending += impact.spending
  }
}
