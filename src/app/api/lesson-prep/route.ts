import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { studentName, background, lessonGoal, methodology, level } = await request.json()

    // Use Gemini Flash 2.0 (latest available)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `Je bent een ervaren zangpedagoog die een gedetailleerde lesvoorbereiding maakt. Maak een lesvoorbereiding voor de volgende situatie:

**Leerling:** ${studentName}
**Niveau:** ${level}
**Achtergrond:** ${background}
**Lesdoelstelling:** ${lessonGoal}
**Methodiek:** ${methodology}

Maak een complete lesvoorbereiding die de volgende onderdelen bevat:

## Lesvoorbereiding

### 1. Warming-up (10 minuten)
Beschrijf specifieke oefeningen passend bij het niveau en de methodiek.

### 2. Technische oefeningen (15 minuten)
Geef concrete oefeningen die aansluiten bij de gekozen methodiek en het lesdoel.

### 3. Repertoire werk (20 minuten)
Suggesties voor geschikt repertoire en hoe dit te benaderen vanuit de methodiek.

### 4. Afsluiting & Huiswerk (5 minuten)
Concrete opdrachten voor thuis.

### Aandachtspunten
- Specifieke tips voor deze leerling
- Mogelijke uitdagingen
- Observatiepunten

Gebruik Nederlandse terminologie maar waar relevant ook de Engelse termen uit de methodiek. Wees concreet en praktisch.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const lessonPrep = response.text()

    return NextResponse.json({ lessonPrep })
  } catch (error) {
    console.error('Error generating lesson prep:', error)
    return NextResponse.json(
      { error: 'Failed to generate lesson preparation' },
      { status: 500 }
    )
  }
}