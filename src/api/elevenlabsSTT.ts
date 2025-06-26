// 이 코드 파일 하단에 STT에 대한 고찰과 각종 설명이 적혀있습니다.

export async function elevenLabsSTT(audioBlob: Blob): Promise<string> {
  const apiKey = 'sk_7e6fb3d574ba157e3c87e1ace98e545245507ae2e52b6cef';
  const url = 'https://api.elevenlabs.io/v1/speech-to-text';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  if (audioBlob.size === 0) {
    throw new Error('오디오 파일이 비어있습니다.');
  }

  let fileName = 'audio.webm';
  if (audioBlob.type.includes('mp4')) {
    fileName = 'audio.mp4';
  } else if (audioBlob.type.includes('wav')) {
    fileName = 'audio.wav';
  } else if (audioBlob.type.includes('ogg')) {
    fileName = 'audio.ogg';
  }

  const formData = new FormData();
  formData.append('file', audioBlob, fileName);
  formData.append('model_id', 'scribe_v1');
  formData.append('language_code', 'ko');
  formData.append('timestamps_granularity', 'word');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('STT API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      });

      let errorMsg = `STT API 요청 실패 (${response.status})`;

      try {
        const errData = JSON.parse(responseText);
        if (errData.error) {
          errorMsg += `: ${errData.error}`;
        } else if (errData.message) {
          errorMsg += `: ${errData.message}`;
        }
      } catch {
        if (responseText) {
          errorMsg += `: ${responseText.substring(0, 100)}`;
        }
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log('STT Response data:', data);

    let text = '';
    if (data.text) {
      text = data.text;
    } else if (data.transcript) {
      text = data.transcript;
    } else if (typeof data === 'string') {
      text = data;
    } else {
      console.warn('Unexpected response format:', data);
      throw new Error('응답에서 텍스트를 찾을 수 없습니다.');
    }

    return text.trim();
  } catch (error) {
    console.error('STT API 호출 중 오류:', error);

    if (error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다. 다시 시도해주세요.');
    }

    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('STT API 호출 중 알 수 없는 오류가 발생했습니다.');
    }
  }
}

// Docs : https://elevenlabs.io/docs/capabilities/speech-to-text
// Error Message Docs : https://elevenlabs.io/docs/error-messages

// Eleven Labs STT API의 대한 고찰
// Eleven Labs의 STT에서 단어 오류율(WER)은 5% 미만으로 뛰어난 성능을 자랑함 (영어권 기준)
// 한국어의 WER은 약 10% ~ 25% 정도로 다소 정확도가 떨어진다는 수치가 Docs에 표기되어 있음
// 그래서 일부로 악조건인 환경에서 테스트를 좀 해본 결과 90% 이상의 높은 정확도를 보여줘서 성능적으론 부족함이 없다고 판단

// 출력은 3가지의 범주로 나뉘어지는데 word, spacing, audio_event
// word는 일반적인 단어
// spacing은 한국어 기준으로 띄어쓰기
// audio_event는 비언어(예시로, 아무런 소리가 들어가지 않은 녹음본) 처리는 효과음으로 text가 처리됩니다. (ex. 과잉 칠 효과음, 화면 전환 효과음 << 이라고 text에 표시)

// 왜 Eleven Labs 냐?
// 1. 무료 (ChatGPT API 중 현재 Beta 테스트 중인 Realtime 이란 API 기능이 있는데 이건 실시간으로 STT 처리를 해주는 API이지만 비용이 매우 비싸다는 단점이 있다.
// Input : $100 / 1M, Output : $200/1M 로 사용 후기로는 1분당 1달러로 추정된다는 글이 있음)

// 2. 빠른 응답속도
// ChatGPT API Realtime처럼 실시간 처리 지원은 하지 않고 녹음파일을 처리하는 방식이지만 꽤 빠른 처리속도를 보여줌
// 또한 현 프로젝트에서 실시간으로 ai와 사용자 둘 다 STT&TTS를 구현하고 면접 분위기와 똑같이 만들기엔 나의 실력 문제가 있음

// 단점이라면 IT특성상 기술 용어를 영어로 말할 때가 많은데 전문용어들이나 말하는 중간에 영어를 섞어서 쓰는 경우 구분을 잘 못하여 잘못된 결과가 출력되는 상황이 나옴

// 그래서 어떤 식으로 구현을 했냐?
// 실제 구현 방식 및 주요 처리 흐름 설명
// 1. 입력값 검증: audioBlob이 비어있으면 즉시 에러를 발생시켜 불필요한 API 호출을 막음
// 2. 파일명 및 타입 결정: 브라우저/환경에 따라 녹음 포맷이 다르므로 Blob의 타입에 따라 파일명을 자동 지정
// 3. FormData 구성: file(음성), model_id(모델), language_code(언어), timestamps_granularity(타임스탬프 단위) 등 ElevenLabs 요구 파라미터를 모두 명시적으로 추가
// 4. API 요청: fetch로 POST 요청, 헤더에 API 키 포함
// 5. 응답 처리: 실패 시 응답 본문까지 파싱해 상세 에러 메시지 제공, 성공 시 다양한 응답 포맷(text, transcript, string 등)에 대응하여 텍스트 추출
// 6. 예외 처리: 네트워크/파싱 등 모든 예외 상황을 catch하여 콘솔과 사용자 모두에게 에러를 알림
//
// 이런 구조로 작성한 이유:
// - 다양한 환경(브라우저/OS)에서의 호환성
// - 한국어 인식률 최적화 및 최신 모델 사용
// - 예상치 못한 응답 포맷/에러에도 유연하게 대응
//
// 이 방식은 실서비스에서의 안정성, 유지보수성, 그리고 실제 사용자 경험을 모두 고려하여 설계

// 왜 Blob을 사용했냐?
//
// 1. 브라우저 녹음 데이터의 표준 포맷
//    - MediaRecorder, getUserMedia 등 브라우저의 오디오 녹음 API는 음성 데이터를 Blob 형태로 반환함.
//    - Blob은 오디오뿐 아니라 이미지, 비디오 등 다양한 바이너리 데이터를 효율적으로 다룰 수 있는 웹 표준 객체.
//
// 2. 파일 업로드와의 자연스러운 연동
//    - ElevenLabs STT API는 실제 오디오 파일(즉, 바이너리 데이터)을 FormData의 file 필드로 받도록 설계되어 있음.
//    - Blob은 FormData에 바로 append 할 수 있어, 별도의 변환 없이 서버로 전송이 가능함.
//
// 3. 다양한 오디오 포맷 지원
//    - Blob 객체는 타입(mimeType) 정보를 포함할 수 있어, webm/mp4/wav/ogg 등 다양한 포맷을 유연하게 처리할 수 있음.
//    - 이로 인해 브라우저/환경별로 녹음 포맷이 달라도 코드가 유연하게 대응할 수 있음.
//
// 4. 효율성과 확장성
//    - Blob은 효율적으로 대용량 데이터를 다룰 수 있고, slice 등 다양한 조작이 가능함.
//    - 추후 오디오 편집, 부분 업로드, 실시간 스트리밍 등 확장에도 유리함.
//
// 5. File, ArrayBuffer, Base64 등과 비교
//    - File은 Blob을 상속한 객체로, 파일명 등 추가 정보가 필요할 때만 사용(녹음 데이터는 파일명 필요 없음)
//    - ArrayBuffer, Uint8Array 등은 바이너리 조작에는 좋지만, FormData에 바로 append 불가(Blob으로 변환 필요)
//    - Base64는 용량이 30% 이상 커지고, 변환 비용이 추가됨(비효율적)
//
// 결론: 브라우저 녹음 데이터의 표준이자, 서버 업로드/호환성/확장성/성능 모든 면에서 Blob이 가장 적합하기 때문에 Blob을 사용함

// 추가 설명이나 개선이 필요하면 언제든 요청 가능
