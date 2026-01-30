import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateOverlayDescription = async (title: string, category: string): Promise<string> => {
  if (!ai) {
    console.warn("API Key missing for Gemini Service");
    return "API Key fehlt. Bitte konfigurieren Sie den API Key für automatische Beschreibungen.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Du bist ein Assistent für eine Video-Produktions-Software.
      Erstelle eine kurze, professionelle und prägnante Beschreibung (max. 2 Sätze) für ein Video-Overlay.
      Titel des Overlays: "${title}"
      Kategorie: "${category}"
      Antworte nur mit der Beschreibung auf Deutsch.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating description:", error);
    return "Fehler bei der Generierung der Beschreibung. Bitte versuchen Sie es manuell.";
  }
};

export const suggestTags = async (title: string, description: string): Promise<string[]> => {
    if (!ai) return [];

    try {
        const model = 'gemini-3-flash-preview';
        const prompt = `
          Analysiere den folgenden Titel und die Beschreibung eines Video-Overlays und generiere 3-5 relevante Tags (Schlagwörter).
          Titel: "${title}"
          Beschreibung: "${description}"
          
          Gib das Ergebnis als reines JSON-Array von Strings zurück. Keine Markdown-Formatierung.
          Beispiel: ["sport", "live", "hd"]
        `;
    
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
        });

        const text = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
      } catch (error) {
        console.error("Error generating tags:", error);
        return [];
      }
}