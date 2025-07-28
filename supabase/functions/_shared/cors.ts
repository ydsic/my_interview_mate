const allowedOrigins = [
  'http://localhost:5173',
  'https://my-interview-mate.vercel.app',
  'https://aimigo.kr',
];

export const getCorsHeaders = (origin: string | null) => {
  const allowOrigin =
    origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type, x-requested-with',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
};

export const corsHeaders = getCorsHeaders(null);
