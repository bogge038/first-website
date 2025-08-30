// Import Firestore functions from the global window object
const { 
  collection, addDoc, onSnapshot, deleteDoc, doc, 
  query, orderBy, serverTimestamp 
} = window.firestoreExports;

const db = window.db;
const messagesRef = collection(db, "messages");

// Create a query that orders by server timestamp
const q = query(messagesRef, orderBy("createdAt", "asc"));

// Get DOM elements
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

  const x = Math.random() * (wall.offsetWidth - 150);
  const y = Math.random() * (wall.offsetHeight - 50);
  const color = `hsl(${Math.random() * 360}, 70%, 50%)`;

  await addDoc(messagesRef, { 
    name, 
    message, 
    createdAt: serverTimestamp(),  // ✅ Real timestamp
    x, y, color 
  });

  messageInput.value = "";
});

// Real-time updates
onSnapshot(q, (snapshot) => {
  wall.innerHTML = "";
  snapshot.forEach((docSnap) => {
    createBubble(docSnap.id, docSnap.data());
  });
});

// Create a bubble
function createBubble(id, { name, message, createdAt, x, y, color }) {
  const bubble = document.createElement("div");
  bubble.className = "bubble";

  // Format timestamp if available
  let timestamp = "";
  if (createdAt && createdAt.toDate) {
    timestamp = createdAt.toDate().toLocaleString();
  }

  bubble.innerHTML = `
    <span class="name">${name}</span>
    ${message}
    <span class="timestamp">${timestamp}</span>
  `;
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

  // Animate bubble movement
  animateBubble(bubble);
}

// Random bubble movement
function animateBubble(bubble) {
  let dx = (Math.random() - 0.5) * 2; // horizontal
  let dy = (Math.random() - 0.5) * 2; // vertical

  function move() {
    const rect = bubble.getBoundingClientRect();
    const wallRect = wall.getBoundingClientRect();

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
