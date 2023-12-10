const socket = io.connect(`${window.location.href}`); // room 분기 처리

document.addEventListener("DOMContentLoaded", function () {
  const messageInput = document.getElementById("messageInput");
  const chatContainer = document.getElementById("chatContainer");

  function sendMessage() {
    const message = messageInput.value.trim();
    if (message !== "") {
      // Add the message to the chat container
      socket.emit("roomChat", message);
      appendMessage("You", message, "sent");
      // Here you can implement the logic to send the message to the server
      console.log(`Message sent: ${message}`);

      // Clear the input field after sending the message
      messageInput.value = "";
    }
  }

  function appendMessage(user, message, action) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message");
    messageElement.innerHTML = `<strong>${user}</strong> ${action}: ${message}`;
    chatContainer.appendChild(messageElement);

    // Automatically scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function userJoined() {
    // Add a system message to indicate user joining
    appendMessage("User", "joined the room", "has");
  }

  // Attach the event listener to the Send button
  const sendButton = document.getElementById("sendButton");
  const messageElement = document.createElement("div");
  if (sendButton) {
    messageElement.classList.add("chat-message");
    socket.on("roomChat", (msg) => {
      console.log("message", msg);
      messageElement.innerHTML = `<strong>상대방</strong> receive: ${msg}`;
      chatContainer.appendChild(messageElement);
    });
    sendButton.addEventListener("click", sendMessage);
  }

  // Simulate a user joining the room on page load
  userJoined();
});
