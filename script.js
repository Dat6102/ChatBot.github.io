document.getElementById('birthdayForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const webhookURL = 'https://discord.com/api/webhooks/1282714794465427568/2FGOjbckR5uCT6NrWDrV21F83a5LD4LXsiu6tKzieA_RVHFoU8h-NEDh2eM135hl4KYJ';
    const name = document.getElementById('name').value.trim() || 'Ẩn danh';
    const wish = document.getElementById('wish').value.trim();
    const imageInput = document.getElementById('image');
    const timestamp = new Date().toISOString();

    if (!wish) {
        alert('Vui lòng nhập lời chúc.');
        return;
    }

    // Hiển thị thông báo "Đang xử lý, đợi một chút..."
    showToast('Đang xử lý, đợi một chút...', 'fa fa-spinner fa-spin');

    const formData = new FormData();
    formData.append('username', name);
    formData.append('content', `${wish}\n${timestamp}`);

    if (imageInput.files[0]) {
        formData.append('file', imageInput.files[0]);
    }

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showToast('Lời chúc của bạn đã được gửi thành công!', 'fa fa-check-circle');
            document.getElementById('birthdayForm').reset();
        } else {
            showToast('Đã xảy ra lỗi khi gửi lời chúc. Vui lòng thử lại.', 'fa fa-exclamation-circle');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        showToast('Đã xảy ra lỗi khi gửi lời chúc. Vui lòng thử lại.', 'fa fa-exclamation-circle');
    }
});

// Hàm hiển thị thông báo
function showToast(message, iconClass) {
    const notifications = document.querySelector('.notifications');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
    notifications.appendChild(toast);

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    var audio = document.getElementById('background-music');

        // Hàm phát nhạc
    function playAudio() {
        audio.play();
            // Xóa sự kiện sau khi phát nhạc để tránh lặp lại
        document.removeEventListener('click', playAudio);
    }

        // Lắng nghe sự kiện click của người dùng để bắt đầu phát nhạc
    document.addEventListener('click', playAudio);
});
