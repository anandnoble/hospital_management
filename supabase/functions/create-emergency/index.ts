import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { patient_id, chief_complaint, input_type, location, requires_ambulance } = await req.json();

    if (!chief_complaint || !location?.latitude || !location?.longitude) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing emergency requirements" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 1. Fetch nearest available active hospital
    const { data: hospitals } = await supabaseClient
      .from("hospitals")
      .select("*")
      .eq("is_active", true)
      .limit(1);

    const targetHospitalId = hospitals && hospitals.length > 0 ? hospitals[0].id : null;

    // 2. Insert emergency request
    const { data: emergency, error: emergencyErr } = await supabaseClient
      .from("emergency_requests")
      .insert({
        patient_id: patient_id || "a1111111-1111-1111-1111-111111111111",
        chief_complaint,
        input_type: input_type || "text",
        status: "HOSPITAL_NOTIFIED",
        patient_latitude: location.latitude,
        patient_longitude: location.longitude,
        patient_address: location.address_text || "Rajahmundry",
        hospital_id: targetHospitalId,
      })
      .select()
      .single();

    if (emergencyErr) throw emergencyErr;

    // 3. Log initial status history
    await supabaseClient.from("emergency_status_history").insert({
      emergency_id: emergency.id,
      previous_status: "REQUESTED",
      new_status: "HOSPITAL_NOTIFIED",
      notes: "Emergency created and hospital notified via FCM trigger",
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          emergency_id: emergency.id,
          status: emergency.status,
          hospital_id: targetHospitalId,
          created_at: emergency.created_at,
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
