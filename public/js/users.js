const userName = window.location.href.split("=")[1];

// Dummy data for user list
const usersData = [
  { id: 1, username: "user1", joinDate: "2023-01-01", friendCount: 3 },
  { id: 2, username: "user2", joinDate: "2023-01-02", friendCount: 5 },
  { id: 3, username: "user3", joinDate: "2023-01-03", friendCount: 2 },
  // Add more user data as needed
];

// Function to create user list HTML
async function createUserList(users) {
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
          <button onclick="sendFriendRequest(${user.id})">Send Friend Request</button>
        `;

    userContainer.appendChild(userDiv);
  });
}

// Function to simulate sending a friend request
function sendFriendRequest(userId) {
  // You can implement the logic to send a friend request here
  console.log(`Friend request sent to user with ID ${userId}`);
}

// Initially create user list with dummy data
createUserList(usersData);

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
      window.location.href = `rooms?id=${userName}`; //todo friends url
      break;

    case "logout":
      roomsTab.classList.remove("active");
      usersTab.classList.remove("active");
      friendsTab.classList.remove("active");
      logoutTab.classList.add("active");
      window.location.href = `rooms?id=${userName}`; //todo logout url
      break;
  }
}
