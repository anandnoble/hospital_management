import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Fallback emergency questions in case Gemini API is offline
const FALLBACK_QUESTIONS = [
  {
    question: "Is the patient conscious and responsive right now?",
    suggested: ["Yes, fully conscious", "Drowsy / Confused", "Unconscious"],
  },
  {
    question: "Is the patient breathing normally or gasping for air?",
    suggested: ["Breathing normally", "Shortness of breath", "Severe difficulty breathing"],
  },
  {
    question: "Is anyone currently present with the patient to assist?",
    suggested: ["Yes, family member", "Bystanders present", "Patient is alone"],
  },
  {
    question: "Does the patient have known medical conditions like diabetes, hypertension, or past heart issues?",
    suggested: ["Yes, diabetes", "Heart condition history", "No prior medical conditions"],
  },
  {
    question: "Your patient profile has previous medical reports. Would you like to grant ER staff access to relevant reports?",
    suggested: ["Grant ER Access", "Skip for now"],
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { emergency_id, patient_message, step = 0, chief_complaint = "Emergency medical assistance required" } = await req.json();
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

    let aiQuestion = "";
    let suggestedAnswers: string[] = [];

    // If Gemini API key is available, generate dynamic response using Gemini 1.5 Flash / Gemini models
    if (geminiApiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

        const promptText = `
You are an AI Emergency Healthcare Coordinator assistant during an active emergency dispatch.
The patient's chief complaint is: "${chief_complaint}".
The latest message from patient: "${patient_message || 'Emergency started'}".
Ask ONE single, crucial, concise question (max 15 words) to collect useful context for the arriving hospital ER doctor.
Return your response strictly in valid JSON format:
{
  "question": "Your single short question here",
  "suggested": ["Answer 1", "Answer 2", "Answer 3"]
}
`;

        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
          }),
        });

        const geminiData = await geminiRes.json();
        const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Extract JSON block from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          aiQuestion = parsed.question;
          suggestedAnswers = parsed.suggested || [];
        }
      } catch (err) {
        console.warn("Gemini API call failed, using fallback static questions:", err);
      }
    }

    // Fallback if Gemini key is not set or parsing failed
    if (!aiQuestion) {
      const currentStep = Math.min(step, FALLBACK_QUESTIONS.length - 1);
      const fallbackObj = FALLBACK_QUESTIONS[currentStep];
      aiQuestion = fallbackObj.question;
      suggestedAnswers = fallbackObj.suggested;
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          emergency_id,
          ai_question: aiQuestion,
          suggested_answers: suggestedAnswers,
          next_step: step + 1,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
