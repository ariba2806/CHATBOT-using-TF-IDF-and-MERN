var $messages = $('.messages-content');
var serverResponse = "wala";


var suggession;
//speech recognition
try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
}
//start speech recognition
$('#start-record-btn').on('click', function(e) {
  recognition.start();
});
//translate recognized speech to text and insert message
recognition.onresult = (event) => {
  const speechToText = event.results[0][0].transcript;
 document.getElementById("MSG").value= speechToText;
  //console.log(speechToText)
  insertMessage()
}

//append the question user asked to the UI
function listendom(no){
  console.log(no)
  //console.log(document.getElementById(no))
document.getElementById("MSG").value= no.innerHTML;
  insertMessage();
}
//default first/welcome message
$(window).load(function() {
  $messages.mCustomScrollbar();
  setTimeout(function() {
    serverMessage("hello i am customer support bot type your question here");
  }, 100);

});
//add scroll bar to bottom as new messages append
function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

//insert user message in DIV
function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
 fetchmsg() 
  
  $('.message-input').val(null);
  updateScrollbar();

}
//submit on enter
document.getElementById("mymsg").onsubmit = (e)=>{
  e.preventDefault() 
  insertMessage();
 // serverMessage("hello");
 // speechSynthesis.speak( new SpeechSynthesisUtterance("hello"))
}

//insert bot message
function serverMessage(response2) {


  if ($('.message-input').val() != '') {
    return false;
  }
  //if message empty
  $('<div class="message loading new"><figure class="avatar"><img src="css/bot.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();
  
//if message not empty insert the response
  setTimeout(function() {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="css/bot.png" /></figure>' + response2 + '</div>').appendTo($('.mCSB_container')).addClass('new');
    updateScrollbar();
  }, 100 + (Math.random() * 20) * 100);

}

//fetch the response most matched from mongodb by tf-idf algorithm 
function fetchmsg(){

     var url = 'http://localhost:5000/send-msg';
      
      const data = new URLSearchParams();
      for (const pair of new FormData(document.getElementById("mymsg"))) {
          data.append(pair[0], pair[1]);
          console.log(pair)
      }
    
      console.log("abc",data)
        fetch(url, {
          method: 'POST',
          body:data
        }).then(res => res.json())
         .then(response => {
          console.log(response);
        serverMessage(response.Reply);
          speechSynthesis.speak( new SpeechSynthesisUtterance(response.Reply))
        
          
         })
          .catch(error => console.error('Error h:', error));

}


