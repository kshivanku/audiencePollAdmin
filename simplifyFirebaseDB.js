var simplifiedDB = [];

var config = {
    apiKey: "AIzaSyDB7c6Uf8dcA5m8jrWEyjKSPK7crGENyyQ",
    authDomain: "audiencepoll-7e23c.firebaseapp.com",
    databaseURL: "https://audiencepoll-7e23c.firebaseio.com",
    projectId: "audiencepoll-7e23c",
    storageBucket: "audiencepoll-7e23c.appspot.com",
    messagingSenderId: "580263770976"
};
firebase.initializeApp(config);
var database = firebase.database();

var ref = database.ref("allusers");
ref.on('value', gotData, errData);

function gotData(data) {
    var rawData = data.val();
    simplifyFirebaseDB(rawData);
    fillAudienceData();
}

function errData(err) {
    console.log("err", err);
}

function simplifyFirebaseDB(rawData) {
    simplifiedDB = [];
    allUserNames = Object.keys(rawData);
    if (allUserNames.length > 0) {
      for (var i = 0; i < allUserNames.length; i++) {
          var user = new User();
          user.username = allUserNames[i];
          var allFBKeysForUseri = Object.keys(rawData[allUserNames[i]]);
          for (var j = 0; j < allFBKeysForUseri.length; j++) {
              var questionKeys = Object.keys(rawData[allUserNames[i]][allFBKeysForUseri[j]]);
              user.questions.push(questionKeys);
              for (var k = 0 ; k < questionKeys.length ; k++) {
                var answer = rawData[allUserNames[i]][allFBKeysForUseri[j]][questionKeys[k]];
                user.answers.push(answer);
              }
          }
          simplifiedDB.push(user);
      }
    }
    console.log("simplifiedDB", simplifiedDB);
}

function User() {
  this.username = "";
  this.questions = [];
  this.answers = [];
  this.traits = [];
}
