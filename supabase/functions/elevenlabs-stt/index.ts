import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const allowedOrigins = [
  'http://localhost:5173', // 개발
  'https://my-interview-mate.vercel.app', // 실제 배포 도메인(예시, 실제 도메인으로 교체)
];

serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const allowOrigin = allowedOrigins.includes(origin) ? origin : '';

  if (req.method === 'OPTIONS') {
    // Preflight CORS 응답
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Missing authorization header', {
      status: 401,
      headers: { 'Access-Control-Allow-Origin': allowOrigin },
    });
  }
  const jwt = authHeader.replace('Bearer ', '');

  // Supabase client 생성 (서비스키는 환경변수로)
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // JWT로 유저 검증
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jwt);
  if (error || !user) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'Access-Control-Allow-Origin': allowOrigin },
    });
  }

  const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
  if (!apiKey) {
    return new Response('API Key not set', {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': allowOrigin },
    });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!file) {
    return new Response('No file uploaded', {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': allowOrigin },
    });
  }

  // ElevenLabs API에 요청
  const elevenRes = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey },
    body: formData,
  });

  const data = await elevenRes.json();
  return new Response(JSON.stringify(data), {
    status: elevenRes.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
});
