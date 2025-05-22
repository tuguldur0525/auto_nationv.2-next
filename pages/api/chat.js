import dbConnect from "../../lib/dbConnect"
const Vehicle = require("../../models/Vehicle")

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { message } = req.body

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY

  // Машины брэндүүдийн жагсаалт (жишээ)
  const brands = [
    "toyota",
    "honda",
    "nissan",
    "lexus",
    "bmw",
    "benz",
    "ford",
    "hyundai",
    "kia",
  ]
  let carInfo = ""

  // Хэрэглэгчийн асуултад брэнд байгаа эсэхийг шалгах
  const lowerMsg = message.toLowerCase()
  const foundBrand = brands.find((b) => lowerMsg.includes(b))

  if (foundBrand) {
    await dbConnect()
    // Статус нь approved заруудыг л харуулах
    const cars = await Vehicle.find({
      brand: { $regex: foundBrand, $options: "i" },
      status: "approved",
    }).limit(3)
    console.log("Found brand:", foundBrand)
    console.log("Cars from DB:", cars)
    if (cars.length > 0) {
      carInfo =
        `Манай сайтад дараах ${foundBrand.toUpperCase()} машинууд байна:\n` +
        cars
          .map(
            (car) =>
              `- ${car.title}, үнэ: ${car.price}, байршил: ${car.location}`
          )
          .join("\n")
    } else {
      carInfo = `${foundBrand.toUpperCase()} машин одоогоор байхгүй байна.`
    }
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `\nЧи бол Монгол хэлээр харилцдаг AutoNation сайтын туслах чатбот. Манай сайт автомашины зар, худалдаа, байршил, хэрэглэгчийн профайл, зар нэmэх үйлчилгээтэй.\n${carInfo}`,
          },
          { role: "user", content: message },
        ],
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return res.status(500).json({ reply: "OpenAI API error: " + error })
    }

    const data = await response.json()
    const aiMessage =
      data.choices?.[0]?.message?.content || "AI-с хариу ирсэнгүй."

    res.status(200).json({ reply: aiMessage })
  } catch (err) {
    res.status(500).json({ reply: "Серверийн алдаа: " + err.message })
  }
}
