async function searchData() {
    const keyword = document.getElementById('keyword').value.trim();

    if (!keyword) {
        alert("Vui lòng nhập từ khóa!");
        return;
    }

    const apiUrl = `https://api.tracau.vn/WBBcwnwQpV89/s/${keyword}/en`;

    const loadingElement = document.getElementById('loading');
    const dotsElement = document.getElementById('dots');
    const dotSequence = ['.', '•', '°', '•']; 
    let dotIndex = 0;

    loadingElement.style.display = 'inline-block';

    const interval = setInterval(() => {
        dotsElement.textContent = dotSequence[dotIndex]; 
        dotIndex = (dotIndex + 1) % dotSequence.length; 
    }, 500);

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const sentencesContainer = document.getElementById('sentences-container');
        sentencesContainer.innerHTML = ''; 

        if (!data.sentences || data.sentences.length === 0) {
            sentencesContainer.innerHTML = 'Không có từ này hoặc chưa cập nhật trong từ điển!';
        } else {
            data.sentences.forEach(sentence => {
                const sentenceDiv = document.createElement('div');
                sentenceDiv.classList.add('sentence');

                sentenceDiv.innerHTML = `
                    <div class="sentence-id">ID: ${sentence._id}</div>
                    <div class="translations">
                        <div><strong>English:</strong><br><p>${sentence.fields.en}</p></div>
                        <div><strong>Vietnamese:</strong><br><p>${sentence.fields.vi}</p></div>
                    </div>
                `;

                sentencesContainer.appendChild(sentenceDiv);
            });
        }
    } catch (error) {
        document.getElementById('sentences-container').innerHTML = 'Có lỗi khi tải dữ liệu.';
        console.error("Error fetching data:", error);
    } finally {
        clearInterval(interval); 
        loadingElement.style.display = 'none';
    }
}

// https://github.com/Dat6102/totenh.github.io

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('iconCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    const icons = [];
    const iconCount = 50; 
    const iconList = ['💭','🌐','📖','📚','🗣️','🌎'];

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Icon {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100; 
            this.size = Math.random() * 30 + 20; 
            this.speed = Math.random() * 1 + 0.5; 
            this.char = iconList[Math.floor(Math.random() * iconList.length)];
        }

        update() {
            this.y -= this.speed;
            if (this.y < -50) { 
                this.reset();
            }
        }

        draw() {
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.char, this.x, this.y);
        }
    }

    function setupIcons() {
        for (let i = 0; i < iconCount; i++) {
            icons.push(new Icon());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        icons.forEach(icon => {
            icon.update();
            icon.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    setupIcons();
    animate();
});
