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

    const { driver_id, ambulance_id, emergency_id, action, next_status } = await req.json();

    if (!emergency_id || !action) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing emergency_id or action" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    let targetStatus = "DRIVER_NAVIGATING";

    if (action === "ACCEPT") {
      targetStatus = "DRIVER_NAVIGATING";
      // Set ambulance status to ON_EMERGENCY
      if (ambulance_id) {
        await supabaseClient
          .from("ambulances")
          .update({ status: "ON_EMERGENCY" })
          .eq("id", ambulance_id);
      }
    } else if (action === "STATUS_UPDATE" && next_status) {
      targetStatus = next_status;
      if (next_status === "COMPLETED" && ambulance_id) {
        await supabaseClient
          .from("ambulances")
          .update({ status: "AVAILABLE" })
          .eq("id", ambulance_id);
      }
    } else if (action === "DECLINE") {
      targetStatus = "DRIVER_DECLINED";
    }

    const { data: updatedEmergency, error: err } = await supabaseClient
      .from("emergency_requests")
      .update({
        status: targetStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", emergency_id)
      .select()
      .single();

    if (err) throw err;

    // Log history
    await supabaseClient.from("emergency_status_history").insert({
      emergency_id,
      previous_status: updatedEmergency.status,
      new_status: targetStatus,
      notes: `Driver action: ${action} -> Status set to ${targetStatus}`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          emergency_id,
          status: targetStatus,
          updated_at: updatedEmergency.updated_at,
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
