import {
  H1_big_title,
  H2_content_title,
  H3_sub_detail,
  H5_button,
} from '../components/common/HTagStyle';

export default function StyleTest() {
  return (
    <div className="min-h-screen bg-gray-15 text-gray-85 font-sans p-8 space-y-8">
      <h1 className="text-4xl font-bold text-gray-100">🎨 Style Test</h1>

      {/* HTag 컴포넌트 테스트 */}
      <section className="space-y-2">
        <H1_big_title>H1_big_title - 26px / font-black</H1_big_title>
        <H2_content_title>H2_content_title - 24px / font-bold</H2_content_title>
        <H3_sub_detail>H3_sub_detail - 22px / font-semibold</H3_sub_detail>
        <H5_button>H5_button - 그라디언트 + hover</H5_button>
        <H1_big_title>폰트 적용 유무 알아보기</H1_big_title>
        <p>폰트 적용 유무 알아보기</p>
      </section>

      {/* 텍스트 색상 테스트 */}
      <section className="space-y-2">
        <p className="text-xl text-gray-100">gray-100 텍스트</p>
        <p className="text-xl text-gray-85">gray-85 텍스트</p>
        <p className="text-xl text-gray-70">gray-70 텍스트</p>
        <p className="text-xl text-gray-40">gray-40 텍스트</p>
        <p className="text-xl text-gray-25">gray-25 텍스트</p>
        <p className="text-xl text-blue-100">blue-100 텍스트</p>
        <p className="text-xl text-front-text-tag">front-text-tag</p>
        <p className="text-xl text-cs-text-tag">cs-text-tag</p>
        <p className="text-xl text-git-text-tag">git-text-tag</p>
        <p className="text-xl text-orange-100">orange-100 텍스트</p>
      </section>

      {/* 배경 색상 테스트 */}
      <section className="space-y-2">
        <div className="p-4 rounded-md bg-blue-30 text-blue-100 font-medium">
          bg-blue-30
        </div>
        <div className="p-4 rounded-md bg-blue-10 text-blue-100 font-medium">
          bg-blue-10
        </div>
        <div className="p-4 rounded-md bg-purple-10 text-gray-100 font-medium">
          bg-purple-10
        </div>
        <div className="p-4 rounded-md bg-orange-10 text-gray-100 font-medium">
          bg-orange-10
        </div>
        <div className="p-4 rounded-md bg-yellow-10 text-gray-100 font-medium">
          bg-yellow-10
        </div>
      </section>

      {/* 태그 테스트 */}
      <section className="flex gap-4 flex-wrap">
        <div className="bg-front-bg-tag text-front-text-tag px-4 py-2 rounded-full text-sm font-semibold">
          Front Tag
        </div>
        <div className="bg-cs-bg-tag text-cs-text-tag px-4 py-2 rounded-full text-sm font-semibold">
          CS Tag
        </div>
        <div className="bg-git-bg-tag text-git-text-tag px-4 py-2 rounded-full text-sm font-semibold">
          Git Tag
        </div>
      </section>

      {/* 버튼 테스트 */}
      <section className="flex gap-4 flex-wrap">
        <button className="px-6 py-3 bg-button-l text-white rounded-lg hover:bg-button-l-h transition">
          왼쪽 버튼
        </button>
        <button className="px-6 py-3 bg-button-r text-white rounded-lg hover:bg-button-r-h transition">
          오른쪽 버튼
        </button>
      </section>

      {/* 밝은 배경 + 진한 텍스트 조합 */}
      <section className="space-y-2">
        <div className="p-4 rounded bg-white text-gray-100">
          bg-white + text-gray-100
        </div>
        <div className="p-4 rounded bg-gray-100 text-white">
          bg-gray-100 + text-white
        </div>
      </section>
    </div>
  );
}
