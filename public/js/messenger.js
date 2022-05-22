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
    const messages = snapshot.val();
    const message = `<li class=${
        userName === messages.userName ? "sent" : "receive"
    }><span>${messages.userName}: </span>${messages.message}</li>`;
    // append the message on the page
    document.getElementById("messages").innerHTML += message;
});
