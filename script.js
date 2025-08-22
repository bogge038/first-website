const form = document.getElementById('messageForm');
const nameInput = document.getElementById('nameInput');
const messageInput = document.getElementById('messageInput');
const wall = document.getElementById('wall');

let scale = 1; // zoom level

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    if (!name || !message) return;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    // Bubble content: name, message, timestamp
    const timestamp = new Date().toLocaleString();
    bubble.innerHTML = `<span class="name">${name}</span>${message}<span class="timestamp">${timestamp}</span>`;

    // Save author name as dataset for deletion check
    bubble.dataset.author = name;

    // Random start position
    bubble.style.left = Math.random() * (wall.scrollWidth - 150) + 'px';
    bubble.style.top = Math.random() * (wall.scrollHeight - 50) + 'px';

    // Random bubble color
    bubble.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;

    // Add click event for deletion
    bubble.addEventListener('click', () => {
        if (nameInput.value.trim() === bubble.dataset.author) {
            bubble.remove();
        } else {
            alert("You can only delete your own bubbles!");
        }
    });

    wall.appendChild(bubble);
    messageInput.value = '';

    driftBubble(bubble);
});

function driftBubble(bubble) {
    let x = parseFloat(bubble.style.left);
    let y = parseFloat(bubble.style.top);

    let dx = (Math.random() - 0.5) * 2; // drift speed
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

// Zoom functionality with mouse wheel
wall.addEventListener('wheel', function(e) {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(0.5, scale), 3);
    wall.style.transform = `scale(${scale})`;
});
