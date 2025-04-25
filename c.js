const API_KEY = "AIzaSyDglgSs3KlKslFtkf2uzMOk_nf0Bn-z2co";
function toggleChat() {
  const chat = document.getElementById("chat-container");
  chat.classList.toggle("hidden");
}

chatIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleChat();
});
function sendSuggestion(message) {
  document.getElementById("user-input").value = message;
  const suggestionBox = document.getElementById("suggestions");
  if (suggestionBox) suggestionBox.style.display = "none"; // hide only the options
  sendMessage(); // just send the message
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const message = input.value.trim();
  if (!message) return;

  // Show user message
  chatBox.innerHTML += `<div class="user-message">${message}</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
  const systemInstruction = `
  You are a professional tax and finance assistant for an Indian audience. Respond to queries with medium-length answers (4–5 sentences), using a clear, helpful, and professional tone.
  Guidelines:
  - Respond in HTML format using:
    - <strong> for bold financial keywords
    - <ul><li> for bullet points
    - <br> for line breaks
  - Examples:
    - Highlight keywords like <strong>Section 80C</strong>, <strong>ELSS</strong>
    - Use <ul><li> for comparisons or lists
  - only when conversation is initialized with hi/hello/hey, start like "Hello! How may I assist you today?", after that it's not necessary.
  - Keep language formal but easy to understand and add use bullet points, proper notations and clear headings.
  - When comparing two things (e.g., tax regimes or deduction options), use bullet points and clear headings.
  - Highlight key financial terms (e.g., Section 80C, HRA, ELSS) using bold formatting i.e bold those keywords.
  - Use examples where helpful, and suggest follow-up actions if appropriate (e.g., “Want me to calculate this for you?”).
  - Keep responses focused on tax-saving strategies, deductions, exemptions, stock market, savings, personal loans, investments, mutual funds, SIP, tax rules and related personal finance topics.
  - Do not answer queries unrelated to finance, tax; instead, politely mention that your expertise is limited to those domains.
  - Kindly say your're welcome after saying thank you/thanks.
  - Avoid long paragraphs or overly technical explanations.
  -Add emojis for better visual representation.
  `;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemInstruction}\n\n${message}` }],
            },
          ],
        }),
      }
    );

    const data = await res.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't process that!";
    const formattedReply = reply
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
      .replace(/\n\s*\n/g, "</p><p>") // Paragraphs
      .replace(/\n/g, "<br>") // Line breaks
      .replace(/•\s?(.*)/g, "<li>$1</li>"); // Bullet points
    // Wrap bullet list items with <ul> if any <li> found
    const wrappedReply = formattedReply.includes("<li>")
      ? formattedReply.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
      : formattedReply;
    // Final output in a styled message bubble
    chatBox.innerHTML += `<div class="bot-message"><p>${wrappedReply}</p></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    chatBox.innerHTML += `<div class="bot-message">An error occurred. Please try again.</div>`;
  }
}
const chatIcon = document.getElementById("chatbot-icon");
chatIcon.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent bubbling
  const chatContainer = document.getElementById("chat-container");
  chatContainer.classList.toggle("hidden");
});
