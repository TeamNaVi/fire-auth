const db = firebase.database();
document.getElementById("message-form").addEventListener("submit", sendMessage);
const auth = firebase.auth();
var fetchChat = db.ref("messages/");

var firestore = firebase.firestore();
var selectedUU = null;
// 메신저 편집220526
const profileImg = document.getElementById("profile-img");
const selectbox = document.querySelector("#selectbox");

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
  db.ref("messages/" + selectedUU + "/" + timestamp).set({
    userName,
    message,
  });
}

getAllUsers = function () {
  html = `
      <select id="selectbox" name="selectbox" onchange="handleOnChange(this)">
      <option value="" selected disabled>업체 선택</option>
        `;

  selectbox.insertAdjacentHTML("beforeend", html);

  firestore //데이터베이스
      .collection("users") //데이터베이스 저장소
      .get()
      .then((data) => {
        data.forEach((element) => {
          showListUser(element.data().co, element.data().uid);
        });
        $("#selectbox").change(function(){
          selectedUU = $(this).val();
          console.log(selectedUU)
          document.getElementById("main-chat").innerHTML = "" ; //초기화

          fetchChat = db.ref("messages/" + selectedUU + "/");
          fetchChat.on("child_added", function (snapshot) {
            const timestamp = parseInt(snapshot.key);
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
    <time datetime="09:00:00+09:00"> 시간${dateDisplay}</time>
  </div>`;

            // append the message on the page
            document.getElementById("main-chat").innerHTML += message;
          });
        })

      });

  selectbox.innerHTML+="</select>";
};
// function show list of files
showListUser = function (corporation, listUid) {
  html = `
    <option value="%listUid%">%listCorporation%</option>
    `;
  newHtml = html.replace("%listUid%", listUid);
  newHtml = newHtml.replace("%listCorporation%", corporation);
  selectbox.insertAdjacentHTML("beforeend", newHtml);
};


getAllUsers();
