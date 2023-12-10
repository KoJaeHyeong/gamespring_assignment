function joinRoom(roomNumber) {
  // 여기에서 방에 참여한 인원 수를 가져와서 업데이트하는 로직을 추가할 수 있습니다.
  // 이 부분은 실제 채팅 애플리케이션과 연동되어야 하며, 현재는 단순히 예시입니다.
  const participantsElement = document.getElementById(
    `participants${roomNumber}`
  );
  const currentParticipants = parseInt(participantsElement.innerText, 10);
  participantsElement.innerText = currentParticipants + 1;

  // 여기에서 채팅방으로 이동하는 로직을 추가할 수 있습니다.
  // 이 부분은 채팅 애플리케이션의 라우팅 또는 다른 방법을 사용하여 구현해야 합니다.
  // 현재는 단순히 경고창으로 표시하고 있습니다.
  alert(`Joining Chat Room ${roomNumber}`);

  console.log(roomNumber);
  if (roomNumber === 1) {
    window.location.href = "/room1";
  } else {
    window.location.href = "/room2";
  }
}
