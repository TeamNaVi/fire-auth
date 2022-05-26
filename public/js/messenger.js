const db = firebase.database();
const fetchChat = db.ref("messages/");
document.getElementById("message-form").addEventListener("submit", sendMessage);
const auth = firebase.auth();
// init system

auth.onAuthStateChanged((user) => {
  userUid = user.uid;
  userEmail = user.email;
  userName = user.displayName;
});

function sendMessage(e) {
  e.preventDefault();

  // get values to be submitted
  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  // clear the input box
  messageInput.value = "";

  //auto scroll to bottom
  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  // create db collection and send in the data
  db.ref("messages/" + timestamp).set({
    userName,
    message,
  });
}
fetchChat.on("child_added", function (snapshot) {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const dateDisplay =
    date.getFullYear() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes();
  const messages = snapshot.val();
  const message = `<li class=${
    userName === messages.userName ? "sent" : "receive"
  }><div><div class="talkdiv"><span><span class="userName">${
    messages.userName
  }: </span>${messages.message}</span></div><div>시간</div></div></li>`;
  // append the message on the page
  document.getElementById("messages").innerHTML += message;
});
