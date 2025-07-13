import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { lessonContent, studentName, practiceTime, daysPerWeek, focusAreas, difficulty } = await request.json()

    // Gebruik Gemini 2.5 Pro (altijd het krachtigste model)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-06-05" })

    const prompt = `Je bent een ervaren zangpedagoog die een gedetailleerd en motiverend oefenschema voor thuis opstelt. Maak een praktisch weekschema dat de leerling zelfstandig kan volgen.

GEGEVENS:
- Naam leerling: ${studentName}
- Lesvoorbereiding inhoud: ${lessonContent}
- Beschikbare oefentijd per dag: ${practiceTime} minuten
- Aantal oefendagen per week: ${daysPerWeek}
- Moeilijkheidsgraad: ${difficulty}
- Extra aandachtspunten: ${focusAreas || 'Geen specifieke aandachtspunten'}

OPDRACHT:
Creëer een gestructureerd oefenschema voor één week, gebaseerd op de lesvoorbereiding. Verdeel de oefeningen slim over het aantal opgegeven dagen, waarbij je rekening houdt met de beschikbare tijd en de moeilijkheidsgraad.

BELANGRIJK: Start je antwoord DIRECT met "## 1. Overzicht en doelen voor deze week" - GEEN inleidende tekst.

WEEKSCHEMA STRUCTUUR:

## 1. Overzicht en doelen voor deze week
- Formuleer 2-3 concrete, haalbare weekdoelen gebaseerd op de lesvoorbereiding
- Geef een motiverende openingszin
- Leg kort uit waarom deze oefeningen belangrijk zijn

## 2. Dagelijkse basisroutine (voor elke oefendag)
- Warming-up (tijd en specifieke oefeningen uit de les)
- Kernonderdelen voor elke dag
- Cool-down/afsluiting
- Totale tijdsduur moet passen binnen de opgegeven oefentijd

## 3. Dag-specifieke focus
Maak voor elke oefendag een schema met:
- **Dag X - Focus: [specifiek onderdeel]**
  * Warming-up (X minuten): [specifieke oefeningen]
  * Hoofdoefening (X minuten): [wat en hoe]
  * Extra aandacht (X minuten): [specifieke techniek]
  * Repertoire (X minuten): [welk stuk/deel]
  * Notities: [waar op letten]

## 4. Progressie en variatie
- Beschrijf hoe de leerling door de week heen kan opbouwen
- Geef aan wanneer oefeningen moeilijker gemaakt kunnen worden
- Bied alternatieven voor dagen met minder energie/tijd

## 5. Zelfevaluatie en tips
- Geef 3-4 concrete checkpunten waar de leerling op kan letten
- Beschrijf wanneer een oefening 'geslaagd' is
- Voeg motivatietips toe voor moeilijke momenten
- Leg uit hoe de leerling voortgang kan bijhouden

SPECIFIEKE RICHTLIJNEN:

- Bij "easy": focus op consolidatie van bekende oefeningen, veel herhaling, opbouwen van vertrouwen
- Bij "medium": balans tussen bekende oefeningen en nieuwe technieken uit de les, stapsgewijze opbouw
- Bij "hard": focus op perfectie, nuances, combineren van technieken, zelfstandig experimenteren

- Gebruik ALLEEN oefeningen die in de lesvoorbereiding genoemd worden
- Pas de intensiteit aan op basis van de moeilijkheidsgraad
- Integreer eventuele extra aandachtspunten in het schema
- Maak het schema zo concreet dat de leerling het zonder docent kan uitvoeren
- Gebruik heldere tijdsaanduidingen die optellen tot de beschikbare oefentijd

SCHRIJFSTIJL:
- Direct en praktisch, alsof je tegen de leerling praat
- Motiverend maar realistisch
- Gebruik de naam van de leerling 1-2 keer in het schema
- Eindig met een bemoedigende afsluiting`

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