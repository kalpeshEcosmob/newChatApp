const socket = io('http://localhost:3100');
const sendContainer = document.getElementById('send-container');
const sendMessage = document.getElementById('send-message');
const recieveContainer = document.getElementById('recieve-container')
const senderId = document.getElementById('senderName').getAttribute('value');
const recieverId = document.getElementById('recieverName').getAttribute('value');
const senderUserId = document.getElementById('senderUserId').getAttribute('value');
const recieverUserId = document.getElementById('recieverUserId').getAttribute('value');

const data = document.getElementById('name').getAttribute('value');

console.log("username", senderId);
console.log("senderUserId", senderUserId);
console.log("username1", recieverId);

console.log('data is =================>')
socket.emit('data',"data");

appendMessage(`Sender is ${senderId} `, 'right');

socket.emit('send-user-name', { name: senderId });

if (data.length > 2) {
    const parsedData = JSON.parse(data);
    const localUSer = localStorage.getItem("userId");
    parsedData.map(item => appendMessage(localUSer === item.senderUserId ? `You : ${item.message} ` : `${recieverId} : ${item.message}`, localUSer === item.senderUserId ? "right" : "left"))
}

socket.on('message', data => {
    appendMessage(` ${data.name}  : ${data.message}`, 'left')
})

// socket.on('username', x => {
//     console.log('username', x)
//     appendMessage(`${x} is online`, 'left');
// })

sendContainer.addEventListener('submit', e => {
    e.preventDefault();
    const message = sendMessage.value;
    console.log('message', message);
    socket.emit('send-message', { message: message, senderId: senderId, recieverId: recieverId, senderUserId: senderUserId, recieverUserId: recieverUserId });
    appendMessage(`You : ${message}`, 'right');
    sendMessage.value = '';
})

function appendMessage(message, position) {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message")
    messageElement.classList.add("container")
    messageElement.classList.add(position)
    recieveContainer.append(messageElement)
}

