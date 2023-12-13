// const socket = io.connect(`http://localhost:3000/rooms`); // room 분기 처리
const socket = io(); // room 분기 처리
console.log(window.location.href);
const roomNameSplit = window.location.href.split("/");
const roomName = roomNameSplit[roomNameSplit.length - 1];
console.log(roomName);
// document.addEventListener("DOMContentLoaded", function () {
const messageInput = document.getElementById("messageInput");
const chatContainer = document.getElementById("chatContainer");
const sendButton = document.getElementById("sendButton");

socket.emit("joinRoom", roomName, "ko1586");

socket.on("userInfo", (data) => {
  console.log("userInfo", data);
  userJoined(data);
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (message !== "") {
    // Add the message to the chat container
    socket.emit("roomChat", message);
    appendMessage("You", message, "sent");

    socket.on("roomChat", (msg, connectedUser) => {
      appendMessage(connectedUser, msg, "sent");
    });
    // appendMessage("You", message, "sent");
    // Here you can implement the logic to send the message to the server
    console.log(`Message sent: ${message}`);

    // Clear the input field after sending the message
    messageInput.value = "";
  }
}

function appendMessage(user, message, action) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  messageElement.innerHTML = `<strong>${user}</strong> ${action}: ${message}`;
  chatContainer.appendChild(messageElement);

  // Automatically scroll to the bottom of the chat container
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function userJoined(user) {
  // Add a system message to indicate user joining
  appendMessage(user, "joined the room", "has");
}

function exitButton() {
  window.location.href = "/rooms";
}

// Attach the event listener to the Send button

const messageElement = document.createElement("div");
if (sendButton) {
  messageElement.classList.add("chat-message");
  socket.on("roomChat", (msg) => {
    console.log("message", msg);
    messageElement.innerHTML = `<strong>상대방</strong> receive: ${msg}`;
    chatContainer.appendChild(messageElement);
  });
  sendButton.addEventListener("click", sendMessage);
}

// Simulate a user joining the room on page load
// userJoined("you");
// });
