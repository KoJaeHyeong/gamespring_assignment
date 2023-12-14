// const userName = window.location.href.split("=")[1];
// console.log(window.location.href.split("?id="));

const userName = window.location.href.split("?id=")[1];
const receiveName = window.location.href.split("?id=")[2];

const chatContainer = document.getElementById("chatContainer");
const sendButton = document.getElementById("sendButton");
const exitButton = document.getElementById("exitButton");

const socket = io();

socket.emit("private_join", { userName, receiveName }, () => {
  const message = `${userName}님이 입장하였습니다.`;
  drawUser(message);
});

socket.on("private_user", (data) => {
  console.log(data);
  const message = `${data.userName}님이 입장하였습니다.`;
  drawUser(message);
});

socket.on("private_msg", (data) => {
  drawMessage(data);
});

// 유저 입퇴장 관련 내용 표출
function drawUser(message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  messageElement.innerHTML = message;
  chatContainer.appendChild(messageElement);

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 메시지 내용 표출
function drawMessage(data) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  messageElement.innerHTML = `${data.user}: ${data.message}`;
  chatContainer.appendChild(messageElement);

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 메시지 전송
function sendMessage(e) {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message !== "") {
    const sendData = {
      message: message,
      user: userName,
    };

    socket.emit("private_msg", sendData);

    drawMessage(sendData);
    messageInput.value = "";
  }
}

async function exitRoom(e) {
  e.preventDefault();
  socket.emit("private_leave", "exit");
  window.location.href = `${window.location.origin}/rooms/friend?id=${userName}`;
}

sendButton.addEventListener("click", sendMessage);
exitButton.addEventListener("click", exitRoom);
