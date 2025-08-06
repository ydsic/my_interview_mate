import { useState } from 'react';
import Button from '../common/Button';
import { H2_content_title, H3_sub_detail } from '../common/HTagStyle';
import clsx from 'clsx';
import { topics } from '../../data/topics';
import type { Topic, TopicItem } from '../../data/topics';
import { Link } from 'react-router-dom';
import { useUserDataStore } from '../../store/userData';

const categoryStyles: Record<
  string,
  { bg: string; text: string; ring: string }
> = {
  'front-end': {
    bg: 'bg-front-bg-tag',
    text: 'text-front-text-tag',
    ring: 'text-front-text-tag',
  },
  cs: {
    bg: 'bg-cs-bg-tag',
    text: 'text-cs-text-tag',
    ring: 'text-cs-text-tag',
  },
  git: {
    bg: 'bg-git-bg-tag',
    text: 'text-git-text-tag',
    ring: 'text-git-text-tag',
  },
};

export default function UserMain() {
  const [selectedTopic, setSelectedTopic] = useState<{
    topic: Topic;
    item: TopicItem;
  }>({
    topic: topics[0],
    item: topics[0].items[0],
  });

  const currentCategory = selectedTopic.topic.category;
  const style = categoryStyles[currentCategory];

  const { nickname } = useUserDataStore((state) => state.userData);

  const handleSelect = (topic: Topic, item: TopicItem) => {
    setSelectedTopic({ topic, item });
  };
  return (
    <div className="flex flex-col w-full px-10 py-6 gap-10">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-10 rounded-4xl shadow-2xs space-y-4">
        <H2_content_title> 안녕하세요 {nickname} 님! 👋 </H2_content_title>
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

                {topic.items.map((item, index) => {
                  const isSelected =
                    selectedTopic.topic.category === topic.category &&
                    selectedTopic.item.title === item.title;

                  const styles = categoryStyles[topic.category];

                  return (
                    <div
                      key={index}
                      onClick={() => handleSelect(topic, item)}
                      className={clsx(
                        'flex flex-col justify-between p-4 gap-3 rounded-2xl shadow-sm/20 cursor-pointer transition hover:scale-105 hover:bg-gray-50 hover:border-gray-300',
                        isSelected
                          ? ['ring-2', styles.ring, styles.bg]
                          : 'bg-white',
                      )}
                    >
                      <p
                        className={clsx('text-base', isSelected && 'font-bold')}
                      >
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-70">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 선택된 주제 */}
        <div className="flex justify-between w-full ring-1 ring-gray-200 shadow-sm px-5 py-8 rounded-2xl">
          <div className="flex items-center gap-10">
            <p
              className={`${style.bg} ${style.text} text-lg font-bold px-8 py-3 rounded-2xl`}
            >
              {selectedTopic.topic.category}
            </p>
            <div>
              <p className="font-bold text-lg"> {selectedTopic.item.title} </p>
              <p className="text-sm text-gray-70"> 선택된 면접 주제 </p>
            </div>
          </div>
          <Link
            to={`/interview/${selectedTopic.topic.category}?topic=${selectedTopic.item.topicKey}`}
          >
            <Button> 면접 시작하기 </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
