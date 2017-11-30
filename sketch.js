//This is socet connection to audience
var socketAudience;
socketAudience = io.connect("https://audiencepoll.herokuapp.com/");

//This is sockets connection to the dates
var socketDates;

$(document).ready(function() {
    fillAudienceData();
    fillDatesData();

    $(".question").live('click', function() {
        console.log("clicked on question");
        $(this).addClass('sent');
        var clicked_id = $(this)[0].id;
        clicked_id = clicked_id.split("_")[1]; //removing the question or reaction part from id
        var clicked_quest_data = findQuestById(clicked_id);
        console.log("clicked_quest_data", clicked_quest_data);
        socketAudience.emit('questionData', clicked_quest_data);
    })

    $(".audienceReaction").live('click', function() {
        $(this).addClass('sent');
        var audienceReaction = "" + $(this)[0].childNodes[1].innerHTML +"";
        console.log("audienceReaction", audienceReaction);
        socketAudience.emit('audienceReaction', audienceReaction);
    })
})

function fillAudienceData() {
    console.log("inside fillAudienceData");
    $("#messagesForAudience").empty();
    for (var i = 0; i < questions.length; i++) {
        if(questions[i].isSent) {
          var new_quest = `
              <div class='messageDiv question padder sent' id = question_` + questions[i].question_id + `>
              <h3>` + questions[i].question_text + `</h3>
              <p>` + questions[i].option1 + `, ` + questions[i].option2 + `, ` + questions[i].option3 + `, ` + questions[i].option4 + `</p>
              </div>`;
        }
        else{
          var new_quest = `
              <div class='messageDiv question padder' id = question_` + questions[i].question_id + `>
              <h3>` + questions[i].question_text + `</h3>
              <p>` + questions[i].option1 + `, ` + questions[i].option2 + `, ` + questions[i].option3 + `, ` + questions[i].option4 + `</p>
              </div>`;
        }
        $("#messagesForAudience").append(new_quest);

        if(questions[i + 1] && questions[i + 1].isSent) {
          var audienceReaction = `
              <div class='messageDiv audienceReaction padder sent' id = reaction_` + questions[i].question_id + `>
              <p> It looks like you all have chosen: <span style="font-weight: bold">` + calcAudienceReaction(questions[i].question_text);
          `</span></div>`;
        }
        else {
          var audienceReaction = `
              <div class='messageDiv audienceReaction padder' id = reaction_` + questions[i].question_id + `>
              <p> It looks like you all have chosen: <span style="font-weight: bold">` + calcAudienceReaction(questions[i].question_text);
          `</span></div>`;
        }
        $("#messagesForAudience").append(audienceReaction);
    }
}

function calcAudienceReaction(question_text) {
    var answerPolls = {};
    var index = -1;
    if (simplifiedDB.length > 0) {
        for (var i = 0; i < simplifiedDB.length; i++) {
            for (var k = 0; k < simplifiedDB[i].questions.length; k++) {
                if (simplifiedDB[i].questions[k] == question_text) {
                    index = k;
                }
            }
            if (index != -1) {
                if (answerPolls[simplifiedDB[i].answers[index]]) {
                    answerPolls[simplifiedDB[i].answers[index]] += 1;
                } else {
                    answerPolls[simplifiedDB[i].answers[index]] = 1;
                }
            }
        }
        console.log("answerPolls for question: " + question_text + ": ", answerPolls);
        var allAnswers = Object.keys(answerPolls);
        if (allAnswers.length > 0) {
            var maxAnswer = allAnswers[0];
            for (var j = 1; j < allAnswers.length; j++) {
                if (answerPolls[allAnswers[j]] > answerPolls[maxAnswer]) {
                    maxAnswer = allAnswers[j];
                }
            }
            console.log("Max Answer for " + question_text + " is " + maxAnswer);
            return maxAnswer;
        } else {
            return "null";
        }
    } else {
        return "null";
    }
}

function fillDatesData() {}

function findQuestById(clicked_id) {
    for (var i = 0; i < questions.length; i++) {
        if (questions[i].question_id == clicked_id) {
            questions[i].isSent = true;
            return questions[i];
        }
    }
}
