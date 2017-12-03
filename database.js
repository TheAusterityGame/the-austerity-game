var questionsUrl = 'https://api.airtable.com/v0/appUhYpS5VrTEb9Nm/Questions?api_key=keyvcbzivvvtnmex2';
var tweetsUrl = 'https://api.airtable.com/v0/appUhYpS5VrTEb9Nm/Tweets?api_key=keyvcbzivvvtnmex2';
function loadData (url, which, parser)
{
	$.ajax(
  {
    url: url,
    dataType: 'json',
    success: function(responseJSON)
    {
      var things = []
      console.log(which + ' data loaded!')
      // console.log(responseJSON)
      for (var i = 0; i < responseJSON.records.length; i++)
      {
        var thing = parser(responseJSON.records[i])
        things.push(thing)
      }
      console.log(things)
      document.dispatchEvent(new CustomEvent(which + ' LOADED', {detail: things} ))
    }
  });
}

function parseQuestion(data)
{
  var question =
  {
    id: data.id,
    label: data.fields.question,
    impacts: []
  }

  var fields = data.fields

  if (fields['first department'])
  {
    var impact = {}
    impact.department = fields['first department'][0]
    impact.popularity = fields['first politician impact']
    impact.spending = fields['first spending impact']
    question.impacts.push(impact)
  }

  if (fields['second department'])
  {
    var impact = {}
    impact.name = fields['second department'][0]
    impact.popularity = fields['second politician impact']
    impact.spending = fields['second spending impact']
    question.impacts.push(impact)
  }

  if (data['third department'])
  {
    var impact = {}
    impact.name = fields['third department'][0]
    impact.popularity = fields['third politician impact']
    impact.spending = fields['third spending impact']
    question.impacts.push(impact)
  }

  return question;
}

function parseTweet(data)
{
  var department = data.fields.department;
  if (department != undefined) {
    department = department[0]; 
  }

  var tweet =
  {
    id: data.id,
    username: data.fields.username,
    content: data.fields.content,
    department: department,
    complaint: (data.fields.complaint == true),
    displayed: 0
  }

  return tweet;
}

// https://stackoverflow.com/a/10142256/2928562
Array.prototype.shuffle = function()
{
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}
