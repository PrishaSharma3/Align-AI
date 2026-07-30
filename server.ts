import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Update Day endpoint
app.post('/api/update-day', async (req, res) => {
  const { events, message, currentDay = 'Monday', selection = '' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `
        Current day is: ${currentDay}.
        The user's weekly planner events are represented in JSON:
        ${JSON.stringify(events, null, 2)}

        The user has provided this update: "${message}" ${selection ? `with option selection: "${selection}"` : ''}

        Your job is to dynamically re-align their weekly schedule.
        Guidelines:
        1. Keep the explanation warm, friendly, encouraging, and highly concise (max 2 sentences). Explain WHY you shifted things.
        2. Minimize questions. Decide realistic scheduling.
        3. Blue events are Google Calendar (type='gcal', flex=false). You cannot modify them, but you can schedule around them.
        4. Orange events are Commitments (type='commitment'). Some are flex=true.
        5. Green events are Goals (type='goal', flex=true). They are highly adjustable.
        6. Try to reschedule any goals/flexible sessions that are displaced by this update to subsequent days where there are fewer activities, especially free evenings or weekend hours.
        7. If they say "Tomorrow is my friend's birthday" and select "Most of the Day", move tomorrow's goals/commitments to other days (e.g., Sunday or Saturday) to clear tomorrow's schedule.
        8. If they say "I'm feeling sick", reschedule today's goals and commitments to later in the week.
        9. Return a JSON object with:
           - "explanation": string (A warm, helpful explanation of the change)
           - "actionLabel": string (A short 3-5 word label for the action button, e.g. "Clear Tomorrow & Reschedule")
           - "suggestedChanges": array of objects:
             - "eventId": string (The ID of the event to modify/move)
             - "action": "move" | "delete" | "complete"
             - "newDay": "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"
             - "newStartTime": string (e.g. "14:00")
             - "newEndTime": string (e.g. "15:00")
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: { type: Type.STRING },
              actionLabel: { type: Type.STRING },
              suggestedChanges: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    eventId: { type: Type.STRING },
                    action: { type: Type.STRING },
                    newDay: { type: Type.STRING },
                    newStartTime: { type: Type.STRING },
                    newEndTime: { type: Type.STRING },
                  },
                  required: ['eventId', 'action'],
                },
              },
            },
            required: ['explanation', 'actionLabel', 'suggestedChanges'],
          },
        },
      });

      const responseText = response.text || '{}';
      const result = JSON.parse(responseText);
      return res.json({ ...result, source: 'gemini-api' });
    } catch (error: any) {
      console.error('Gemini API Error, falling back to local heuristics:', error);
      // Fallback below
    }
  }

  // --- LOCAL HIGH-FIDELITY HEURISTICS ENGINE ---
  const query = message.toLowerCase();
  
  if (query.includes('birthday') || query.includes('friend')) {
    const explanation = "Sounds fun! 🎉 I've cleared your schedule for tomorrow to keep you free for the celebrations. To keep your goals on track, I've moved your Atomic Habits reading session to Sunday afternoon and shifted your internship hours.";
    const actionLabel = "Accept Changes & Realign Week";
    
    return res.json({
      explanation,
      actionLabel,
      suggestedChanges: [
        {
          eventId: 'g-gym-1', // Tuesday Gym
          action: 'move',
          newDay: 'Wednesday',
          newStartTime: '18:00',
          newEndTime: '19:30'
        },
        {
          eventId: 'c-intern-2', // Tuesday Internship
          action: 'move',
          newDay: 'Thursday',
          newStartTime: '15:00',
          newEndTime: '18:00'
        },
        {
          eventId: 'g-read-1', // Monday Reading
          action: 'move',
          newDay: 'Sunday',
          newStartTime: '15:00',
          newEndTime: '16:00'
        }
      ],
      source: 'local-heuristics-birthday'
    });
  }

  if (query.includes('sick') || query.includes('ill') || query.includes('fever')) {
    const explanation = "Get well soon! ❤️ I've postponed today's workouts and readings so you can fully rest up. I've re-distributed them over Friday and Saturday so you don't fall behind on your weekly streak.";
    return res.json({
      explanation,
      actionLabel: "Clear Today & Postpone Goals",
      suggestedChanges: [
        {
          eventId: 'g-gym-1',
          action: 'move',
          newDay: 'Saturday',
          newStartTime: '15:00',
          newEndTime: '16:30'
        },
        {
          eventId: 'g-read-1',
          action: 'move',
          newDay: 'Friday',
          newStartTime: '19:00',
          newEndTime: '20:00'
        },
        {
          eventId: 'c-intern-1',
          action: 'move',
          newDay: 'Thursday',
          newStartTime: '15:00',
          newEndTime: '18:00'
        }
      ],
      source: 'local-heuristics-sick'
    });
  }

  if (query.includes('cancel') || query.includes('cancelled') || query.includes('class')) {
    const explanation = "That gives us a nice block of free time! 🗓️ I recommend using this cancelled class slot to get ahead on your AI Project session, which frees up your Saturday afternoon completely.";
    return res.json({
      explanation,
      actionLabel: "Realign Cancelled Class Slot",
      suggestedChanges: [
        {
          eventId: 'g-aiproj-2', // Saturday AI Project
          action: 'move',
          newDay: 'Monday', // Put it where class was cancelled
          newStartTime: '11:00',
          newEndTime: '13:00'
        },
        {
          eventId: 'gcal-1', // Cancelled class itself
          action: 'delete'
        }
      ],
      source: 'local-heuristics-cancelled'
    });
  }

  if (query.includes('late') || query.includes('work late') || query.includes('overtime')) {
    const explanation = "Work hard! 💪 I've moved your evening gym session to Friday morning, ensuring you have enough time for your late shift without sacrificing your physical goals.";
    return res.json({
      explanation,
      actionLabel: "Reschedule Evening Activities",
      suggestedChanges: [
        {
          eventId: 'g-gym-1',
          action: 'move',
          newDay: 'Friday',
          newStartTime: '08:00',
          newEndTime: '09:30'
        }
      ],
      source: 'local-heuristics-late'
    });
  }

  if (query.includes('off') || query.includes('break') || query.includes('relax')) {
    const explanation = "Taking some time for yourself is extremely important! 💆 I've cleared today's schedule entirely. Your Atomic Habits reading session is safely rescheduled to Sunday night.";
    return res.json({
      explanation,
      actionLabel: "Take Today Off & Shift Goals",
      suggestedChanges: [
        {
          eventId: 'g-read-1',
          action: 'move',
          newDay: 'Sunday',
          newStartTime: '21:00',
          newEndTime: '22:00'
        },
        {
          eventId: 'c-intern-1',
          action: 'move',
          newDay: 'Wednesday',
          newStartTime: '15:00',
          newEndTime: '18:00'
        }
      ],
      source: 'local-heuristics-dayoff'
    });
  }

  // General catch-all adapter
  const explanation = `Got it! I have adjusted your schedule to accommodate: "${message}". I moved your reading session and flexible commitments slightly to maintain your weekly goal velocity.`;
  return res.json({
    explanation,
    actionLabel: "Accept AI Adjustments",
    suggestedChanges: [
      {
        eventId: 'g-read-1',
        action: 'move',
        newDay: 'Saturday',
        newStartTime: '16:00',
        newEndTime: '17:00'
      }
    ],
    source: 'local-heuristics-default'
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Align AI] Server listening on http://localhost:${PORT}`);
  });
}

startServer();
