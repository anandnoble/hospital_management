import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Pre-configured emergency questions engine
const PROGRESSIVE_QUESTIONS = [
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

    const { emergency_id, patient_message, step = 0 } = await req.json();

    const currentStep = Math.min(step, PROGRESSIVE_QUESTIONS.length - 1);
    const nextQ = PROGRESSIVE_QUESTIONS[currentStep];

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          emergency_id,
          ai_question: nextQ.question,
          suggested_answers: nextQ.suggested,
          next_step: currentStep + 1,
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
