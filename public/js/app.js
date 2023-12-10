document.addEventListener("DOMContentLoaded", function () {
  const socket = io();

  // DOM 요소 가져오기
  const participantCount = document.getElementById("participant-count");
  const roomNumber = document.getElementById("room-number");
  const content = document.getElementById("content");
  const joinButton = document.getElementById("join-btn");

  // 서버로부터 받은 참여인원 및 방번호 업데이트
  socket.on("updateRoomInfo", function (data) {
    participantCount.textContent = data.participantCount;
    roomNumber.textContent = data.roomNumber;
  });

  // 채팅방 입장 버튼 클릭 이벤트
  joinButton.addEventListener("click", function () {
    // 여기에 채팅방 입장 로직 추가
    // 예: socket.emit('joinRoom', { roomId: 'yourRoomId' });
  });

  // 서버로부터 받은 채팅 메시지를 content 영역에 추가
  socket.on("chatMessage", function (message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    content.appendChild(messageElement);
  });
});
