// DOM 요소 가져오기
const participantCount1 = document.getElementById("participants1");
const participantCount2 = document.getElementById("participants2");

const userName = window.location.href.split("=")[1];
// const socket = io.connect("http://localhost:3000", {
//   reconnection: true,
//   reconnectionDelay: 1000,
//   reconnectionAttempts: 5,
//   forceNew: false,
// });

const socket = io();

console.log("@@@@@@@@@@시작");
console.log(socket.id);

socket.emit("userInfo", userName);

socket.on("roomInfo", (data) => {
  console.log("data", data);
  participant(data.room1, data.room2);
});

// 룸의 참여자 수
function participant(room1, room2) {
  participantCount1.innerText = room1;
  participantCount2.innerText = room2;
}

function joinRoom(roomNumber) {
  // console.log(`room${roomNumber}`);
  // socket.emit("joinRoom", { room: `room${roomNumber}`, user_name: userName });
  window.location.href = `rooms/room${roomNumber}?id=${userName}`;
}
