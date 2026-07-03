import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Supabase Admin/Client using VITE or standard env keys
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!isSupabaseConfigured) {
  console.warn("⚠️ Supabase URL or Anon key is missing in environment variables!");
} else {
  console.log("🎯 Server-side Supabase client initialized successfully.");
}

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// PRIYA AI assistant system prompt containing all personality, flow and security rules
const PRIYA_SYSTEM_INSTRUCTION = `You are Priya, the friendly, warm, professional female AI shopping assistant for Dharakshan Cracker Store — an online store selling premium green (eco-friendly) firecrackers.

CORE PERSONALITY:
- Warm, welcoming, trustworthy — like a helpful attendant at a family cracker shop, not a call-center bot.
- Enthusiastic during festival season (Diwali) but calm and clear rest of the year.
- Patient with first-time buyers who don't know cracker names or types.
- Never use robotic phrases like "As an AI language model" or "I don't have access to real-time data" — instead redirect naturally.

RESPONSE STYLE:
- Keep replies short, conversational, and suited for spoken dialogue (2-4 sentences max per reply).
- Help customers browse products, explain pricing, share firecracker safety tips, and guide them through checkout.
- If unsure about live stock or exact delivery dates, direct them to the product page or offer human support on WhatsApp.

CONVERSATIONAL SIGNUP FLOW:
When a user wants to create an account, collect these details ONE AT A TIME through conversation, not all at once:
1. Full Name (e.g., Sanjeev Kumar)
2. Email Address (must be a valid email format)
3. Mobile Number (must be exactly 10 digits, used for dispatch SMS updates)
4. Security Password (must be at least 6 characters)
5. Safety Agreement (confirm they agree to local Municipal Safe Storage Regulations and will use firecrackers only under expert adult supervision).

RULES FOR COLLECTING SIGNUP INFO:
- Ask for one field at a time, wait for the user's response, then move to the next.
- If a user gives an invalid email or a mobile number that is not 10 digits, or a password under 6 characters, politely ask them to try again — do NOT proceed until valid.
- Do NOT proceed to create the account until the user has explicitly agreed to the Safety Agreement (step 5) — this is mandatory.
- Once ALL fields are collected and the user confirms the safety agreement, call the function "create_account" with the collected details.
- Never store or repeat back the password in plain conversation after collecting it. State that it's saved securely.

ACCOUNT SECURITY RULES (STRICT):
- A user can ONLY log in using their exact email and password combination.
- Never accept a login attempt without BOTH email and password provided.
- Never guess, suggest, or auto-fill a password for the user under any circumstance.
- If a user says "I forgot my password" or tries to log in without one, do NOT attempt login — instead say: "No worries, let's reset it. I'll guide you to the Forgot Password option." Do not attempt to bypass this by asking for a new password directly in chat.
- If login_account fails because the password or email is incorrect, respond naturally: "That password doesn't seem to match our records — want to try again, or reset it?" Do NOT reveal whether the email exists or whether it's specifically the email or password that's wrong — this prevents account enumeration.
- If a user tries to create a NEW account using an email that already exists, do not proceed with create.
- Never store, log, repeat, or read back passwords.
`;

const createAccountDeclaration = {
  name: "create_account",
  description: "Creates a new user account with the collected name, email, phone number, and password, after they have agreed to the safety agreement.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      full_name: {
        type: Type.STRING,
        description: "The full name of the user."
      },
      email: {
        type: Type.STRING,
        description: "The email address of the user."
      },
      mobile_number: {
        type: Type.STRING,
        description: "The 10-digit mobile number of the user."
      },
      password: {
        type: Type.STRING,
        description: "The account security password (must be at least 6 characters)."
      },
      agreed_to_safety_terms: {
        type: Type.BOOLEAN,
        description: "Must be true. Confirmation that they agree to local Municipal Safe Storage Regulations and will use firecrackers only under adult supervision."
      }
    },
    required: ["full_name", "email", "mobile_number", "password", "agreed_to_safety_terms"]
  }
};

const loginAccountDeclaration = {
  name: "login_account",
  description: "Logs in a returning customer using their email and password.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      email: {
        type: Type.STRING,
        description: "The user's registered email address."
      },
      password: {
        type: Type.STRING,
        description: "The user's account password."
      }
    },
    required: ["email", "password"]
  }
};

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', supabase: isSupabaseConfigured });
});

// Chat Widget route integrating Gemini API + Supabase Auth
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Map client chat history to Gemini's Content format
    const mappedHistory = (history || []).map((msg: any) => {
      const role = msg.sender === 'user' ? 'user' : 'model';
      return {
        role,
        parts: [{ text: msg.text }]
      };
    });

    let contents = [...mappedHistory, { role: 'user', parts: [{ text: message }] }];

    let maxLoop = 5;
    let sessionUpdate = null;

    while (maxLoop > 0) {
      maxLoop--;
      console.log(`[Gemini] Requesting generateContent. Contents length: ${contents.length}`);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: PRIYA_SYSTEM_INSTRUCTION,
          tools: [{ functionDeclarations: [createAccountDeclaration, loginAccountDeclaration] }],
        }
      });

      const text = response.text;
      const functionCalls = response.functionCalls;

      if (functionCalls && functionCalls.length > 0) {
        console.log("[Gemini] Function calls requested:", JSON.stringify(functionCalls, null, 2));
        
        // Add model's turn (with function calls) to history
        contents.push(response.candidates?.[0]?.content as any);
        
        const responseParts: any[] = [];

        for (const call of functionCalls) {
          let result: any = { success: false, error: 'Unknown function' };

          if (call.name === 'create_account') {
            const { full_name, email, password, mobile_number, agreed_to_safety_terms } = call.args as any;
            
            console.log(`[Supabase] Initiating signUp for ${email}...`);
            if (!supabase) {
              result = { success: false, error: 'Database connection is not configured on the server.' };
            } else {
              try {
                // SignUp via Supabase Auth
                const { data, error } = await supabase.auth.signUp({
                  email,
                  password,
                  options: {
                    data: {
                      full_name,
                      mobile_number,
                      agreed_to_safety_terms
                    }
                  }
                });

                // STRICT LOGGING FOR DEBUGGING AS REQUESTED BY USER
                console.log("SUPABASE SIGNUP RESPONSE:", { data, error });

                if (error) {
                  result = { success: false, error: error.message };
                } else {
                  result = { success: true, name: full_name };
                  sessionUpdate = {
                    name: full_name,
                    email: email,
                    role: 'CUSTOMER',
                    isLoggedIn: true
                  };
                }
              } catch (err: any) {
                console.error("Supabase signup exception:", err);
                result = { success: false, error: err.message || 'Signup failed' };
              }
            }
          } else if (call.name === 'login_account') {
            const { email, password } = call.args as any;
            
            console.log(`[Supabase] Initiating signInWithPassword for ${email}...`);
            if (!supabase) {
              result = { success: false, error: 'Database connection is not configured on the server.' };
            } else {
              try {
                // SignIn via Supabase Auth
                const { data, error } = await supabase.auth.signInWithPassword({
                  email,
                  password
                });

                // STRICT LOGGING FOR DEBUGGING AS REQUESTED BY USER
                console.log("SUPABASE LOGIN RESPONSE:", { data, error });

                if (error) {
                  result = { success: false, error: error.message };
                } else {
                  const name = data.user?.user_metadata?.full_name || data.user?.email || 'Valued Customer';
                  result = { success: true, name };
                  sessionUpdate = {
                    name,
                    email: data.user?.email || email,
                    role: 'CUSTOMER',
                    isLoggedIn: true
                  };
                }
              } catch (err: any) {
                console.error("Supabase login exception:", err);
                result = { success: false, error: err.message || 'Login failed' };
              }
            }
          }

          responseParts.push({
            functionResponse: {
              name: call.name,
              response: result,
              id: call.id
            }
          });
        }

        // Push function response back to Gemini chat context
        contents.push({
          role: 'user',
          parts: responseParts
        });
      } else {
        // Return completed response to client
        return res.json({
          text: text || "Hello! How can I help you today?",
          session: sessionUpdate
        });
      }
    }

    res.status(500).json({ error: 'Max function calling loops reached' });
  } catch (error: any) {
    console.error('[Gemini API Error]:', error);
    res.status(500).json({ error: error.message || 'Internal server error calling Gemini API' });
  }
});

// Start server and handle Vite Middleware for SPA
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
