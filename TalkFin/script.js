try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}


var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var notesList = $('ul#notes');


var noteContent = '';
//var arrayname=['again', 'also', 'because', 'boy', 'but', 'can', 'come', 'deaf', 'done', 'drink', 'drive', 'eat,', 'excuse', 'family', 'father', 'fine', 'food', 'for', 'friend', 'get', 'girl', 'give', 'good', 'have', 'he', 'hear', 'hello', 'help', 'home', 'if', 'know', 'live', 'man', 'many', 'me', 'more', 'my', 'name', 'need', 'new', 'no', 'ok', 'right', 'she','1','2','3','4','5','6','7','8','9','10'];

var path='temp/';


// Get all notes from previous sessions and display them.
var notes = getAllNotes();
renderNotes(notes);



/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
    noteContent += transcript;
    noteTextarea.val(noteContent);
  }
};

recognition.onstart = function() { 
  instructions.text('Voice recognition activated');
}

/*recognition.onspeechend = function() {
  instructions.text('You were quiet for a while so voice recognition turned itself off.');
}*/

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.');  
  };
}



/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function(e) {
  noteContent = '';
  if (noteContent.length) {
    noteContent += ' ';
  console.log(noteContent);
  }
  recognition.start(); 

});



// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function() {
  noteContent = $(this).val();
})

$('#save-note-btn').on('click', function(e) {
  recognition.stop();

  if(!noteContent.length) {
    instructions.text("You haven't spoken anything");
  }
  else {
    // Save note to localStorage.
    // The key is the dateTime with seconds, the value is the content of the note.
  saveNote(new Date().toLocaleString(), noteContent);
  var lc = noteContent.toLowerCase();
  var array = lc.split(" ");
  var i;
  i=0;
  var videoCount = array.length;
              // if statement start
          
            document.getElementById("vid1").setAttribute("src",array[0]+".mp4");          
            function videoPlay(videoNum)
                          {
                              document.getElementById("vid1").setAttribute("src",array[videoNum]+".mp4");
                              document.getElementById("vid1").load();
                              document.getElementById("vid1").play();
                          }      
          document.getElementById("vid1").addEventListener('ended',myHandler,false);
          function myHandler() 
                {
                  i++;
                  if(i == (videoCount))
                  {
                    //i = 0;
                    videoPlay(i);
                  }
                  
                  else
                  {
                    videoPlay(i);     
                  }
                }
             
            
           // else{
             // document.getElementById("notfound").innerHTML="NOT FOUND";

           // }


 }
})

  
    // Reset variables and update UI.
    
    //renderNotes(getAllNotes());
    //noteTextarea.val('');  

console.log("Input is",noteTextarea)

console.log(noteTextarea);


notesList.on('click', function(e) {
  e.preventDefault();
  var target = $(e.target);

  // Listen to the selected note.
  if(target.hasClass('listen-note')) {
    var content = target.closest('.note').find('.content').text();
    readOutLoud(content);
  }

  // Delete note.
  if(target.hasClass('delete-note')) {
    var dateTime = target.siblings('.date').text();  
    deleteNote(dateTime);
    target.closest('.note').remove();
  }
});



/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
  var speech = new SpeechSynthesisUtterance();

  // Set the text and voice attributes.
  speech.text = message;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  
  window.speechSynthesis.speak(speech);
}



/*-----------------------------
      Helper Functions 
------------------------------*/

function renderNotes(notes) {
  var html = '';
  if(notes.length) {
    notes.forEach(function(note) {
      html+= `<li class="note">
        <p class="header">
          <span class="date">${note.date}</span>
          <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
          <a href="#" class="delete-note" title="Delete">Delete</a>
        </p>
        <p class="content">${note.content}</p>
      </li>`;    
    });
  }
  else {
    html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
  }
  notesList.html(html);
}


function saveNote(dateTime, content) {
  localStorage.setItem('note-' + dateTime, content);
}


function getAllNotes() {
  var notes = [];
  var key;
  for (var i = 0; i < localStorage.length; i++) {
    key = localStorage.key(i);

    if(key.substring(0,5) == 'note-') {
      notes.push({
        date: key.replace('note-',''),
        content: localStorage.getItem(localStorage.key(i))
      });
    } 
  }
  return notes;
}


function deleteNote(dateTime) {
  localStorage.removeItem('note-' + dateTime); 
}