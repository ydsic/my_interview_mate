import { useState } from 'react';
import Button from '../common/Button';
import { H2_content_title, H3_sub_detail } from '../common/HTagStyle';

type TopicItem = {
  title: string;
  description: string;
};

type Topic = {
  category: string;
  subText: string;
  colorClass: string;
  items: TopicItem[];
};

const topics: Topic[] = [
  {
    category: 'Front-end',
    subText: '프론트엔드 개발 기술',
    colorClass: 'text-front-text-tag',
    items: [
      {
        title: 'React',
        description: '컴포넌트, Hooks, 상태관리',
      },
      {
        title: 'JavaScript',
        description: 'ES6+, 비동기, 클로저',
      },
      {
        title: 'Next.js',
        description: 'SSR, SSG, 라우팅',
      },
    ],
  },
  {
    category: 'CS',
    subText: '컴퓨터 사이언스 기초',
    colorClass: 'text-cs-text-tag',
    items: [
      {
        title: '네트워크 & HTTP',
        description: '네트워크 계층, 프로토콜',
      },
      {
        title: '브라우저 렌더링',
        description: '네트워크 계층, 프로토콜',
      },
    ],
  },
  {
    category: 'Git',
    subText: '버전 관리 시스템',
    colorClass: 'text-git-text-tag',
    items: [
      {
        title: 'Git',
        description: '브랜치, 머지, 리베이스',
      },
    ],
  },
];

export default function UserMain() {
  const [selectedTopic, setSelectedTopic] = useState<{
    topic: Topic;
    item: TopicItem;
  }>({
    topic: topics[0],
    item: topics[0].items[0],
  });

  const handleSelect = (topic: Topic, item: TopicItem) => {
    setSelectedTopic({ topic, item });
  };

  return (
    <div className="flex flex-col w-full px-10 py-6 gap-10">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-10 rounded-4xl shadow-2xs space-y-4">
        <H2_content_title> 안녕하세요 김면접님! 👋 </H2_content_title>
        <p> 오늘도 프론트엔드 개발자 면접 준비를 시작해볼까요? </p>
      </div>

      {/* 면접 주제 선택 박스 */}
      <div className=" flex flex-col items-center gap-15 bg-white rounded-4xl shadow-md px-20 py-12">
        <div className="text-center">
          <H3_sub_detail> 면접 주제 선택 </H3_sub_detail>
          <p className="text-gray-70 mt-3">
            준비하고 싶은 면접 주제를 선택해주세요.
          </p>
        </div>

        {/* 주제 선택 버튼 */}
        <div className="flex justify-center w-full ">
          <div className="grid grid-cols-3 gap-10 text-center w-full ">
            {topics.map((topic) => (
              <div key={topic.category} className="flex flex-col gap-5">
                <div>
                  <p className={`font-semibold text-lg ${topic.colorClass}`}>
                    {topic.category}
                  </p>
                  <p className="text-sm text-gray-70"> {topic.subText} </p>
                </div>

                {topic.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between shadow-sm/20 p-4 gap-5 rounded-2xl"
                    onClick={() => handleSelect(topic, item)}
                  >
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-70"> {item.description} </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 선택된 주제 */}
        <div className="flex justify-between w-full ring-1 ring-gray-200 shadow-sm px-5 py-8 rounded-2xl">
          <div className="flex items-center gap-10">
            <p className="bg-front-bg-tag text-front-text-tag text-lg font-bold px-8 py-3 rounded-2xl">
              {selectedTopic.topic.category}
            </p>
            <div>
              <p className="font-bold text-lg"> {selectedTopic.item.title} </p>
              <p className="text-sm text-gray-70"> 선택된 면접 주제 </p>
            </div>
          </div>

          <Button> 면접 시작하기 </Button>
        </div>
      </div>
    </div>
  );
}
