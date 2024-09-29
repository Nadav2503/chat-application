const sendBtn = document.getElementById("sendBtn");
const messageElement = document.getElementById("text-field");
const userNameInput = document.getElementById("username");
const chatDiv = document.getElementById('chat');
userNameInput.value = sessionStorage.getItem("username") || "";
sendBtn.disabled = true;

try {
    const socket = io("http://localhost:8181");
    socket.on("message received", (message) => {
        printMessage(message);
    });

    socket.on("recoverHistory", (history) => {
        history.forEach(printMessage);
    });

    messageElement.addEventListener("input", () => {
        sendBtn.disabled = messageElement.value.trim() === "";
    });

    sendBtn.addEventListener("click", () => {
        const message = {
            content: messageElement.value,
            username: userNameInput.value || "Anonymous",
            time: new Date().toISOString()
        };

        try {
            socket.emit("message sent", message);
        } catch (err) {
            console.log("Error during sending the message:", err);
        }

        messageElement.value = "";
        sendBtn.disabled = true;
        messageElement.focus();
    });
} catch (err) {
    console.log("Error during connection:", err);
}

function printMessage(msg) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("message");

    if (msg.username === userNameInput.value) {
        newDiv.classList.add("msgOut");
    } else {
        newDiv.classList.add("msgIn");
    }

    const p = document.createElement("p");
    p.innerText = msg.content;

    const div1 = document.createElement("div");
    div1.innerText = msg.username;
    div1.className = "msgHeader";

    const div2 = document.createElement("div");
    const currentTimeSent = new Date(msg.time).toLocaleTimeString();
    div2.innerText = currentTimeSent;
    div2.className = "msgTime";

    newDiv.appendChild(div1);
    newDiv.appendChild(p);
    newDiv.appendChild(div2);
    chatDiv.appendChild(newDiv);
}

userNameInput.addEventListener("input", () => {
    sessionStorage.setItem("username", userNameInput.value);
});
