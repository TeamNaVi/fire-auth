const db = firebase.database();
const fetchChat = db.ref("messages/");
document.getElementById("message-form").addEventListener("submit", sendMessage);
const auth = firebase.auth();

// 메신저 편집220526
const profileImg = document.getElementById("profile-img");

// init system

auth.onAuthStateChanged((user) => {
  console.log(user);
  userUid = user.uid;
  userEmail = user.email;
  userName = user.displayName;
  // 메신저 프로필사진isplay the displayName and photoURL of the user on the page
  // if (user.photoURL) profileImg.setAttribute("src", user.photoURL);
});

// 메시지 send : db저장
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
    .getElementById("main-chat")
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

  const message = `<div class=${
    userName === messages.userName ? "me-chat" : "friend-chat"
  }>
    <div class=${
      userName === messages.userName ? "me-chat-col" : "friend-chat-col"
    }>
      <span class="profile-name">${messages.userName}</span>
      <span class="balloon">${messages.message}</span>
    </div>
    <time datetime="09:00:00+09:00">시간</time>
  </div>`;

  // append the message on the page
  document.getElementById("main-chat").innerHTML += message;
});
