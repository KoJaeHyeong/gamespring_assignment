const messageInput = document.getElementById("messageInput");
const chatContainer = document.getElementById("chatContainer");
const sendButton = document.getElementById("sendButton");
const exitButton = document.getElementById("exitButton");
const participantsList = document.getElementById("participantsList");

const userName = window.location.href.split("=")[1];
const roomNumber = window.location.href.split("/").pop().split("?")[0];

const socket = io();

// room 입장 관련 통신
socket.emit("joinRoom", { room: `${roomNumber}`, user_name: userName }, () => {
  const message = `${userName}님이 입장하였습니다.`;
  drawUser(message);
  // drawParticipants(userName);
});

// room 입장 관련 통신
socket.on("newUser", (data, userList) => {
  const message = `${data.user_name}님이 입장하였습니다.`;
  drawUser(message);
  // drawParticipants(user);
  // drawParticipants(`${userName}`);
});

// room 채팅 메시지 표출 통신
socket.on("roomChat", (data) => {
  drawMessage(data);
});

// 유저 입퇴장 관련 내용 표출
function drawUser(message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  messageElement.innerHTML = message;
  chatContainer.appendChild(messageElement);

  // Automatically scroll to the bottom of the chat container
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 채팅 참여자 목록 표출
function drawParticipants(user) {
  const participantsElement = document.createElement("div");
  // participantsElement.classList.add("chat-message");
  console.log(participantsElement);
  participantsElement.innerHTML = user;
  participantsList.appendChild(participantsElement);

  // participantsList.appendChild(participantsElement);

  // Automatically scroll to the bottom of the chat container
  participantsList.scrollTop = participantsList.scrollHeight;
}

// 메시지 내용 표출
function drawMessage(data) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  messageElement.innerHTML = `${data.user}: ${data.message}`;
  chatContainer.appendChild(messageElement);

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

    socket.emit("send_msg", sendData);

    drawMessage(sendData);
    messageInput.value = "";
  }
}

// 룸 퇴잠 버튼 함수
async function exitRoom(e) {
  e.preventDefault();
  const message = `${userName}님이 퇴장하셨습니다.`;
  socket.emit("leave_room", { room: roomNumber, message: message });
  window.location.href = `/rooms?id=${userName}`;
}

// 퇴장 메시지 표출
socket.on("leave_room_msg", (data) => {
  drawUser(data);
});

sendButton.addEventListener("click", sendMessage);
exitButton.addEventListener("click", exitRoom);
