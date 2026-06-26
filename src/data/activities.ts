export interface Activity {
  id: string;
  title: string;
  clubId: string;
  clubName: string;
  /** Short description shown on the carousel card. */
  shortDesc: string;
  /** Full description shown on the detail page. */
  description: string;
  /** Requirements / participation info. */
  requirements: string;
  /** Contact info for recruitment. */
  contact: string;
  /** Image path for the carousel (use club cover image). */
  image: string;
  /** Accent color for hover shadow, dot, and badge. */
  color: string;
  /** 'template': regular info-card layout. 'html': full-screen themed HTML page. */
  detailType?: 'template' | 'html';
}

export const activities: Activity[] = [
  {
    id: 'L1',
    title: '2026年度大戏',
    clubId: '15',
    clubName: 'Kaleido 万华境戏剧社',
    shortDesc: '年度舞台大戏，感受戏剧艺术的魅力',
    description:
      'Kaleido万华境戏剧社倾力呈现2026年度大戏。从剧本创作到舞台设计，从灯光音效到服装道具，每一个环节都凝聚了社团成员的心血与创意。欢迎所有热爱戏剧、热爱舞台的同学前来观演，与我们一同沉浸在戏剧艺术的世界中，感受故事的张力与人物的灵魂。',
    requirements:
      '1. 欢迎全校师生前来观演\n2. 请提前入场，演出期间保持安静\n3. 请勿使用闪光灯拍照\n4. 尊重演员及幕后工作人员\n5. 演出结束后设有演后谈环节',
    contact: '演出地点：校内剧场（具体日期将在后续通知）\nKaleido社团招新群：详见社团页面',
    image: '/covers/f41.jpg',
    color: '#C00000',
    detailType: 'html',
  },
  {
    id: 'L2',
    title: 'FTC夏校',
    clubId: '66',
    clubName: '极客工坊 E3 Lab',
    shortDesc: 'FTC通识课，对这个比赛感兴趣的同学可以参加',
    description:
      '本次FTC夏校由极客工坊（E3 Lab）主办，面向全校对FTC（First Tech Challenge）机器人比赛感兴趣的同学开设通识课程。课程将系统讲解FTC比赛的规则、机器人搭建基础、编程入门以及团队协作策略。无论你是否有机器人相关经验，都能在本次夏校中收获知识与实践的乐趣，为未来的FTC竞赛之路打下坚实基础。',
    requirements:
      '1. 对机器人技术和FTC比赛有浓厚兴趣\n2. 零基础亦可报名，无需任何前置经验\n3. 请自备笔记本电脑（用于编程实践）\n4. 需全程参与夏校课程\n5. 名额有限，先到先得',
    contact: '联系人：17321347559 / 19901646246\n活动地点：极客工坊活动教室（科技楼3楼）',
    image: '/covers/b7.jpg',
    color: '#C8BEA8',
  },
  {
    id: 'L3',
    title: '第四届世外卡丁车赛',
    clubId: '44',
    clubName: '世外汽车社 Power Galaxy',
    shortDesc: '校内卡丁车竞速赛，追逐你的车王之梦！',
    description:
      '世外汽车社Power Galaxy将在暑假举行校内同学们相互竞争的卡丁车赛，我们通过比赛互相熟悉，学习团队合作，追逐我们对汽车的梦想和热爱。我们没有准入门槛，只要你对汽车，赛车感兴趣并且有着一颗成为世外车王的心，那就加入我们比赛吧！期待你的到来！',
    requirements:
      '1. 对汽车和赛车运动有兴趣\n2. 无准入门槛，欢迎所有同学参加\n3. 请遵守比赛规则和安全要求\n4. 需提前报名，名额有限\n5. 比赛当天请准时到场',
    contact: '社长微信：1316986815\n活动地点：校外卡丁车赛场（具体位置将在报名后通知）',
    image: '/covers/f50.jpg',
    color: '#E90404',
  },
];