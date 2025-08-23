// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🔥 Your Firebase Config (replace with your own from Firebase console)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById('messageForm');
const nameInput = document.getElementById('nameInput');
const messageInput = document.getElementById('messageInput');
const wall = document.getElementById('wall');

// Add a new bubble to Firestore
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  if (!name || !message) return;

  const timestamp = new Date().toLocaleString();
  const x = Math.random() * (wall.offsetWidth - 150);
  const y = Math.random() * (wall.offsetHeight - 50);
  const color = `hsl(${Math.random() * 360}, 70%, 50%)`;

  await addDoc(collection(db, "bubbles"), { name, message, timestamp, x, y, color });
  messageInput.value = '';
});

// Create bubble element
function createBubble(id, name, message, timestamp, x, y, color) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = `<span class="name">${name}</span>${message}<span class="timestamp">${timestamp}</span>`;
  bubble.style.left = x + 'px';
  bubble.style.top = y + 'px';
  bubble.style.backgroundColor = color;

  bubble.addEventListener('click', async () => {
    if (nameInput.value.trim() === name) {
      await deleteDoc(doc(db, "bubbles", id));
    } else {
      alert("You can only delete your own bubbles!");
    }
  });

  wall.appendChild(bubble);
  driftBubble(bubble);
}

// Animate bubbles
function driftBubble(bubble) {
  let x = parseFloat(bubble.style.left);
  let y = parseFloat(bubble.style.top);
  let dx = (Math.random() - 0.5) * 2;
  let dy = (Math.random() - 0.5) * 2;

  function move() {
    x += dx;
    y += dy;
    if (x < 0 || x > wall.offsetWidth - bubble.offsetWidth) dx = -dx;
    if (y < 0 || y > wall.offsetHeight - bubble.offsetHeight) dy = -dy;
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
    requestAnimationFrame(move);
  }
  move();
}

// Listen for real-time Firestore updates
onSnapshot(collection(db, "bubbles"), (snapshot) => {
  wall.innerHTML = '';
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    createBubble(docSnap.id, data.name, data.message, data.timestamp, data.x, data.y, data.color);
  });
});
