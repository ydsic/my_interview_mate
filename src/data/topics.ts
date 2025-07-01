export type TopicItem = {
  title: string;
  description: string;
  topicKey: string;
};

export type Topic = {
  category: string;
  subText: string;
  colorClass: string;
  items: TopicItem[];
};

export const topics: Topic[] = [
  {
    category: 'front-end',
    subText: '프론트엔드 개발 기술',
    colorClass: 'text-front-text-tag',
    items: [
      {
        title: 'React',
        description: '컴포넌트, Hooks, 상태관리',
        topicKey: 'react',
      },
      {
        title: 'JavaScript',
        description: 'ES6+, 비동기, 클로저',
        topicKey: 'javascript',
      },
      {
        title: 'Next.js',
        description: 'SSR, SSG, 라우팅',
        topicKey: 'nextjs',
      },
    ],
  },
  {
    category: 'cs',
    subText: '컴퓨터 사이언스 기초',
    colorClass: 'text-cs-text-tag',
    items: [
      {
        title: '네트워크 & HTTP',
        description: '네트워크 계층, 프로토콜',
        topicKey: 'network',
      },
      {
        title: '브라우저 렌더링',
        description: '렌더링 과정, Critical Path',
        topicKey: 'rendering',
      },
    ],
  },
  {
    category: 'git',
    subText: '버전 관리 시스템',
    colorClass: 'text-git-text-tag',
    items: [
      {
        title: 'Git',
        description: '브랜치, 머지, 리베이스',
        topicKey: 'git',
      },
    ],
  },
];
