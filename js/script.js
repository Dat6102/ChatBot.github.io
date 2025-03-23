// URL webhook Discord của bạn
const webhookURL = 'https://discord.com/api/webhooks/1282714794465427568/2FGOjbckR5uCT6NrWDrV21F83a5LD4LXsiu6tKzieA_RVHFoU8h-NEDh2eM135hl4KYJ';

// Hàm gửi điểm số đến webhook
const sendScoreToDiscord = async (score) => {
    const message = {
        content: `Người dùng đã đạt được ${score} điểm`
    };

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });

        if (response.ok) {
            console.log('Đã gửi điểm số đến Discord thành công.');
        } else {
            console.error('Lỗi khi gửi điểm số đến Discord:', response.statusText);
        }
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
    }
};

// Copyright by HETHONGCODE.COM
// Developed by Vo Nam
// FB:https://www.facebook.com/namvo.az/
// Tele/Zalo:@tannam76
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// Tạo một đối tượng hình ảnh và thiết lập nguồn của nó
const img = new Image();
img.src = "./anh/flappy-bird-set.png";
// Trạng thái trò chơi
let gamePlaying = false;
const gravity = 0.4; // Gravity applied to the bird's flight
const speed = 6; // Tốc độ di chuyển của các yếu tố trò chơi
const size = [51, 36]; // Kích thước của hình ảnh chim
const jump = -11.5; // Vận tốc thẳng đứng được áp dụng khi chim nhảy
const cTenth = canvas.width / 10; // Chiều rộng của canvas
// Biến để theo dõi trạng thái trò chơi và điểm số
let index = 0; // Chỉ mục cho animation và chuyển động nền
let bestScore = 0; // Điểm cao nhất đã đạt được trong trò chơi
let flight, flyHeight, currentScore, pipes; // Chuyển động, độ cao bay, điểm số hiện tại và mảng ống của chim
// Cài đặt đường ống
const pipeWidth = 78; // Chiều rộng của ống
const pipeGap = 270; // Khoảng cách giữa các ống
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth; // Function to calculate random pipe placement
// Thiết lập các cài đặt trò chơi
const setup = () => {
    currentScore = 0; // Đặt lại điểm số hiện tại
    flight = jump; // Khởi tạo chuyển động bay của chim
    flyHeight = canvas.height / 2 - size[1] / 2; // Đặt độ cao bay ban đầu cho chim
    pipes = Array(3).fill().map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]); // Khởi tạo vị trí của ống
};
// Hàm chính để vẽ
const render = () => {
    index++; // Tăng chỉ mục animation
    // Vẽ hình ảnh nền để tạo ảo giác chuyển động
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
    // Kiểm tra nếu trò chơi đang diễn ra
    if (gamePlaying) {
        pipes.map(pipe => {
            pipe[0] -= speed; // Di chuyển ống sang trái
            // Vẽ ống trên và dưới
            ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);
            // Kiểm tra nếu chim vượt qua một ống
            if (pipe[0] <= -pipeWidth) {
                currentScore++;
                bestScore = Math.max(bestScore, currentScore);
                // Loại bỏ và tạo một ống mới
                pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
            }
            // Kiểm tra va chạm với ống
            if ([pipe[0] <= cTenth + size[0], pipe[0] + pipeWidth >= cTenth, pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]].every(elem => elem)) {
                gamePlaying = false; // Kết thúc trò chơi
                sendScoreToDiscord(currentScore);
                setup(); // Thiết lập lại trò chơi
            }
        });
    }
    // Cập nhật vị trí của chim và vẽ nó
    if (gamePlaying) {
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
        flight += gravity; // Áp dụng trọng lực vào chuyển động bay của chim
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]); // Giới hạn độ cao bay của chim
    } else {
        // Vẽ chim ở vị trí màn hình bắt đầu
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, (canvas.width / 2) - size[0] / 2, flyHeight, ...size);
        flyHeight = canvas.height / 2 - size[1] / 2; // Đặt lại độ cao của chim
        // Vẽ văn bản màn hình bắt đầu
        ctx.fillStyle = '#0be33a';
        ctx.fillText(`Điểm cao nhất : ${bestScore}`, 85, 245);
        ctx.fillText('Click để chơi', 90, 535);
        ctx.font = "bold 30px MyFont";
    }
     // Cập nhật hiển thị điểm số
    document.getElementById('bestScore').innerHTML = `Cao nhất : ${bestScore}`;
    document.getElementById('currentScore').innerHTML = `Hiện tại : ${currentScore}`;
    // Yêu cầu trình duyệt thực hiện khung hình tiếp theo
    window.requestAnimationFrame(render);
};
// Khởi tạo cài đặt trò chơi và bắt đầu vẽ sau khi hình ảnh được tải
setup();
img.onload = render;
// Bắt đầu trò chơi khi click chuột
document.addEventListener('click', () => gamePlaying = true);
// Áp dụng nhảy khi click chuột bất kỳ
window.onclick = () => flight = jump;
// Copyright by HETHONGCODE.COM
// Developed by Vo Nam
// FB:https://www.facebook.com/namvo.az/
// Tele/Zalo:@tannam76