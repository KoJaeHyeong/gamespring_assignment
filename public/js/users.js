const userName = window.location.href.split("=")[1];

async function createUserList() {
  // fetch findAllUserList API
  const result = await axios.get(
    `${window.location.origin}/rooms/users/${userName}`
  );

  const userList = result.data.data;

  const userContainer = document.getElementById("userContainer");
  userContainer.innerHTML = "";

  userList.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.classList.add("user");
    userDiv.innerHTML = `
          <p>ID: ${user.id}</p>
          <p>가입날짜: ${user.created_at}</p>
          <p>친구수 : ${user.friends_count}</p>
        `;
    // <button onclick="sendFriendRequest('${user.id}')">친구요청</button>
    console.log(user);
    const friendsStatus = user.friends_status;

    console.log(friendsStatus);
    if (!friendsStatus) {
      const button = document.createElement("button");
      button.textContent = "친구요청";
      button.onclick = () => sendFriendRequest(user.id);
      userDiv.appendChild(button);
    }

    userContainer.appendChild(userDiv);
  });
}

// add request friends
async function sendFriendRequest(friendName) {
  const result = await axios.post(`${window.location.origin}/rooms/users`, {
    friends_id: friendName,
    user: userName,
  });

  if (result.data.data) {
    alert("요청이 완료 되었습니다.");
  } else {
    alert("이미 요청하였습니다.");
  }

  window.location.href = `${window.location.origin}/rooms/users?=${userName}`;
}

// add request friends list
createUserList();

// navigation bar

const roomsTab = document.getElementById("roomsTab");
const usersTab = document.getElementById("usersTab");
const friendsTab = document.getElementById("friendsTab");
const logoutTab = document.getElementById("logoutTab");

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
      window.location.href = `${window.location.origin}/rooms/friend?id=${userName}`; //todo friends url
      break;

    case "logout":
      roomsTab.classList.remove("active");
      usersTab.classList.remove("active");
      friendsTab.classList.remove("active");
      logoutTab.classList.add("active");
      window.location.href = `${window.location.origin}/rooms?id=${userName}`; //todo logout url
      break;
  }
}
