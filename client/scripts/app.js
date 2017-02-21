// ********** // Initialize variables

let chatText;

let chats = [];
let filteredChats;
// let newChats = {};

let users = [];

let rooms = {};
let activeRoom;

let opts = {
  refreshInterval: 10000,
  maxChats: 100,
}

let newUserChat;

let app;

// ********** // Helper Functions

function escapeString(str){
  str = str.toString();
  str = encodeURIComponent(str);
  str.replace(/'/,'%27');
  return str;
}

function unescapeString(str){
  str = decodeURIComponent(str);
  return str;
}

// ********** // Classes

class Message {
  constructor(username,text,roomname){
    this.username = username;
    this.text = text;
    this.roomname = roomname;
  }
}

class App {
  constructor(){
    this.server = 'http://127.0.0.1:3000/classes/messages';
    this.friends = {};
    this.send = this.send.bind(this);
    this.fetch = this.fetch.bind(this);
  }
  init(){
    // this.fetch();
    // set
  }

  send(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'text/plain',
      // contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        console.log(data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch(){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      // data: {order: '-createdAt', limit: 1000},
      dataType: 'json',
      success: function (data) {
        console.log('chatterbox: Messages received: ', data);
        // newChats = {};
        chats = [];
        // for(let chat of data.results){
        //   if(chat.username && chat.text && chat.roomname){
        //     chat.username = escapeString(chat.username).slice(0,20).replace(/%/g,'');
        //     chat.text = escapeString(chat.text).replace(/%/g,'');
        //     chat.roomname = escapeString(chat.roomname).slice(0,20).replace(/%/g,'');
        //     chats.push(chat);
        //     users.push(chat.username);
        //     rooms[chat.roomname] = true;
        //   }
        // }
        for(let chat of data.results){
          if(chat.username && chat.text){
            chat.username = escapeString(chat.username).slice(0,20).replace(/%/g,'');
            chat.text = escapeString(chat.text).replace(/%/g,'');
            // chat.roomname = escapeString(chat.roomname).slice(0,20).replace(/%/g,'');
            chats.push(chat);
            users.push(chat.username);
            // rooms[chat.roomname] = true;
          }
        }
        //sort chats by when created
        // chats.sort((a,b) => Date.parse(a['createdAt']) - Date.parse(b['createdAt']));
        //console.dir(chats);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch messages');
      }
    });
    setTimeout(this.fetch,opts.refreshInterval);
  };

  clearMessages() {
    $('#chats').empty();
  }

  renderMessage(message){
    let $newChat = $('<div class="chat"></div>');
    $newChat.data(message.text);
    $('#chats').append($newChat);
  }

  renderRoom(){
    let $newRoom = $('<div class="room"></div>')
    $('#roomSelect').append($newRoom);
  }

  renderRooms(){
    $('#roomSelect').empty();

    activeRoom = activeRoom || Object.keys(rooms)[0];

    for(let room in rooms){
      let $roomOption = $('<div class="room"></div>')
      $roomOption.text(unescapeString(room));
      $('#roomSelect').append($roomOption);
      if(room === activeRoom){
        $roomOption.addClass('activeRoom');
      }
    }

    $('.room').on('click',function(){
      activeRoom = $(this).text();
      $('.room').each(function(){
        $(this).removeClass('activeRoom');
      });
      $(this).addClass('activeRoom');
      app.renderChats();
    });
  }

  renderChats(){
    app.clearMessages();
    //filter for room, then for size of array < opts.maxChats
    if(activeRoom){
      filteredChats = _.filter(chats,function(val,key,coll){
          return val.roomname === activeRoom;
      });      
    } else {
      filteredChats = chats;
    }

    
    for(let i = filteredChats.length - 1; i >= 0; i--){
      let $chatBox = $('<div class="container ' + users.indexOf(filteredChats[i].username) + ' ' + filteredChats[i].objectId + '"></div>');

      let $chatBoxUser = $('<div class="username ' + users.indexOf(filteredChats[i].username) + '"></div>');
      $chatBoxUser.text(unescapeString(filteredChats[i].username));
      if(users.indexOf(filteredChats[i].username) in app.friends){
        $chatBoxUser.addClass('friend');
      }

      let $chatBoxText = $('<div class="chatText"></div>');
      $chatBoxText.text(unescapeString(filteredChats[i].text));

      let $chatBoxTime = $('<div class="chatTime"></div>');;
      let chatDate = $.timeago(unescapeString(filteredChats[i].createdAt));
      $chatBoxTime.text(chatDate);

      $chatBox.append($chatBoxUser);
      $chatBox.append($chatBoxText);
      $chatBox.append($chatBoxTime);
      $('#chats').append($chatBox);
    }

    $('.username').on('click',function(){
      if(this.classList[1] in app.friends){
        app.removeFriend(this);
        app.handleUsernameClick();
      } else {
        app.addFriend(this);
        app.handleUsernameClick();
      }
      $('.username.' + this.classList[1]).toggleClass('friend');
    });
  }

  handleUsernameClick(){
    console.log('clicked');
  }

  addFriend(userNode){
    let friendName = userNode.classList[1];
    this.friends[friendName] = friendName;
  }

  removeFriend(userNode){
    let friendName = userNode.classList[1];
    delete this.friends[friendName];
  }
}

// ********** // Document Ready

$(document).ready(function(){

  app = new App();
  app.fetch();

  window.userInput = window.userInput || window.location.search.split('=')[1];
  $('.userInput').text(window.userInput);

  $('.textInput').on('focus',function(){
    if($('.textInput').text() === 'chat text'){
      $('.textInput').text('');    
    }
  });

  $('.textInput').on('focusout',function(){
    if(typeof $('.textInput').text() === 'string' && $('.textInput').text() !== ''){
      chatText = $('.textInput').text();
    } else {
      $('.textInput').text('chat text');
    }
  });


  $('.submit').on('click',function(){
    newUserChat = new Message(window.userInput,chatText,activeRoom);
    app.send(newUserChat);
    $('.textInput').text('');
  });

});

// ********** // AJAX Complete

$(document).ajaxSuccess(function(event, xhr, settings){
  app.renderChats();
  app.renderRooms();
});
