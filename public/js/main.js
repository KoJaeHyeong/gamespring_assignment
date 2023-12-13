// DOM 요소 가져오기
const participantCount = document.getElementById("participant-count");
const roomNumber = document.getElementById("room-number");
const content = document.getElementById("content");
const joinButton = document.getElementById("join-btn");

const userName = window.location.href.split("=")[1];
const socket = io();

// document.addEventListener("DOMContentLoaded", function () {
console.log("@@@@@@@@@@시작");

socket.emit("userInfo", userName);

socket.on("roomList", (data) => {
  console.log(data);
});

socket.emit("home", "Hello Node.JS");

socket.on("news", function (data) {
  console.log("news_client", data);
});

function joinRoom(roomNumber) {
  // 여기에서 방에 참여한 인원 수를 가져와서 업데이트하는 로직을 추가할 수 있습니다.
  // 이 부분은 실제 채팅 애플리케이션과 연동되어야 하며, 현재는 단순히 예시입니다.
  // const participantsElement = document.getElementById(
  //   `participants${roomNumber}`
  // );
  // const currentParticipants = parseInt(participantsElement.innerText, 10);
  // participantsElement.innerText = currentParticipants + 1;
  // 여기에서 채팅방으로 이동하는 로직을 추가할 수 있습니다.
  // 이 부분은 채팅 애플리케이션의 라우팅 또는 다른 방법을 사용하여 구현해야 합니다.
  // 현재는 단순히 경고창으로 표시하고 있습니다.
  // alert(`Joining Chat Room ${roomNumber}`);
  console.log(`room${roomNumber}`);
  socket.emit("joinRoom", `room${roomNumber}`);

  window.location.href = `rooms/room${roomNumber}`;
}
// const socket = io();
//   socket.on("news", function (data) {
//     console.log("news_client", data);

//     // 서버에게 메세지 송신
//     socket.emit("chat", "Hello Node.JS");
//   });

// 서버로부터 받은 참여인원 및 방번호 업데이트
// socket.on("updateRoomInfo", function (data) {
//   participantCount.textContent = data.participantCount;
//   roomNumber.textContent = data.roomNumber;
// });

// // 채팅방 입장 버튼 클릭 이벤트
// joinButton.addEventListener("click", function () {
//   // 여기에 채팅방 입장 로직 추가
//   // 예: socket.emit('joinRoom', { roomId: 'yourRoomId' });
// });

// // 서버로부터 받은 채팅 메시지를 content 영역에 추가
// socket.on("chatMessage", function (message) {
//   const messageElement = document.createElement("div");
//   messageElement.textContent = message;
//   content.appendChild(messageElement);
// });
// });
