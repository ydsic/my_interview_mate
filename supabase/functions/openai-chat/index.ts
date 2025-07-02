import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const allowedOrigins = [
  'http://localhost:5173',
  'https://my-interview-mate.vercel.app',
];

serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const allowOrigin = allowedOrigins.includes(origin) ? origin : '';

  if (req.method === 'OPTIONS') {
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

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
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

  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    return new Response('API Key not set', {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': allowOrigin },
    });
  }

  const body = await req.json();
  const { question, input } = body;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `
          ### 역할
            당신은 프론트엔드 신입 개발자의 기술 면접을 담당하는 면접관이다.
            사용자는 텍스트 또는 음성으로 질문에 답변할 수 있다.
          
          ### 질문과 유저의 답변
            질문: ${question}
            답변: ${input}

          ### 평가 기준
            총 6가지 평가 항목이 있고 각 항목은 0에서 100 사이의 점수로 평가.
            1. 논리적 일관성 (0-100): 답변이 논리적으로 일관되며, 질문에 대한 명확한 이해를 보여주는지 평가.
            2. 명료성 (0-100): 답변이 명확하고 이해하기 쉬운지 평가.
            3. 구조화 (0-100): 답변이 잘 구조화되어 있으며, 정보가 체계적으로 제시되는지 평가.
            4. 기술적 정확성 (0-100): 답변이 기술적으로 정확하며, 관련된 기술적 개념을 올바르게 사용하고 있는지 평가.
            5. 심층성 (0-100): 답변이 주제에 대해 충분히 깊이 있게 다루고 있는지 평가.
            또한 답변에 대한 피드백으로 개선점을 1개에서 3개 사이로 제시해라.
        
          ### 출력(JSON) - 예시 포맷
          {
            "question": "React란 무엇이고 왜 사용하나요?",
            "input": "React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리입니다.",
            "scores": [78, 82, 75, 80, 70],
            "average": 78.8,
            "feedback": ["제어문 예시를 추가해 논리성 강화", "불필요한 반복 문장 제거"], 
            "summary": "핵심 개념은 정확하나 예시 부족으로 심층성이 낮음.",
            "answer": "React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리로, 컴포넌트 기반 아키텍처를 통해 재사용성과 유지보수성을 높이고, 가상 DOM을 사용하여 성능을 최적화합니다."
          }

          ### 주의사항
            * 각 항목의 점수는 0에서 100 사이의 정수.
            * 'scores'는 5개의 점수 배열로, 각 항목의 점수를 순서대로 포함한다.
            * 'average'는 'scores' 배열의 평균 점수로, 소수점은 표시하지 않으며 반올림한다.
            * 'feedback'은 사용자의 답변에 대한 개선점을 제시하는 배열로, 각 항목은 1개에서 3개 사이의 문자열이어야 한다.
            * 'summary'는 답변에 대한 간단한 요약으로, 최대 3줄로 작성되어야 한다.
            * 'answer'는 질문에 대한 정답으로, 정석적인 답변으로 작성한다. 단, 위 상황은 말에서 말로 답변하는 상황이므로, 코드로 답변하지 않고 자연어로 답변한다.
            * 출력은 반드시 JSON 형식이어야 하며, 문자열은 큰따옴표로 감싸야 한다.
            * 출력 예시와 동일한 형식을 따라야 한다.
          `,
        },
        {
          role: 'user',
          content: `질문: "${question}"의 답변으로 유저는 "${input}" 라는 답변을 적었습니다. 위 답변에 대한 피드백을 작성해주세요.`,
        },
      ],
    }),
  });

  const data = await res.json();
  let feedbackObj = null;
  try {
    feedbackObj = JSON.parse(data.choices?.[0]?.message?.content || '{}');
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'OpenAI 응답 파싱 실패', detail: e?.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        },
      },
    );
  }
  return new Response(JSON.stringify(feedbackObj), {
    status: res.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
});
