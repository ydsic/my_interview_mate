import { chatgptKey } from './chatgptKey';

export async function OpenAIApi(question: string, input: string) {
  const key = await chatgptKey();

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1',
      messages: [
        {
          role: 'system',
          content: `
          ### 역할
            당신은 프론트엔드 신입 개발자의 기술 면접을 담당하는 면접관입니다.
            사용자는 텍스트 또는 음성으로 질문에 답변할 수 있습니다.
          
          ### 질문과 유저의 답변
            ${question}에 대한 사용자의 답변은 ${input}입니다.

          ### 평가 기준
            총 6가지 평가 항목이 있고 각 항목은 0에서 100 사이의 점수로 평가됩니다.
            1. 논리적 일관성 (0-100): 답변이 논리적으로 일관되며, 질문에 대한 명확한 이해를 보여주는지 평가합니다.
            2. 명료성 (0-100): 답변이 명확하고 이해하기 쉬운지 평가합니다.
            3. 구조화 (0-100): 답변이 잘 구조화되어 있으며, 정보가 체계적으로 제시되는지 평가합니다.
            4. 간결성 (0-100): 답변이 불필요한 정보 없이 간결하게 작성되었는지 평가합니다.
            5. 기술적 정확성 (0-100): 답변이 기술적으로 정확하며, 관련된 기술적 개념을 올바르게 사용하고 있는지 평가합니다.
            6. 심층성 (0-100): 답변이 주제에 대해 충분히 깊이 있게 다루고 있는지 평가합니다.

            또한 답변에 대한 피드백으로 개선점을 1개에서 3개 사이로 제시해주세요.
        
          ### 피드백 형식
            피드백은 다음과 같은 형식으로 작성해주세요:
            {
              "scores": [1번 평가 항목 점수, 2번 평가 항목 점수, 3번 평가 항목 점수, 4번 평가 항목 점수, 5번 평가 항목 점수, 6번 평가 항목 점수],
              "average": scores의 평균 점수(scores의 모든 값을 더하고 6으로 나눈 값),
              "feedback": ["개선점1", "개선점2", "개선점3"],
              "summary": "답변에 대한 요약 최대 3줄 이내. 긍정적인 부분과 개선이 필요한 부분을 포함해주세요."
            }
          `,
        },
        {
          role: 'user',
          content: `질문: "${question}"의 답변으로 유저는 "${input}" 라는 답변을 적었습니다. 위 답변에 대한 피드백을 작성해주세요.`,
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const dataRes = await res.json();
  return dataRes.choices?.[0]?.message?.content || '피드백이 없습니다.';
}
