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

// Real-time updates
onSnapshot(messagesRef, (snapshot) => {
  wall.innerHTML = "";
  snapshot.forEach((docSnap) => {
    createBubble(docSnap.id, docSnap.data());
  });
});

// Create a bubble
function createBubble(id, { name, message, timestamp, x, y, color }) {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = `<span class="name">${name}</span>${message}<span class="timestamp">${timestamp}</span>`;
  bubble.style.left = `${x}px`;
  bubble.style.top = `${y}px`;
  bubble.style.backgroundColor = color;

  // Allow deletion by same-name user
  bubble.addEventListener("click", async () => {
    if (nameInput.value.trim() === name) {
      await deleteDoc(doc(db, "messages", id));
    } else {
      alert("You can only delete your own bubbles!");
    }
  });

  wall.appendChild(bubble);

  // Random movement
  animateBubble(bubble);
}

function animateBubble(bubble) {
  let dx = (Math.random() - 0.5) * 2; // random horizontal movement
  let dy = (Math.random() - 0.5) * 2; // random vertical movement

  function move() {
    let rect = bubble.getBoundingClientRect();
    let wallRect = wall.getBoundingClientRect();

    let left = parseFloat(bubble.style.left);
    let top = parseFloat(bubble.style.top);

    if (left <= 0 || left + rect.width >= wallRect.width) dx *= -1;
    if (top <= 0 || top + rect.height >= wallRect.height) dy *= -1;

    bubble.style.left = `${left + dx}px`;
    bubble.style.top = `${top + dy}px`;

    requestAnimationFrame(move);
  }
  move();
}
