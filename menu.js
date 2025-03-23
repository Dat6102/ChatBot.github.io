const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
let width, height;
const hearts = [];
const glitterParticles = [];
const heartCount = 50; // Số lượng trái tim
const glitterCount = 100; // Số lượng hạt lấp lánh

// Các biểu tượng trái tim và đường viền trái tim để sử dụng
const heartIcons = ['💖', '💗', '❤️', '🩷', '💝', '💘', '💓', '💕'];

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

function interpolateColor(color1, color2, factor) {
    const r = Math.round(color1[0] + factor * (color2[0] - color1[0]));
    const g = Math.round(color1[1] + factor * (color2[1] - color1[1]));
    const b = Math.round(color1[2] + factor * (color2[2] - color1[2]));
    return `rgb(${r}, ${g}, ${b})`;
}

function randomColor() {
    const color1 = [255, 0, 251]; // #ff00fb
    const color2 = [255, 0, 0];   // #ff0000
    const factor = Math.random(); // Hệ số ngẫu nhiên giữa 0 và 1
    return interpolateColor(color1, color2, factor);
}

function drawIcon(x, y, scale, color, icon) {
    ctx.font = `${scale * 30}px CustomFont`; // Kích thước font phụ thuộc vào scale
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(icon, x, y);
}

function drawHeartBorder(x, y, scale, color) {
    ctx.beginPath();
    for (let t = 0; t <= 2 * Math.PI; t += 0.01) {
        let xOffset = 16 * Math.pow(Math.sin(t), 3);
        let yOffset = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

        xOffset *= scale;
        yOffset *= scale;

        xOffset += x;
        yOffset = y - yOffset;

        if (t === 0) {
            ctx.moveTo(xOffset, yOffset);
        } else {
            ctx.lineTo(xOffset, yOffset);
        }
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawGlitter(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Màu trắng lấp lánh
    ctx.fill();
}

class Heart {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100; // Bắt đầu dưới màn hình
        this.scale = Math.random() * 1.5 + 0.5;
        this.speed = Math.random() * 2 + 1; // Tốc độ từ 1 đến 3
        this.color = randomColor(); // Màu ngẫu nhiên cho mỗi trái tim
        this.icon = heartIcons[Math.floor(Math.random() * heartIcons.length)]; // Biểu tượng ngẫu nhiên
        this.hasIcon = Math.random() > 0.5; // Ngẫu nhiên quyết định hiển thị biểu tượng hay không
    }

    update() {
        this.y -= this.speed;
        if (this.y < -50) { // Đặt lại vị trí nếu trái tim vượt qua màn hình
            this.reset();
        }
    }

    show() {
        if (this.hasIcon) {
            drawIcon(this.x, this.y, this.scale, this.color, this.icon);
        } else {
            drawHeartBorder(this.x, this.y, this.scale, this.color);
        }
    }
}

class GlitterParticle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.life = Math.random() * 20 + 10; // Thời gian sống ngẫu nhiên
    }

    update() {
        this.life -= 1;
        if (this.life <= 0) {
            this.reset();
        }
    }

    show() {
        drawGlitter(this.x, this.y);
    }
}

function setupHearts() {
    for (let i = 0; i < heartCount; i++) {
        hearts.push(new Heart());
    }
}

function setupGlitterParticles() {
    for (let i = 0; i < glitterCount; i++) {
        glitterParticles.push(new GlitterParticle());
    }
}

function updateTextOverlay() {
    const urlParams = new URLSearchParams(window.location.search);
    const text = urlParams.get('id') || ''; // Lấy giá trị 'id' từ URL
    const textOverlay = document.getElementById('textOverlay');
    textOverlay.innerHTML = ''; // Xóa nội dung hiện tại
    for (const char of text) {
        const span = document.createElement('span');
        span.textContent = char;
        // Thêm độ trễ ngẫu nhiên cho hiệu ứng nổi lên
        span.style.animationDelay = `${Math.random() * 2}s`;
        textOverlay.appendChild(span);
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let heart of hearts) {
        heart.update();
        heart.show();
    }
    for (let glitter of glitterParticles) {
        glitter.update();
        glitter.show();
    }
    requestAnimationFrame(draw);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
setupHearts();
setupGlitterParticles();
updateTextOverlay(); // Cập nhật văn bản từ URL
draw();

function navigateTo(page) {
    switch(page) {
        case 'home':
            window.location.href = 'count.html';
            break;
        case 'about':
            window.location.href = 'qua.html';
            break;
        case 'products':
            window.location.href = 'trochoi.html';
            break;
        case 'contact':
            window.location.href = 'ai.html';
            break;
        default:
            console.log('Trang không tồn tại.');
    }
}