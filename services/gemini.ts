import { GoogleGenAI } from "@google/genai";
import { Habit, DailyLog } from "../types";

const SYSTEM_INSTRUCTION = `
You are a supportive and analytical Habit Coach. 
Your goal is to analyze the user's habit tracking data and provide a short, motivating summary.
Identify patterns (e.g., "You're great at gym on Mondays but skip Fridays").
Keep the tone encouraging but concise. 
If the user is doing well, celebrate it. If they are struggling, suggest a small actionable step.
Limit response to 2-3 sentences max.
`;

export const getHabitInsights = async (habits: Habit[], logs: DailyLog[], langPrompt?: string) => {
  try {
    // Only use the last 14 days of logs for context to save tokens and stay relevant
    const recentLogs = logs.slice(-14);
    
    const context = {
      habits: habits.map(h => ({ id: h.id, title: h.title, category: h.category })),
      recentActivity: recentLogs
    };

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Here is my habit tracking data: ${JSON.stringify(context)}. Give me a quick insight or motivation based on my recent performance. ${langPrompt || ''}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Keep going! Consistency is key. (AI unavailable currently)";
  }
};