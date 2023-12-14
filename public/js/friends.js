const userName = window.location.href.split("=")[1];

// friends.js

// Mock data for demonstration purposes
const friendsData = [
  { id: "friend1", joinDate: "2023-01-01", status: "pending" },
  { id: "friend2", joinDate: "2023-02-01", status: "accepted" },
  // Add more friend data as needed
];

document.addEventListener("DOMContentLoaded", function () {
  renderFriends(friendsData);
});

function renderFriends(friends) {
  const friendsContainer = document.getElementById("friendsContainer");
  friendsContainer.innerHTML = "";

  friends.forEach((friend) => {
    const friendDiv = document.createElement("div");
    friendDiv.classList.add("friend");
    friendDiv.innerHTML = `
            <p>ID: ${friend.id}</p>
            <p>가입 날짜: ${friend.joinDate}</p>
            ${renderButtons(friend.status)}
        `;

    friendsContainer.appendChild(friendDiv);
  });
}

function renderButtons(status) {
  if (status === "pending") {
    return `
            <button class="accept-btn" onclick="acceptFriendRequest()">수락</button>
            <button class="reject-btn" onclick="rejectFriendRequest()">거절</button>
        `;
  } else if (status === "accepted") {
    return `
            <button class="remove-btn" onclick="removeFriend()">친구 삭제</button>
            <button class="dm-btn" onclick="sendDirectMessage()">DM</button>
        `;
  }

  return "";
}

function acceptFriendRequest() {
  // Logic for accepting friend request
  console.log("Friend request accepted!");
}

function rejectFriendRequest() {
  // Logic for rejecting friend request
  console.log("Friend request rejected!");
}

function removeFriend() {
  // Logic for removing friend
  console.log("Friend removed!");
}

function sendDirectMessage() {
  // Logic for sending direct message
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
