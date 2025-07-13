import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { studentName, background, lessonGoal, methodology, level } = await request.json()

    // Use Gemini Flash 2.0 (latest available)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-06-05" })

    const prompt = `Je bent een expert zangdocent die een gedetailleerde lesvoorbereiding maakt voor een individuele zangles van 45-60 minuten.

LEERLINGGEGEVENS:
- Naam: ${studentName}
- Achtergrond & Voorgeschiedenis: ${background}
- Doelstelling van deze les: ${lessonGoal}
- Methodiek: ${methodology}
- Niveau: ${level}

BELANGRIJK: Start je antwoord DIRECT met "## Lesoverzicht" - GEEN inleidende tekst, GEEN uitleg, GEEN "Hier is een lesvoorbereiding". Begin onmiddellijk met de eerste sectie.

Gebruik EXACT deze structuur en maak GEEN extra secties:

## Lesoverzicht
Geef een korte samenvatting van deze les: wat staat er op het programma, wat gaan we bereiken, en hoe sluit dit aan bij de leerling en de gekozen methodiek.

## 1. Warming-up (10-15 minuten)
- Beschrijf 3-4 concrete opwarmoefeningen
- Geef per oefening: doel, uitvoering, duur
- Begin met fysieke ontspanning, ga door naar ademhaling, eindig met stemoefeningen
- Stem de complexiteit af op het aangegeven niveau

## 2. Technische training (15-20 minuten)
- Ontwikkel 3-4 technische oefeningen die direct aansluiten bij de doelstelling
- Per oefening: 
  * Wat train je precies?
  * Stap-voor-stap instructies
  * Welke toonhoogtes/toonladders gebruik je?
  * Wanneer is de oefening geslaagd?
- Bouw op van eenvoudig naar complex

## 3. Repertoirewerk (15-20 minuten)
- Suggereer 1-2 passende liedjes/aria's/songs bij het niveau
- Leg uit waarom dit repertoire geschikt is voor de doelstelling
- Geef concrete werkpunten in het repertoire
- Beschrijf interpretatie-aanwijzingen

## 4. Afsluiting (5-10 minuten)
- Vat samen wat er geoefend is
- Geef 2-3 concrete huiswerkopdrachten
- Eindig met een positieve oefening of doorloop

## 5. Docententips (algemene aandachtspunten)
- Geef 4-5 praktische tips voor tijdens de les, afgestemd op:
  * Het niveau van de leerling (wat zijn typische valkuilen?)
  * De gekozen methodiek (welke principes zijn essentieel?)
  * De doelstelling (waar moet je extra op letten?)
  * Informatie uit de achtergrond (indien relevant)
- Beschrijf observatiepunten: waar let je op tijdens de les?
- Geef suggesties voor aanpassingen als oefeningen te moeilijk/makkelijk blijken
- Noem mogelijke doorbraakmomenten waar je alert op moet zijn

BELANGRIJK: 
- Gebruik ALLEEN de 6 secties hierboven
- Maak GEEN extra tekstblokken of secties
- Als er een methodiek is genoemd, verwijs daar expliciet naar in je aanpak
- Bij een beginnend niveau: focus op basisvaardigheden en eenvoudige oefeningen
- Bij gevorderd niveau: complexere technieken en uitdagender repertoire
- Maak alle instructies praktisch en direct uitvoerbaar
- Gebruik Nederlandse terminologie, leg vaktermen uit waar nodig`

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