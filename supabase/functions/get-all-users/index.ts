import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const perPage = parseInt(url.searchParams.get('perPage') || '10', 10);

    const {
      data: { users, total },
      error: usersError,
    } = await supabaseAdmin.auth.admin.listUsers({
      page: page,
      perPage: perPage,
    });

    if (usersError) throw usersError;

    const userIds = users.map((user) => user.id);

    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('user')
      .select('*')
      .in('uuid', userIds);

    if (profileError) throw profileError;

    const profileMap = new Map(profiles.map((p) => [p.uuid, p]));

    const combinedUsers = users.map((user) => {
      const profile = profileMap.get(user.id);
      return {
        ...user,
        ...profile,
        user_id: profile?.user_id || user.id,
        uuid: user.id,
      };
    });

    return new Response(JSON.stringify({ users: combinedUsers, total }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});