// ---------- Trimester Tips Data ----------
const trimesterData = {
  1: {
    title: "First Trimester (Weeks 1–13)",
    nutrition: [
      "Take a prenatal vitamin with folic acid daily.",
      "Eat small, frequent meals if you have nausea.",
      "Include iron-rich foods like leafy greens and lentils.",
      "Stay hydrated — aim for plenty of water through the day.",
      "Ginger tea or ginger candies can help with morning sickness."
    ],
    lifestyle: [
      "Rest when you're tired — fatigue is common now.",
      "Gentle walks are usually safe and helpful.",
      "Avoid alcohol, smoking, and unnecessary medications.",
      "Book your first prenatal checkup if you haven't already."
    ]
  },
  2: {
    title: "Second Trimester (Weeks 14–27)",
    nutrition: [
      "Increase calcium intake for baby's bone development.",
      "Add more protein — eggs, beans, dairy, lean meat.",
      "Keep taking prenatal vitamins.",
      "Watch sugar intake to help manage healthy weight gain."
    ],
    lifestyle: [
      "This is often the best time for gentle exercise like prenatal yoga or swimming.",
      "Start sleeping on your side (left side is often recommended).",
      "Continue regular prenatal checkups.",
      "Practice good posture as your belly grows."
    ]
  },
  3: {
    title: "Third Trimester (Weeks 28–40)",
    nutrition: [
      "Eat smaller meals more often — baby is now pressing on your stomach.",
      "Keep iron and calcium intake steady.",
      "Stay hydrated to help reduce swelling.",
      "Limit caffeine to about one small cup a day."
    ],
    lifestyle: [
      "Short, gentle walks can help prepare your body for labor.",
      "Practice breathing or relaxation techniques.",
      "Pack your hospital bag and finalize your birth plan.",
      "Watch for warning signs (severe headache, swelling, reduced baby movement) and call your provider if they occur."
    ]
  }
};

function calculateWeek() {
  const lmpInput = document.getElementById("lmp").value;
  const resultDiv = document.getElementById("weekResult");
  if (!lmpInput) {
    resultDiv.innerHTML = "<p style='color:#e05d5d'>Please select a date.</p>";
    return;
  }
  const lmpDate = new Date(lmpInput);
  const today = new Date();
  const diffTime = today - lmpDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    resultDiv.innerHTML = "<p style='color:#e05d5d'>That date is in the future — please check and try again.</p>";
    return;
  }

  const week = Math.floor(diffDays / 7);
  let trimester = 1;
  if (week >= 27) trimester = 3;
  else if (week >= 13) trimester = 2;

  resultDiv.innerHTML = `<span class="week-badge">Week ${week} · Trimester ${trimester}</span>`;

  const data = trimesterData[trimester];
  document.getElementById("tipsCard").style.display = "block";
  document.getElementById("trimesterTitle").textContent = "🗓️ " + data.title;

  const nutList = document.getElementById("nutritionTips");
  nutList.innerHTML = data.nutrition.map(t => `<li>${t}</li>`).join("");

  const lifeList = document.getElementById("lifestyleTips");
  lifeList.innerHTML = data.lifestyle.map(t => `<li>${t}</li>`).join("");
}

// ---------- Food Safety Database ----------
const foodDatabase = {
  "sushi": { status: "avoid", note: "Raw fish sushi carries a risk of parasites/bacteria. Cooked sushi rolls (like tempura or cooked crab) are fine." },
  "raw fish": { status: "avoid", note: "Avoid raw or undercooked fish due to risk of bacteria and parasites." },
  "coffee": { status: "moderate", note: "Limit caffeine to about 200mg/day (roughly one 12oz cup)." },
  "caffeine": { status: "moderate", note: "Keep total caffeine (coffee, tea, soda, chocolate) under about 200mg/day." },
  "alcohol": { status: "avoid", note: "No amount of alcohol is considered safe during pregnancy." },
  "soft cheese": { status: "avoid", note: "Unpasteurized soft cheeses (brie, feta, queso fresco) may carry listeria. Choose pasteurized versions." },
  "unpasteurized cheese": { status: "avoid", note: "Risk of listeria — choose pasteurized dairy products instead." },
  "deli meat": { status: "moderate", note: "Heat deli meats until steaming hot to reduce listeria risk before eating." },
  "raw eggs": { status: "avoid", note: "Avoid raw or undercooked eggs (like in homemade mayo or raw cookie dough) due to salmonella risk." },
  "papaya": { status: "moderate", note: "Ripe papaya is generally fine; unripe/semi-ripe papaya contains latex that may trigger contractions — best avoided." },
  "pineapple": { status: "safe", note: "Safe in normal food amounts. The old myth about pineapple inducing labor isn't supported by real evidence." },
  "shellfish": { status: "moderate", note: "Cooked shellfish is fine; avoid raw shellfish like oysters or clams." },
  "high mercury fish": { status: "avoid", note: "Avoid shark, swordfish, king mackerel, and tilefish due to high mercury levels." },
  "tuna": { status: "moderate", note: "Limit canned light tuna to about 2-3 servings/week; limit albacore/white tuna to 1 serving/week due to mercury." },
  "salmon": { status: "safe", note: "Cooked salmon is a great source of omega-3s and generally safe in normal amounts." },
  "herbal tea": { status: "moderate", note: "Some herbal teas aren't well studied in pregnancy. Stick to pregnancy-safe ones like ginger or rooibos, and check with your provider." },
  "milk": { status: "safe", note: "Pasteurized milk is a good source of calcium and generally safe." },
  "peanuts": { status: "safe", note: "Unless you have an allergy, peanuts are safe and a good protein source." },
  "energy drinks": { status: "avoid", note: "High caffeine and stimulant content make these best avoided." },
  "spicy food": { status: "safe", note: "Generally safe, though it may worsen heartburn for some." }
};

function checkFood() {
  const input = document.getElementById("foodInput").value.trim().toLowerCase();
  const resultDiv = document.getElementById("foodResult");
  resultDiv.style.display = "block";

  if (!input) {
    resultDiv.className = "result-box";
    resultDiv.innerHTML = "Please type a food name.";
    return;
  }

  // exact or partial match
  let match = foodDatabase[input];
  if (!match) {
    const key = Object.keys(foodDatabase).find(k => input.includes(k) || k.includes(input));
    if (key) match = foodDatabase[key];
  }

  if (match) {
    const labels = { safe: "✅ Generally Safe", avoid: "⚠️ Best Avoided", moderate: "🟡 OK in Moderation" };
    resultDiv.className = "result-box " + match.status;
    resultDiv.innerHTML = `<strong>${labels[match.status]}</strong><br>${match.note}`;
  } else {
    // Not in local database — ask the AI instead
    resultDiv.className = "result-box moderate";
    resultDiv.innerHTML = "Not in our quick database — checking with MomCare AI...";
    askAIAboutFood(input, resultDiv);
  }
}

async function askAIAboutFood(food, resultDiv) {
  try {
    const reply = await callChatAPI(`Is it generally safe to eat "${food}" during pregnancy? Give a short 2-3 sentence answer.`);
    resultDiv.innerHTML = `<strong>🤖 AI says:</strong><br>${reply}`;
  } catch (e) {
    resultDiv.innerHTML = "Sorry, couldn't reach the AI right now. Please try again, or ask your provider directly.";
  }
}

// ---------- AI Chat ----------
async function callChatAPI(message) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  return data.reply;
}

async function sendChat() {
  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");
  const message = input.value.trim();
  if (!message) return;

  chatBox.innerHTML += `<div class="msg user"><span class="bubble">${escapeHtml(message)}</span></div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  const loadingId = "loading-" + Date.now();
  chatBox.innerHTML += `<div class="msg ai" id="${loadingId}"><span class="loading">MomCare AI is thinking...</span></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const reply = await callChatAPI(message);
    document.getElementById(loadingId).innerHTML = `<span class="bubble">${escapeHtml(reply)}</span>`;
  } catch (e) {
    document.getElementById(loadingId).innerHTML = `<span class="bubble">Sorry, I'm having trouble responding right now. Please try again in a moment.</span>`;
  }
  chatBox.scrollTop = chatBox.scrollHeight;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Allow pressing Enter to send chat
document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chatInput");
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendChat();
    });
  }
  const foodInput = document.getElementById("foodInput");
  if (foodInput) {
    foodInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") checkFood();
    });
  }
});
