// const socket = io.connect(`http://localhost:3000/rooms`); // room 분기 처리
// const socket = io.connect("http://localhost:3000", {
//   reconnection: true,
//   reconnectionDelay: 1000,
//   reconnectionAttempts: 5,
//   forceNew: false,
// });
const messageInput = document.getElementById("messageInput");
const chatContainer = document.getElementById("chatContainer");
const sendButton = document.getElementById("sendButton");
const exitButton = document.getElementById("exitButton");

const userName = window.location.href.split("=")[1];
const roomNumber = window.location.href.split("/").pop().split("?")[0];

const socket = io();

// socket.emit("joinRoom", { user_name: userName, room });
socket.emit("joinRoom", { room: `${roomNumber}`, user_name: userName }, () => {
  const message = `${userName}님이 입장하였습니다.`;
  drawUser(message);
});

socket.on("newUser", (data) => {
  console.log(`${data.user_name}님이 입장하였습니다.`);
  const message = `${data.user_name}님이 입장하였습니다.`;
  drawUser(message);
});

socket.on("roomChat", (data) => {
  console.log("@@@@@@@너 몇번 호출되니");
  drawMessage(data);
});

// socket.on;

function drawUser(message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  messageElement.innerHTML = message;
  chatContainer.appendChild(messageElement);

  // Automatically scroll to the bottom of the chat container
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function drawMessage(data) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  messageElement.innerHTML = `${data.user}: ${data.message}`;
  chatContainer.appendChild(messageElement);

  // Automatically scroll to the bottom of the chat container
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage(e) {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message !== "") {
    const sendData = {
      room: roomNumber,
      message: message,
      user: userName,
    };
    // Add the message to the chat container
    socket.emit("send_msg", sendData);

    drawMessage(sendData);
    console.log(`Message sent: ${message}`);

    // Clear the input field after sending the message
    messageInput.value = "";
  }
}

function exitRoom(e) {
  const message = `${userName}님이 퇴장하셨습니다.`;
  drawUser(message);
  e.preventDefault();
  socket.emit("leave_room", roomNumber);
  console.log("leave_room_client", roomNumber);
  window.location.href = `/rooms?id=${userName}`;
}

sendButton.addEventListener("click", sendMessage);
exitButton.addEventListener("click", exitRoom);
