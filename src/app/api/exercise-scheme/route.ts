import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { lessonContent, studentName, practiceTime, focusAreas, difficulty } = await request.json()

    // Gebruik Gemini 2.5 Pro (altijd het krachtigste model)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-06-05" })

    const difficultyMapping = {
      easy: 'makkelijke basisoefeningen die de geleerde technieken herhalen',
      medium: 'oefeningen van gemiddelde moeilijkheid die nieuwe technieken introduceren en bestaande verdiepen',
      hard: 'uitdagende oefeningen die verfijning en technische excellentie bevorderen'
    }

    const prompt = `Maak een persoonlijk huiswerk oefenschema voor ${studentName} op basis van de volgende informatie:

**Lesvoorbereiding basis:**
${lessonContent}

**Beschikbare tijd:** ${practiceTime} minuten per dag
**Moeilijkheidsgraad:** ${difficultyMapping[difficulty as keyof typeof difficultyMapping]}
**Extra aandachtspunten:** ${focusAreas || 'Geen specifieke aandachtspunten'}

BELANGRIJK: Begin direct met het oefenschema. Geef GEEN inleiding, uitleg voor de pedagoog, of algemene commentaar. Start meteen met de titel en het schema.

Maak een compleet oefenschema met de volgende structuur:

## Oefenschema voor ${studentName}

### 🎯 Introductie
Schrijf hier een korte, bemoedigende introductie voor ${studentName} van 2-3 zinnen die uitlegt:
- Wat de bedoeling is van dit oefenschema
- Hoe het gebruikt moet worden (dagelijks oefenen)
- Een bemoedigende afsluiting

### 📅 Dagelijkse Planning (${practiceTime} minuten)

**Opwarming** (${Math.round(practiceTime * 0.2)} minuten)
- Specifieke opwarmoefeningen
- Ademhalingsoefeningen

**Techniek** (${Math.round(practiceTime * 0.4)} minuten)
- Gebaseerd op de lesvoorbereiding
- Stapsgewijze oefeningen

**Repertoire** (${Math.round(practiceTime * 0.3)} minuten)
- Liederen of vocalen uit de les
- Specifieke passages om te oefenen

**Afsluiting** (${Math.round(practiceTime * 0.1)} minuten)
- Cool-down oefeningen
- Reflectie

### 🎯 Weekoverzicht

**Dag 1-2:** [Focus gebied 1]
**Dag 3-4:** [Focus gebied 2]  
**Dag 5-6:** [Combinatie en herhaling]
**Dag 7:** [Vrije keuze/rust]

### 📝 Belangrijke Tips
- Praktische tips voor thuisoefening
- Wat te doen bij problemen
- Hoe vooruitgang te meten

### ⚠️ Let Op
- Waarschuwingen en aandachtspunten
- Wanneer te stoppen met oefenen

Maak het schema concreet, praktisch en motiverend. Gebruik Nederlandse termen maar geef waar relevant ook de technische/Engelse termen. Houd rekening met het niveau van de leerling en zorg dat de oefeningen uitvoerbaar zijn zonder begeleiding.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const exerciseScheme = response.text()

    return NextResponse.json({ exerciseScheme })
  } catch (error) {
    console.error('Error generating exercise scheme:', error)
    return NextResponse.json(
      { error: 'Failed to generate exercise scheme' },
      { status: 500 }
    )
  }
}