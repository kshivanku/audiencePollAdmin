var socket;
socket = io.connect("https://audiencepoll.herokuapp.com/");

$(document).ready(function(){
  var data = {'x' : 123, 'y': 345};   //some sample data
  socket.emit('sampleData', data);
})
