// Get Firestore exports from index.html
const { collection, addDoc, onSnapshot, deleteDoc, doc } = window.firestoreExports;
const db = window.db;
const messagesRef = collection(db, "messages");

const form = document.getElementById("messageForm");
const nameInput = document.getElementById("nameInput");
const messageInput = document.getElementById("messageInput");
const wall = document.getElementById("wall");

// Submit a new message
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  if (!name || !message) return;

  const timestamp = new Date().toLocaleString();
  const x = Math.random() * (wall.offsetWidth - 150);
  const y = Math.random() * (wall.offsetHeight - 50);
  const color = `hsl(${Math.random() * 360}, 70%, 50%)`;

  await addDoc(messagesRef, { name, message, timestamp, x, y, color });
  messageInput.value = "";
});

// Real-time updates from Firestore
onSnapshot(messagesRef, (snapshot) => {
  wall.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    createBubble(docSnap.id, data);
  });
});

// Create a bubble
function createBubble(id, { name, message, timestamp, x, y, color }) {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = `<span class="name">${name}</span>${message}<span class="timestamp">${timestamp}</span>`;
  bubble.style.left = x + "px";
  bubble.style.top = y + "px";
  bubble.style.backgroundColor = color;

  bubble.addEventListener("click", async () => {
    if (nameInput.value.trim() === name) {
      await deleteDoc(doc(db, "messages", id));
    } else {
      alert("You can only delete your own bubbles!");
    }
  });

  wall.appendChild(bubble);
}
