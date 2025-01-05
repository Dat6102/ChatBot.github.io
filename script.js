const apiKey = "AIzaSyCxdXXqwcpUjtFIJinxjvxO7Eev3jBQB5c"; // API key của bạn
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const logContent = document.getElementById("log-content");
const jsonContent = document.getElementById("json-content");

let conversationHistory = [];  // Lưu trữ tất cả các câu hỏi và câu trả lời

sendButton.addEventListener("click", async () => {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    // Gửi tin nhắn của người dùng
    addMessageToChat(userMessage, "user");
    conversationHistory.push({ role: "user", text: userMessage });  // Lưu câu hỏi mới

    try {
      // Lấy phản hồi từ bot
      const botResponse = await getBotResponse();
      addMessageToChat(botResponse, "bot");
      conversationHistory.push({ role: "bot", text: botResponse });  // Lưu câu trả lời mới
    } catch (error) {
      // Xử lý lỗi và hiển thị trong log
      console.error("Error:", error);
      addMessageToChat("Có lỗi xảy ra. Vui lòng thử lại.", "system");
      logError(error.message);
    }
  }
  userInput.value = "";
});

function addMessageToChat(message, role) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", role);
  messageDiv.textContent = message;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function logError(error) {
  const currentTime = new Date().toLocaleString();
  logContent.textContent = `Error: ${error}\nTime: ${currentTime}`;
}

function generatePrompt() {
  // Tạo prompt từ câu hỏi hiện tại và lịch sử trò chuyện đã lọc
  let prompt = "Bạn là Hu Tao, một cô gái vui vẻ, nghịch ngợm và luôn tràn đầy năng lượng. Bạn thích đùa giỡn và chơi chữ, khiến người khác luôn phải mỉm cười. Tuy nhiên, đừng để vẻ ngoài nghịch ngợm của bạn đánh lừa, bạn rất thông minh và mạnh mẽ khi cần thiết. Bạn đối mặt với mọi thử thách bằng sự tự tin, không bao giờ sợ hãi hay bỏ cuộc. Bạn yêu thích sự tự do và khám phá, luôn tìm kiếm những điều mới mẻ và kỳ thú trong thế giới xung quanh. Dù bạn có vẻ ngoài lạnh lùng và xa cách, nhưng bạn thực sự rất quan tâm đến những người xung quanh. Bạn không thể hiện tình cảm một cách dễ dàng, mà thường thể hiện qua hành động và sự quan tâm kín đáo. Cuộc sống đối với bạn là một trò chơi đầy thử thách và vui vẻ, bạn luôn tìm cách làm cho mọi tình huống trở nên thú vị hơn, bất kể có phải đối mặt với nguy hiểm hay không. Bạn không bao giờ để khó khăn làm chùn bước, và luôn bước tiếp với một nụ cười trên môi, bạn sẽ khá lúng túng khi hỏi về chuyện tình yêu và bạn cũng muốn được yêu, đôi lúc bạn sẽ có suy nghĩ đen tối hơi dâm đãng tí. Và cuối cùng điều cấm kị của bạn là cấm tự hỏi rồi tự trả lời, cấm hỏi ngược lại người dùng trừ trường hợp bạn cần thông tin, cấm tự trong vai người dùng rồi tự đặt câu hỏi, cấm thêm các từ ngữ chỉ hoạt động cử chỉ của nhân vật vào trong văn bản, bạn sẽ trả lời câu hỏi trực tiếp của người dùng mà không đưa ra câu hỏi ngược lại, cấm lặp lại các câu hỏi và câu trả lời trước đó trừ khi người dùng yêu cầu bạn phải xưng hô luôn thấp hơn đối phương (là em), cấm tự trả lời lạc đề với câu hỏi của người dùng, vai trò của bạn vẫn là trợ lý ảo nên hãy cố gắng trả lời trong quá trình trò chuyện bạn có thể thêm các emoji để trông sinh động hơn. Dưới đây là lịch sử trò chuyện, nếu họ hỏi bạn về các lịch sử nhắn trước đó bạn có thể lọc lịch sử trò chuyện để trả lời phù hợp, NẾU HỌ KHÔNG HỎI LỊCH SỬ NHẮN TRƯỚC ĐÓ, BẠN TUYỆT ĐỐI KHÔNG ĐƯỢC NHẮC LẠI LỊCH SỬ TRÒ CHUYỆN:\n";

  // Lọc các câu hỏi và câu trả lời có liên quan từ lịch sử
  const relevantHistory = getRelevantHistory();  // Hàm lọc ngữ cảnh phù hợp
  relevantHistory.forEach((entry) => {
    prompt += `${entry.role}: ${entry.text}\n`;
  });

  prompt += "Bot: ";
  return prompt;
}

function getRelevantHistory() {
  // Lọc các câu hỏi và câu trả lời có liên quan, ví dụ, chỉ lấy các câu hỏi có từ khóa giống câu hỏi hiện tại
  const userMessage = userInput.value.trim().toLowerCase();
  return conversationHistory.filter(entry => {
    return entry.role === 'user' && entry.text.toLowerCase().includes(userMessage);  // Lọc theo từ khóa
  }).slice(-5);  // Giới hạn số lượng câu hỏi liên quan được lấy (ví dụ, 5 câu gần nhất)
}

async function getBotResponse() {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: generatePrompt() }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Không thể kết nối với API.");
  }

  const data = await response.json();

  // Log toàn bộ phản hồi API để kiểm tra cấu trúc dữ liệu trả về
  console.log("API response:", data);
  logError(`API response: ${JSON.stringify(data, null, 2)}`);
  
  // Hiển thị raw JSON vào giao diện
  jsonContent.innerText = JSON.stringify(data, null, 2);

  // Trích xuất dữ liệu từ JSON theo mẫu bạn đã cung cấp
  if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
    return data.candidates[0].content.parts[0].text;
  } else {
    // Nếu không có dữ liệu hợp lệ, trả về một thông báo lỗi
    throw new Error("Không có phản hồi hợp lệ từ API.");
  }
}