document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử HTML để hiển thị thời gian
    const daysElement = document.getElementById('dd');
    const hoursElement = document.getElementById('hr');
    const minutesElement = document.getElementById('min');
    const secondsElement = document.getElementById('sec');

    // Thiết lập thời điểm bắt đầu (ví dụ: ngày 1 tháng 1 năm 2025)
    const startDate = new Date("October 13, 2024 19:05:19").getTime();

    // Hàm cập nhật đồng hồ
    function updateClock() {
        const now = new Date().getTime(); // Thời gian hiện tại
        const timeElapsed = now - startDate; // Thời gian đã trôi qua

        // Tính toán số ngày, giờ, phút và giây đã trôi qua
        const days = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeElapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);

        // Cập nhật nội dung các phần tử HTML
        daysElement.textContent = days;
        hoursElement.textContent = hours;
        minutesElement.textContent = minutes;
        secondsElement.textContent = seconds;
    }

    // Gọi hàm để cập nhật ngay lập tức khi trang được tải
    updateClock();

    // Cập nhật đồng hồ mỗi giây
    setInterval(updateClock, 1000);
});