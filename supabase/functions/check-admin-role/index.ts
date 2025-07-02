import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization header missing" }), {
        headers: { "Content-Type": "application/json" },
        status: 401,
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      },
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: userError?.message || "User not found" }), {
        headers: { "Content-Type": "application/json" },
        status: 401,
      });
    }

    const { data: userData, error: userDataError } = await supabaseClient
      .from("user")
      .select("admin")
      .eq("uuid", user.id)
      .single();

    if (userDataError || !userData || !userData.admin) {
      return new Response(JSON.stringify({ error: "Access denied: Not an admin" }), {
        headers: { "Content-Type": "application/json" },
        status: 403,
      });
    }

    return new Response(JSON.stringify({ message: "Admin access granted" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});