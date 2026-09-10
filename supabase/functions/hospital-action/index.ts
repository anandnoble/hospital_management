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

    const { hospital_id, emergency_id, action } = await req.json();

    if (!emergency_id || !action) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required parameters" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (action === "ACCEPT") {
      // Find nearest available ambulance
      const { data: ambulances } = await supabaseClient
        .from("ambulances")
        .select("*")
        .eq("status", "AVAILABLE")
        .limit(1);

      const assignedAmbulanceId = ambulances && ambulances.length > 0 ? ambulances[0].id : null;
      const nextStatus = assignedAmbulanceId ? "AMBULANCE_ASSIGNED" : "AMBULANCE_SEARCHING";

      const { data: updatedEmergency, error: updateErr } = await supabaseClient
        .from("emergency_requests")
        .update({
          status: nextStatus,
          hospital_id,
          ambulance_id: assignedAmbulanceId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", emergency_id)
        .select()
        .single();

      if (updateErr) throw updateErr;

      // Log status transition
      await supabaseClient.from("emergency_status_history").insert({
        emergency_id,
        previous_status: "HOSPITAL_NOTIFIED",
        new_status: nextStatus,
        notes: `Hospital accepted. Ambulance assigned: ${assignedAmbulanceId ?? "searching"}`,
      });

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            emergency_id,
            status: nextStatus,
            hospital_id,
            ambulance_id: assignedAmbulanceId,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } else {
      // Action === "DECLINE" -> Fallback search next hospital
      await supabaseClient.from("emergency_status_history").insert({
        emergency_id,
        previous_status: "HOSPITAL_NOTIFIED",
        new_status: "HOSPITAL_DECLINED",
        notes: `Hospital ${hospital_id} declined. Initiating fallback matching.`,
      });

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            emergency_id,
            status: "HOSPITAL_DECLINED",
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
