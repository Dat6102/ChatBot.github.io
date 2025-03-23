document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  form.addEventListener('submit', function (event) {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Kiểm tra tên người dùng và mật khẩu
    if (username === 'Nguyễn Kim Ngân' && password === '25/3/2010') {
      // Chuyển hướng đến menu.html
      window.location.href = 'menu.html';
    } else {
      // Hiển thị thông báo lỗi
      alert('Tên người dùng hoặc mật khẩu không đúng. Vui lòng thử lại.');
      // Ngăn chặn form submit
      event.preventDefault();
    }
  });
});