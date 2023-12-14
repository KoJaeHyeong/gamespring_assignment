const userName = window.location.href.split("=")[1];
const requestListTab = document.getElementById("requestListTab");
const friendListTab = document.getElementById("friendListTab");

document.addEventListener("DOMContentLoaded", function () {
  requestListRender();
});

// 친구 요청 수신함 표출
async function requestListRender() {
  // 목록 클릭시 active 표시
  requestListTab.classList.add("active");
  friendListTab.classList.remove("active");

  const friends = await axios.get(
    `${window.location.origin}/rooms/friend/list/${userName}`
  );

  const friendsContainer = document.getElementById("friendsContainer");
  friendsContainer.innerHTML = "";

  friends.data.data.forEach((friend) => {
    const friendDiv = document.createElement("div");
    friendDiv.classList.add("friend");
    friendDiv.innerHTML = `
            <p>ID: ${friend.friends_id}</p>
            <p>가입 날짜: ${friend.user_created_at}</p>
            ${renderButtons(friend.friends_status, friend.friends_id)}
        `;

    friendsContainer.appendChild(friendDiv);
  });
}

// 친구 목록 표출
async function friendListRender() {
  // 목록 클릭시 active 표시
  friendListTab.classList.add("active");
  requestListTab.classList.remove("active");

  const friends = await axios.get(
    `${window.location.origin}/rooms/friend/friendlist/${userName}`
  );

  const friendsContainer = document.getElementById("friendsContainer");
  friendsContainer.innerHTML = "";

  friends.data.data.forEach((friend) => {
    const friendDiv = document.createElement("div");
    friendDiv.classList.add("friend");
    friendDiv.innerHTML = `
            <p>ID: ${friend.friends_id}</p>
            <p>가입 날짜: ${friend.user_created_at}</p>
            ${renderButtons(friend.friends_status, friend.friends_id)}
        `;

    friendsContainer.appendChild(friendDiv);
  });
}

function renderButtons(status, friendsId) {
  if (status === false) {
    return `
            <button class="accept-btn" onclick="acceptFriendRequest('${friendsId}')">수락</button>
            <button class="reject-btn" onclick="rejectFriendRequest('${friendsId}')">거절</button>
        `;
  } else if (status === true) {
    return `
            <button class="remove-btn" onclick="removeFriend('${friendsId}')">친구 삭제</button>
            <button class="dm-btn" onclick="sendDirectMessage('${friendsId}')">DM</button>
        `;
  }

  return "";
}

// 친구 요청 수락
async function acceptFriendRequest(friendsId) {
  const result = await axios.post(
    `${window.location.origin}/rooms/friend/list/accept`,
    {
      user_id: userName,
      friends_id: friendsId,
    }
  );

  if (result.data.data) {
    alert("수락되었습니다.");
    window.location.reload();
  }
}

// 친구 요청 거절
async function rejectFriendRequest(friendsId) {
  const result = await axios.post(
    `${window.location.origin}/rooms/friend/list/reject`,
    {
      user_id: userName,
      friends_id: friendsId,
    }
  );

  if (result.data.data) {
    alert("거절되었습니다.");
    window.location.reload();
  }
}

// 친구 삭제
async function removeFriend(friendsId) {
  const result = await axios.post(
    `${window.location.origin}/rooms/friend/list/reject`,
    {
      user_id: userName,
      friends_id: friendsId,
    }
  );

  if (result.data.data) {
    alert("삭제되었습니다..");
    // window.location.reload();
    friendListRender();
  }
}

// DM
function sendDirectMessage(friendsId) {
  window.location.href = `${window.location.origin}/rooms/friend/private?id=${userName}?id=${friendsId}`;
  console.log("Direct message sent!");
}

const roomsTab = document.getElementById("roomsTab");
const usersTab = document.getElementById("usersTab");
const friendsTab = document.getElementById("friendsTab");
const logoutTab = document.getElementById("logoutTab");

// navigation bar
function navigateTo(endPoint) {
  switch (endPoint) {
    case "rooms":
      roomsTab.classList.add("active");
      usersTab.classList.remove("active");
      friendsTab.classList.remove("active");
      logoutTab.classList.remove("active");
      window.location.href = `${window.location.origin}/rooms?id=${userName}`;
      break;

    case "users":
      roomsTab.classList.remove("active");
      usersTab.classList.add("active");
      friendsTab.classList.remove("active");
      logoutTab.classList.remove("active");
      window.location.href = `${window.location.origin}/rooms/users?id=${userName}`;
      break;

    case "friends":
      roomsTab.classList.remove("active");
      usersTab.classList.remove("active");
      friendsTab.classList.add("active");
      logoutTab.classList.remove("active");
      requestListTab.classList.add("active");

      window.location.href = `${window.location.origin}/rooms/friend?id=${userName}`; //todo friends url
      break;
    case "logout":
      roomsTab.classList.remove("active");
      usersTab.classList.remove("active");
      friendsTab.classList.remove("active");
      logoutTab.classList.add("active");
      window.location.href = `${window.location.origin}`;
      break;
  }
}
