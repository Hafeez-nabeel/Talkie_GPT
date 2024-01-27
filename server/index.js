import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import OpenAI from "openai"
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const app = express()

app.use(cors())
app.use(express.json())
const port = process.env.PORT

app.get("/", async (req, res) => {
  res.json({
    message: "I am running agian",
  })
})

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          // content: `${prompt}`,
          content: prompt,
        },
      ],
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    return res.status(200).json({
      bot: response.choices[0].message,
    })
  } catch (error) {
    return res.status(500).json({
      message: error,
    })
  }
})
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
