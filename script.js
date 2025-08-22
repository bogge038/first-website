const form = document.getElementById('messageForm');
const nameInput = document.getElementById('nameInput');
const messageInput = document.getElementById('messageInput');
const wall = document.getElementById('wall');

let scale = 1; // zoom level

// Load saved bubbles from localStorage on startup
window.addEventListener('load', () => {
    const savedBubbles = JSON.parse(localStorage.getItem('bubbles')) || [];
    savedBubbles.forEach(data => {
        createBubble(data.name, data.message, data.timestamp, data.x, data.y, data.color, false);
    });
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    if (!name || !message) return;

    const timestamp = new Date().toLocaleString();
    const x = Math.random() * (wall.scrollWidth - 150);
    const y = Math.random() * (wall.scrollHeight - 50);
    const color = `hsl(${Math.random() * 360}, 70%, 50%)`;

    createBubble(name, message, timestamp, x, y, color, true);

    messageInput.value = '';
});

// Create and animate a bubble
function createBubble(name, message, timestamp, x, y, color, save) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = `<span class="name">${name}</span>${message}<span class="timestamp">${timestamp}</span>`;
    bubble.dataset.author = name;

    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
    bubble.style.backgroundColor = color;

    // Delete bubble if it's yours
    bubble.addEventListener('click', () => {
        if (nameInput.value.trim() === bubble.dataset.author) {
            bubble.remove();
            removeBubbleFromStorage(name, message, timestamp);
        } else {
            alert("You can only delete your own bubbles!");
        }
    });

    wall.appendChild(bubble);
    driftBubble(bubble);

    if (save) {
        saveBubbleToStorage({ name, message, timestamp, x, y, color });
    }
}

// Animate bubbles drifting
function driftBubble(bubble) {
    let x = parseFloat(bubble.style.left);
    let y = parseFloat(bubble.style.top);

    let dx = (Math.random() - 0.5) * 2;
    let dy = (Math.random() - 0.5) * 2;

    function move() {
        x += dx;
        y += dy;

        if (x < 0 || x > wall.scrollWidth - bubble.offsetWidth) dx = -dx;
        if (y < 0 || y > wall.scrollHeight - bubble.offsetHeight) dy = -dy;

        bubble.style.left = x + 'px';
        bubble.style.top = y + 'px';

        requestAnimationFrame(move);
    }
    move();
}

// Save bubble to localStorage
function saveBubbleToStorage(bubbleData) {
    const bubbles = JSON.parse(localStorage.getItem('bubbles')) || [];
    bubbles.push(bubbleData);
    localStorage.setItem('bubbles', JSON.stringify(bubbles));
}

// Remove bubble from localStorage
function removeBubbleFromStorage(name, message, timestamp) {
    let bubbles = JSON.parse(localStorage.getItem('bubbles')) || [];
    bubbles = bubbles.filter(b => !(b.name === name && b.message === message && b.timestamp === timestamp));
    localStorage.setItem('bubbles', JSON.stringify(bubbles));
}

// Zoom functionality
wall.addEventListener('wheel', function(e) {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(0.5, scale), 3);
    wall.style.transform = `scale(${scale})`;
});
