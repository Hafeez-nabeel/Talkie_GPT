// import bot from "./assets/bot.svg"
import user from "./assets/user.svg"
import bot from "./assets/chat.svg"

const form = document.querySelector("form")
const chatContainer = document.querySelector("#chat-container")

let loadinterval
//  loader functionality when question is asked it is respnsible to show three dots before answering
function loader(element) {
  element.textContent = ""
  loadinterval = setInterval(() => {
    element.textContent += "."
    if (element.textContent === "....") element.textContent = ""
  }, 300)
}

// this function is responsible for typying the answer character by character  user asked for
function typeText(element, text) {
  let index = 0

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index)
      index++
    } else clearInterval(interval)
  }, 20)
}

// this function is responsible for genrating unique id  for each answer that is given by AI
function genrateUniqueID() {
  const timestamp = new Date()
  const randomNumber = Math.random().toString(16)
  return `id-${timestamp}-${randomNumber}`
}

// this function is responsible for rendering ui stripe based on dynamic value if it is bot or user
function chatStripe(isAi, value, uniqueID) {
  return `
  <div class= "wrapper ${isAi && "ai"}">
  <div class= "chat">
  <div class= "profile">
  <img
  src= "${isAi ? bot : user}"
  alt= "${isAi ? "bot" : "user"}"
  />
  </div>
  <div class="message" id="${uniqueID}">${value}</div>
  </div>
  </div>
  `
}

// this function is responsible for handle submitting data

const handleSubmit = async (e) => {
  e.preventDefault()
  const data = new FormData(form)

  //user UI
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"))

  form.reset()

  // Chatbot UI
  const uniquID = genrateUniqueID()
  chatContainer.innerHTML += chatStripe(true, " ", uniquID)

  chatContainer.scrollTop = chatContainer.scrollHeight
  const messageDiv = document.getElementById(uniquID)

  loader(messageDiv)

  // sending request to server API to fetch message from openAi
  const response = await fetch(import.meta.env.VITE_SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  })

  clearInterval(loadinterval)

  messageDiv.innerHTML = ""

  if (response.ok) {
    const data = await response.json()
    const parseData = data.bot.content
    typeText(messageDiv, parseData)
  } else {
    messageDiv.innerHTML = "Something went wrong"
    alert("connection error")
  }
}

// listening to event
form.addEventListener("submit", handleSubmit)
form.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    handleSubmit(e)
  }
})
