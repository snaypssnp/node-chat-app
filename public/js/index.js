(function() {
  'use strict';

  const socket = io();

  function scrollToBottom () {
    const messages = $('#messages');
    const newMessage = messages.children('li:last-child');
    // Heights
    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight +  lastMessageHeight >= scrollHeight) {
      messages.scrollTop(clientHeight);
    }
  }

  socket.on('connect', function () {
    console.log('Connected to server');
  });

  socket.on('disconnect', function () {
    console.log('Disconnected from server');
  });


  socket.on('newMessage', function(message) {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const template = $('#message-template').html();
    const html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom()
  });

  socket.on('newLocationMessage', function(message) {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const template = $('#location-template').html();
    const html = Mustache.render(template, {
      text: message.text,
      url: message.url,
      createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom()
  });
  
  $('#message-form').on('submit', function(e) {
    e.preventDefault();

    const messageTextBox = $('[name=message]');

    socket.emit('createMessage', {
      from: 'User',
      text: messageTextBox.val()
    }, function() {
      messageTextBox.val('');
    });
  });

  const locationButton = $('#send-location');
  locationButton.on('click', function() {
    if (!navigator.geolocation) {
      return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position) {
      locationButton.removeAttr('disabled').text('Send Location');
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }, function() {
      alert('Unable to fetch location');
    })
  })

}());


