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

    const { ambulance_id, emergency_id, latitude, longitude, heading, speed } = await req.json();

    if (!ambulance_id || !emergency_id || !latitude || !longitude) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required location parameters" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 1. Insert into ambulance_locations log table
    const { data: locationRecord, error: logErr } = await supabaseClient
      .from("ambulance_locations")
      .insert({
        ambulance_id,
        emergency_id,
        latitude,
        longitude,
        heading: heading || 0,
        speed: speed || 0,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (logErr) throw logErr;

    // 2. Update current_latitude & current_longitude in ambulances table
    await supabaseClient
      .from("ambulances")
      .update({
        current_latitude: latitude,
        current_longitude: longitude,
        updated_at: new Date().toISOString(),
      })
      .eq("id", ambulance_id);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          location_id: locationRecord.id,
          logged_at: locationRecord.updated_at,
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
