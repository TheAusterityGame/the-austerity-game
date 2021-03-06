const GAME_PERIOD = 1000; // 1 second
const INITIAL_EXTRA_FUNDING = 100; // + the initial spending = initial funding
const FUNDING_LOSS_PER_GAME_PERIOD = 1;
const FUNDING_WARNING = 20 // when the total spending is close to the funding quota
const INITIAL_CONSENSUS = 70;
const MIN_CONSENSUS = 20; // below this, the players are toppled


var totalSpending = 0;
var totalPopularity = 0;
var funding = INITIAL_EXTRA_FUNDING;
var duration = 0;

// all the questions, loaded from the spreadsheet in database.js
var questions = null,
    questionsCount = 0

// govt. departments
var departments = [],
    nameToDepartment = {}

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
  template += '</div><button class="yes btn">YAY</button><button class="no btn">NAY</button></div>';
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

      if (i == 0) { // only the first effect
        var breakingNews = duration + " days since the new local council swore in. ";
        if (impact.spending < -15) {
          breakingNews = "Huge spending cut on " + department.name + " spending. ";
        } if (impact.spending < 0) {
          breakingNews = "Local budget for " + department.name + " was cut. ";
        } else if (impact.spending > 0) {
          breakingNews = "Extra budget allocated for " + department.name + ". ";
        }
        if (impact.popularity < -15) {
          breakingNews += "Large protests reported against " + politicianInChargeOf(department.name) + ".";
        } else if (impact.popularity < 0) {
          breakingNews += "Public opinion turns against " + politicianInChargeOf(department.name) + ".";
        } else {
          breakingNews += "Public opinion is supportive.";
        }
        publishBreakingNews(breakingNews);
      }
    }
    else
    {
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
    var $department = $(department.bar)
    $department.css('height', department.spending + '%');
    $department.removeClass('green yellow red')
    if (department.spending < 67) $department.addClass('green')
    if (department.spending >= 67 && department.spending < 83) $department.addClass('yellow')
    if (department.spending >= 83) $department.addClass('red')
    totalSpending += department.spending;
    totalPopularity += department.popularity;
  }
  duration += 1;
  funding -= FUNDING_LOSS_PER_GAME_PERIOD;
  if (funding - totalSpending < FUNDING_WARNING)
  {
    document.dispatchEvent(new CustomEvent('FUNDING WARNING'))
    $('#status .funding').addClass('warning')
  }
  else {
    $('#status .funding').removeClass('warning')
  }
  totalPopularity /= departments.length;
  $('#status .budget').html(totalSpending);
  $('#status .funding').html(funding);
  $('#status').fadeIn();
  $('#score .duration').html(duration);
  $('#score .consensus').html(parseInt(totalPopularity));
  $('#score').fadeIn();
  if (outcome() != "clinging-to-power") {
    moveToPage(3);
  }
}

function outcome() {
  if (totalSpending > funding) {
    return "removed-from-above";
  }
  if (totalPopularity < MIN_CONSENSUS) {
    return "removed-from-below";
  }
  return "clinging-to-power";
}

document.addEventListener('PAGE DISPLAYED', function(event) {
  if (event.detail == 2) {
    $('#status').hide();
    $('#score').hide();
    loadData(questionsUrl, 'QUESTIONS', parseQuestion);

    for (var i = 0; i < departments.length; i++) {
      var department = departments[i];
      department.popularity = INITIAL_CONSENSUS;
      department.spending = 85 + Math.floor(Math.random() * 15);
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

    publishBreakingNews("PM demands strong austerity measures to be implemented in Austerington.");
  }
});
