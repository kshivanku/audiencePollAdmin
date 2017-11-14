var socket;
socket = io.connect("https://audiencepoll.herokuapp.com/");

var rawData;

$(document).ready(function(){
  loadPage('questions');
  $("#atab").click(function(){
    loadPage('analysis');
  })
  $("#qtab").click(function(){
    loadPage('questions');
  })
  $("#question_list .question").click(function(){
    clicked_id = $(this)[0].id;
    clicked_quest_data = findQuestById(clicked_id);
    console.log(clicked_quest_data);
    socket.emit('questionData', clicked_quest_data);
  })
})

function loadPage(page) {
  if(page == 'questions'){
    $("#question_list").css("display", "block");
    fillQuestionsData();
    $("#analysis").css("display", "none");
    $("#qtab").css("font-weight", "bold");
    $("#atab").css("font-weight", "normal");
  }
  else if (page == 'analysis') {
    $("#question_list").css("display", "none");
    $("#analysis").css("display", "block");
    fillAnalysisData();
    $("#qtab").css("font-weight", "normal");
    $("#atab").css("font-weight", "bold");
  }
}

function fillQuestionsData(){
  $("#question_list").empty();
  for(var i = 0; i < questions.length; i++) {
    var new_quest = `
      <div class='question' id = `+ questions[i].question_id +`>
        <h3>` + questions[i].question_text + `</h3>
        <p>`+ questions[i].option1 +`, `+ questions[i].option2 +`, `+questions[i].option3 +`, `+ questions[i].option4 +`</p>
      </div>`;
    $("#question_list").append(new_quest);
  }
}

function fillAnalysisData(){
  $("#analysis").empty();
  var analysis_report = "<h3>Data for following users is available:</h3>";
  if(rawData){
    var users = Object.keys(rawData);
    for(var i = 0; i < users.length; i++) {
      analysis_report += "<h4>" + i+1 + ". " + users[i] + "</h4><p>Traits: Negative person, Needy</p>";
    }
    analysis_report += "</p>";
  }
  else {
    analysis_report += "<em>No users yet</em></p>"
  }
  $("#analysis").append(analysis_report);
}

function findQuestById(clicked_id){
  for(var i = 0 ; i < questions.length; i++){
    if(questions[i].question_id == clicked_id) {
      questions[i].isasked = true;
      return questions[i];
    }
  }
}

//Firebase Stuff
var config = {
  apiKey: "AIzaSyDB7c6Uf8dcA5m8jrWEyjKSPK7crGENyyQ",
  authDomain: "audiencepoll-7e23c.firebaseapp.com",
  databaseURL: "https://audiencepoll-7e23c.firebaseio.com",
  projectId: "audiencepoll-7e23c",
  storageBucket: "audiencepoll-7e23c.appspot.com",
  messagingSenderId: "580263770976",
};
firebase.initializeApp(config);
var database = firebase.database();

var ref = database.ref("allusers");
ref.on('value', gotData, errData);

function gotData(data){
  rawData = data.val();
}

function errData(err){
  console.log(err);
}


var questions = [
  {
    "question_id": "Both01",
    "question_text": "How is the date going so far?",
    "option1": "Perfect",
    "option2": "Ok",
    "option3": "Bad",
    "option4": "Terrible",
    "isasked": false
  },
  {
    "question_id": "HIM01",
    "question_text": "Quick, save the conversation! What should he talk about next?",
    "option1": "Tell a personal story",
    "option2": "Talk about movies",
    "option3": "Ask her something personal",
    "option4": "Give her a complement",
    "isasked": false
  },
  {
    "question_id": "HER01",
    "question_text": "What do you think is the most important quality that he is looking for in his partner?",
    "option1": "Intelligence",
    "option2": "Kindness",
    "option3": "Fun",
    "option4": "Looks",
    "isasked": false
  }
]
