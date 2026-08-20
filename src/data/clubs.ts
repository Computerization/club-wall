export type Category = 'Sports' | 'Arts' | 'Service' | 'Life' | 'Academic';

export type Rating = 'five-star' | 'outstanding';

export interface Club {
  id: string;
  name: string;
  category: Category;
  /** Short English focus label shown as the accent line. */
  shortDesc: string;
  /** Recruitment tags supplied by the club (empty for clubs that haven't submitted). */
  tags: string[];
  /** One-line intro (一句话简介); empty falls back to a generated blurb. */
  description: string;
  /** Club president name (正社长). */
  president: string;
  /** Vice-president names (副社长); empty if none. */
  vicePresidents: string[];
  /** Theme colors derived from the club's logo: [light, main, dark]. */
  theme: [string, string, string];
  contact: string;
  rating?: Rating;
}

// Categories shown as auto-scrolling rows. `ClubsToBeEstablished` is intentionally
// excluded — it renders as its own static row at the bottom of the home page.
export const categories: Category[] = ['Sports', 'Arts', 'Service', 'Life', 'Academic'];

// Source of truth: materials/社团招新海报内容收集.xlsx. Clubs that submitted recruitment
// info carry their real name / category / tags / intro; the rest of the roster keeps
// placeholder copy until they submit.
export const clubs: Club[] = [
    { id: "1", theme: ["#f1e8c1", "#e0cd77", "#645c35"], president: "缪紫菀", vicePresidents: ["袁逸凡", "李卓曈", "李木子"], name: "光度心理社", category: "Academic", shortDesc: "Psychology", tags: ["自我探索", "艺术手工", "学术培养"], description: "心理学是一个非常宽泛有趣的学科，因此我们可以在社团的时候做任何事！期待你们加入这个温暖的大家庭…", contact: "17701896102", rating: "outstanding" },
    { id: "2", theme: ["#b9bbcc", "#65688e", "#2d2e3f"], president: "江易阳", vicePresidents: [], name: "WFLA Bulletin英文报社", category: "Academic", shortDesc: "English Press", tags: ["Editors", "Reporters", "Layout Artists", "Anyone"], description: "Observe the world. Own who you are.", contact: "Alex09JYY" },
    { id: "3", theme: ["#d4d3c9", "#a09f87", "#48473c"], president: "夏梓瑞", vicePresidents: ["李南辙", "李亦埼", "徐靖舜"], name: "化学社", category: "Academic", shortDesc: "Chemistry", tags: ["学术", "多元", "链接"], description: "硬核讲座&整活实验，这就是化学社！", contact: "13651697757", rating: "outstanding" },
    { id: "4", theme: ["#959ba0", "#14222d", "#090f14"], president: "黄奕婷", vicePresidents: ["张周涵"], name: "世外商业社", category: "Academic", shortDesc: "Business", tags: ["商业脑洞", "案例拆解", "实战体验", "一起搞钱"], description: "一个用案例和活动，带大家看懂世界、成为世外首富的社团", contact: "TriLight_05" },
    { id: "5", theme: ["#f0c9b2", "#de8754", "#633c25"], president: "王思允", vicePresidents: ["王坤奕", "钱简文", "卢子滢"], name: "世外经济社", category: "Academic", shortDesc: "Economics", tags: ["硬核知识", "新手友好", "轻松氛围"], description: "在这里，像亚当·斯密一样思考，像乔布斯一样创造", contact: "wsy090928_" },
    { id: "6", theme: ["#c9b7c5", "#885f7f", "#3d2a39"], president: "韩晓琳", vicePresidents: ["须潆莹"], name: "模拟法庭社", category: "Academic", shortDesc: "Moot Court", tags: ["法学", "思辨", "演绎"], description: "同学，想体验《逆转裁判》的快乐吗？ 如果你喜欢辩论、擅长临场应变，或者想体验当庭对峙的刺激感，模拟法庭社就是你的选择！", contact: "", rating: "outstanding" },
    { id: "7", theme: ["#9a9696", "#201616", "#0e0909"], president: "周思谊", vicePresidents: ["夏梓瑞"], name: "模联社", category: "Academic", shortDesc: "Model UN", tags: ["世界", "思考", "全面", "包容"], description: "开模拟会… 草案，立场文件…手把手教学 会带着备赛，模联技巧分享（正经+不正经… 帮你克服焦虑 特别欢迎0基础 丰富CS时间 （ib生存经验传授也可以包含", contact: "" },
    { id: "8", theme: ["#cabbd2", "#8a699b", "#3e2f45"], president: "袁逸凡", vicePresidents: ["吴问涵", "张雨萱"], name: "拓科传媒", category: "Academic", shortDesc: "Tech & Media", tags: ["科技", "传媒"], description: "作为华东首家独立学生创客社团，TechMedia带你追踪前沿科技、玩转社交媒体，邂逅科技与传媒的独特跨界魅力。", contact: "18149722772", rating: "outstanding" },
    { id: "9", theme: ["#b7b7c3", "#61607b", "#2b2b37"], president: "孙乾瑞", vicePresidents: ["陆柔嘉", "杨亦晴"], name: "響日语社", category: "Academic", shortDesc: "Japanese", tags: ["日本文化", "轻量化", "趣味活动", "包容开放"], description: "我们是HIBIKI日语社，主要关注日本文化，是大家于此兴趣的交流平台", contact: "" },
    { id: "10", theme: ["#dbd89a", "#afaa20", "#4e4c0e"], president: "陈诺", vicePresidents: ["陈柏亦", "袁金灿"], name: "WFLA 数学社", category: "Academic", shortDesc: "Math", tags: ["数学", "思维", "竞赛", "钻研"], description: "数学基础和竞赛水平并不是玩转数学的必要条件；只要你对数学保有好奇和热情，WFLA数学社都欢迎你的加入！无论是讨论竞赛技巧与趣味题目，亦或探索高等数学和深层理论，这里都有你的一席之地！", contact: "" },
    { id: "11", theme: ["#ffffff", "#f0f0f0", "#b8b8b8"], president: "吴佳仪", vicePresidents: ["张诗韵"], name: "起源社", category: "Academic", shortDesc: "Gender Education", tags: ["性别教育", "性别科普", "心理健康", "多元平等"], description: "Origin聚焦性别教育、性别生理科学科普、性别心理健康、多元性别LGBTQ+平等。严谨探讨，交流，并进行科普。", contact: "HYuK07_Z6h5Ej" },
    { id: "12", theme: ["#ffffff", "#f0f0f0", "#b8b8b8"], president: "陈秋吟", vicePresidents: ["王煦今", "叶楠", "赵一菡"], name: "嘎嘣脆语言文学社", category: "Academic", shortDesc: "Linguistics & Literature", tags: ["文学", "写作", "语言学"], description: "以语言为媒，与文字、山海、灵魂温柔相逢", contact: "", rating: "outstanding" },
    { id: "13", theme: ["#ffffff", "#f0f0f0", "#b8b8b8"], president: "蔡宇扬", vicePresidents: ["缪紫菀", "徐梓然"], name: "WFLA 神经科学社", category: "Academic", shortDesc: "Neuroscience", tags: ["前沿", "神秘"], description: "每一个大脑都有自己的语言，等你来解！", contact: "s20160619cyy", rating: "five-star" },
    { id: "14", theme: ["#d7b7af", "#a75f4e", "#4b2a23"], president: "叶楠", vicePresidents: ["周子涵"], name: "德语社", category: "Academic", shortDesc: "German", tags: ["德语", "日耳曼", "历史", "文化"], description: "我们欢迎所有对德语区历史文化以及语言的同学！", contact: "" },
    { id: "15", theme: ["#96979f", "#17182a", "#0a0a12"], president: "缪紫菀", vicePresidents: ["王思宬", "邓舒然", "陈秋吟"], name: "世外中学中文辩论社", category: "Academic", shortDesc: "Debate", tags: ["校内外比赛", "思维竞技", "自我提升"], description: "我们需要很多很多i辩的小孩！", contact: "17701896102" },
    { id: "16", theme: ["#e1adae", "#bd494b", "#552021"], president: "赵怀陆", vicePresidents: ["曾新然"], name: "WFLA历史社", category: "Academic", shortDesc: "History", tags: ["包容", "学术", "趣味性"], description: "探索过去，重构未来，we are WFLA History Club", contact: "" },
    { id: "17", theme: ["#c9c1d2", "#88779b", "#3d3545"], president: "卢诺嘉", vicePresidents: ["王坤奕"], name: "法语文化社", category: "Academic", shortDesc: "French Culture", tags: ["远行", "创作", "分享", "优雅"], description: "法语文化社以法语语种开展影视鉴赏、诗歌研讨、杂志编创与文化课。", contact: "arbitrarystudent_lu", rating: "outstanding" },
    { id: "18", theme: ["#c2dfdb", "#78b9b1", "#35534f"], president: "易天晨", vicePresidents: ["来沐憧", "沈兰馨", "张盈颖"], name: "生物社", category: "Academic", shortDesc: "Biology", tags: ["生命", "实验", "观察", "探究"], description: "从细胞到生态，一起探索生命科学的奇妙。", contact: "XiangXiangDora", rating: "five-star" },
    { id: "19", theme: ["#9ea8be", "#283e6f", "#121b31"], president: "孙敬涵", vicePresidents: ["顾岩茗", "沈澍玟", "汤敏瑞"], name: "物理社", category: "Academic", shortDesc: "Physics", tags: ["趣味物理", "创新实验", "跨社联动", "科学探索"], description: "以实验激发兴趣让物理走进校园点亮科学思维", contact: "", rating: "five-star" },
    { id: "20", theme: ["#9d9dbc", "#27276b", "#111130"], president: "王坤奕", vicePresidents: ["孙北辰", "王嘉和"], name: "世外中学英语辩论社", category: "Academic", shortDesc: "English Debate", tags: ["新手友好", "敢于发声", "博闻广识", "思辨求真"], description: "Find your voice. Challenge your ideas. Change the world.", contact: "" },
    { id: "21", theme: ["#c89b94", "#862212", "#3c0f08"], president: "张周涵", vicePresidents: ["史佳蓓"], name: "Mapa西语社", category: "Academic", shortDesc: "Spanish", tags: ["热情", "包容", "轻松"], description: "西语社将鼓励对西语世界文化感兴趣的同学们表达热爱，引领大家走进西语世界🇪🇸", contact: "AzhJun01" },
    { id: "22", theme: ["#989ea6", "#1b283b", "#0c121a"], president: "陈昊阳", vicePresidents: ["陈家惠", "姜灝源"], name: "天文社", category: "Academic", shortDesc: "Astronomy", tags: ["学术分享", "天文馆", "观星活动", "探索宇宙"], description: "天文爱好者聚集地，开展学术分享与实践活动，共同探索宇宙", contact: "alex-sun09" },
    { id: "23", theme: ["#ffffff", "#f0f0f0", "#b8b8b8"], president: "李若翎", vicePresidents: ["於荷清", "黄伊雯"], name: "拾遗文化部落", category: "Academic", shortDesc: "Heritage & Crafts", tags: ["非遗", "部落", "人文", "手作"], description: "仰望星空，探寻远古，近看非遗，传承守望，这里是C-ker", contact: "" },
    { id: "24", theme: ["#ffffff", "#f0f0f0", "#b8b8b8"], president: "蒋之旸", vicePresidents: ["赵正午", "王子安", "王其林"], name: "汽车社", category: "Academic", shortDesc: "Automobile", tags: ["赛车", "热爱", "速度", "极限"], description: "这里汇聚了一群热爱汽车的同学们，we learn together, we play together!", contact: "kimiraikkonen7_KR7", rating: "outstanding" },
    { id: "25", theme: ["#bbd9dc", "#6aacb3", "#2f4d50"], president: "陈奕哲", vicePresidents: ["杨陈铭"], name: "食品研究社", category: "Academic", shortDesc: "Food Science", tags: ["美食", "健康", "食品安全", "食品化学"], description: "我们欢迎任何对食品感兴趣的同学，组件世外老吃家天堂。社长微信号：enehaodeo", contact: "" },
    { id: "26", theme: ["#d0edbb", "#97d86a", "#43612f"], president: "钱辰杰", vicePresidents: ["李林亮", "李亦琦"], name: "环境科学社", category: "Academic", shortDesc: "Environment", tags: ["环境", "科学", "可持续", "调研"], description: "关注身边的环境议题，用科学的方式探索可持续未来。", contact: "" },
    { id: "27", theme: ["#ffffff", "#f0f0f0", "#b8b8b8"], president: "曾新然", vicePresidents: ["周子涵"], name: "哲学社", category: "Academic", shortDesc: "Philosophy", tags: ["思辨", "洞察", "对话", "重构"], description: "汇聚不满足于表象的好奇灵魂", contact: "ziv_zeng" },
    { id: "28", theme: ["#c3bedb", "#7b70b1", "#37324f"], president: "胡晨语", vicePresidents: ["熊欣元", "朱凯霖"], name: "韩文化社", category: "Academic", shortDesc: "Korean Culture", tags: ["多元", "热血", "kpop", "文化"], description: "始于韩流，陷于文化，忠于热爱", contact: "huningning815" },
    { id: "29", theme: ["#949bad", "#122149", "#080e20"], president: "顾岩茗", vicePresidents: ["沈澍玟", "刘致宏", "庄子旭"], name: "极客工坊", category: "Academic", shortDesc: "Engineering", tags: ["Engineering", "Empathy", "Empower"], description: "全校唯一一个工程类社团", contact: "MandyGYMM", rating: "five-star" },
    { id: "30", theme: ["#96bbbb", "#176868", "#0a2e2e"], president: "夏淑桐", vicePresidents: ["陈思洁"], name: "图寻地理社", category: "Academic", shortDesc: "Geography", tags: ["图行天下", "万物地理", "时空对话", "脑力破界"], description: "以图为眼，探索地球的每一寸故事。", contact: "Lang0084_34" },
    { id: "31", theme: ["#a0cef4", "#2d94e7", "#144267"], president: "赵一菡", vicePresidents: ["郭瑷"], name: "AI Lab", category: "Academic", shortDesc: "Artificial Intelligence", tags: ["理解", "应用", "创造"], description: "我们的宗旨是让学东西不成为一个负担，让做项目变成一种放松", contact: "ricykang402" },
    { id: "32", theme: ["#dbc6b6", "#b0815d", "#4f3a29"], president: "吴问涵", vicePresidents: ["蔡宇扬"], name: "沪语弄堂", category: "Academic", shortDesc: "Shanghainese", tags: ["语言", "文化", "上海", "传承"], description: "低门槛，高深度！来沪语弄堂，深入聚焦上海语言与文化，感受沪语魅力，向内激发兴趣、深入理解，向外推广沪语文化，为拯救沪语出力！", contact: "wuwh0118" },
    { id: "33", theme: ["#d6e7f6", "#a4cbed", "#495b6a"], president: "陈奕哲", vicePresidents: ["李铼", "庄子旭", "张智承"], name: "乒乓社", category: "Sports", shortDesc: "Table Tennis", tags: ["团结", "拼搏", "包容", "快乐乒乓"], description: "爱乒才会赢！我们欢迎任何对乒乓感兴趣的同学，包括零基础的同学！社长微信号：enehaodeo", contact: "" },
    { id: "34", theme: ["#dbcfbf", "#b09672", "#4f4333"], president: "许昕然", vicePresidents: ["顾岩茗"], name: "围棋社", category: "Sports", shortDesc: "Go", tags: ["文化传承", "静心修身", "益智成长"], description: "一个集智力竞技，文化修行和国际视野为一体的社团", contact: "" },
    { id: "35", theme: ["#aeaead", "#4c4c4a", "#222221"], president: "陈柏亦", vicePresidents: ["徐靖尧", "张亦桓"], name: "象棋社", category: "Sports", shortDesc: "Chess", tags: ["以棋会友", "策略", "思辨", "静心"], description: "国际象棋社是一个让同学们以棋会友、享受下棋之处。", contact: "" },
    { id: "36", theme: ["#a5adb6", "#394a5d", "#192129"], president: "龚泽昊", vicePresidents: ["陈紫瑜", "陈思桦", "马照程"], name: "排球社", category: "Sports", shortDesc: "Volleyball", tags: ["以球相聚", "凌空知遇", "驰球偕行"], description: "以排球之名，赴青春之约", contact: "zach_gzh" },
    { id: "37", theme: ["#b1c5d2", "#527f9b", "#243945"], president: "杨亦晴", vicePresidents: ["张舜瑶", "柴懿珂", "沈梓颖"], name: "轻羽飞扬", category: "Sports", shortDesc: "Badminton", tags: ["热忱", "竞技", "向善", "青春"], description: "以羽相会聚力同行，于运动之中传递暖意", contact: "yyq-100616" },
    { id: "38", theme: ["#b3a3bd", "#58336d", "#271631"], president: "马照程", vicePresidents: ["谈仲岳", "刘子矜", "汤敏瑞"], name: "世外篮球社", category: "Sports", shortDesc: "Basketball", tags: ["篮球", "运动", "提升", "团结"], description: "培养热爱篮球、提升球技、凝聚团队精神的学生社团。", contact: "GOODZAZACK" },
    { id: "39", theme: ["#ffffff", "#f0f0f0", "#b8b8b8"], president: "胡晨语", vicePresidents: ["沈恰彤", "顾昕瑶"], name: "随园跑社", category: "Sports", shortDesc: "Running", tags: ["热血", "运动", "正确运动", "趣味跑步"], description: "不止于跑步，更是热爱生活的一种方式", contact: "huningning815" },
    { id: "40", theme: ["#b8999d", "#631e27", "#2c0d11"], president: "陈梓轩", vicePresidents: ["孙北辰", "袁金灿"], name: "足球社", category: "Sports", shortDesc: "Football", tags: ["热血", "团队", "拼搏", "荣耀"], description: "因足球相聚，为胜利拼搏", contact: "foreverviolet10", rating: "five-star" },
    { id: "41", theme: ["#a2aab3", "#324457", "#161e27"], president: "顾益诚", vicePresidents: ["陈柏亦", "朱凯霖"], name: "世外网球社", category: "Sports", shortDesc: "Tennis", tags: ["热爱", "拼搏", "成长", "超越"], description: "在网球场挥洒汗水，用热爱成就更好的自己。", contact: "" },
    { id: "42", theme: ["#b2a59e", "#543929", "#251912"], president: "卢子滢", vicePresidents: ["孙炜莹", "张舜瑶"], name: "飞镖社", category: "Sports", shortDesc: "Darts", tags: ["飞镖", "运动", "策略", "合作"], description: "世外飞镖社致力于推广飞镖运动，通过训练、比赛与趣味活动，让同学们在挑战自我中提升专注力、抗压能力与心理素质，在竞技与合作中感受飞镖运动的独特魅力。", contact: "luziying1116" },
    { id: "43", theme: ["#cc9fa0", "#8e2a2e", "#3f1214"], president: "章皓云", vicePresidents: ["陈杰颢"], name: "腰旗橄榄球社", category: "Sports", shortDesc: "Flag Football", tags: ["对抗游戏", "基础训练", "活力向上", "快乐有趣"], description: "腰旗橄榄球社团的日常训练中，致力于提高每位成员的基本功和战术理解", contact: "haoyunz0707" },
    { id: "44", theme: ["#b7ccda", "#3f86b0", "#1c4055"], president: "贾静萱", vicePresidents: ["赵一菡", "查睿宸", "李木子"], name: "飞盘社", category: "Sports", shortDesc: "Frisbee", tags: ["竞技运动", "合作团结", "便捷实惠"], description: "一群玩飞盘的朋友聚在一块，以纯粹的热爱践行体育精神", contact: "jasmine_55_", rating: "outstanding" },
    { id: "45", theme: ["#a1a3a6", "#30343a", "#15171a"], president: "黄曼荻", vicePresidents: ["缪紫菀"], name: "女篮社", category: "Sports", shortDesc: "Women's Basketball", tags: ["女子篮球", "体育训练", "团队协作", "新手友好"], description: "我们是世外女篮Orcas，一群热爱篮球的女生的聚集地", contact: "" },
    { id: "46", theme: ["#ffffff", "#f0f0f0", "#b8b8b8"], president: "侯施正", vicePresidents: ["顾益诚", "高畅"], name: "绅士台球社", category: "Sports", shortDesc: "Billiards", tags: ["没有标签"], description: "没有简介", contact: "" },
    { id: "47", theme: ["#bfbeb8", "#716f62", "#32312c"], president: "高煜明", vicePresidents: ["高畅", "侯施正"], name: "匹克球社", category: "Sports", shortDesc: "Pickleball", tags: ["低门槛", "强社交", "竞技性", "趣味性","团队协作","安全可控"], description: "IB学业压力大？来匹克球社，用一场轻松又带劲的双打释放多巴胺！零基础友好，每周两次，挥拍交友，快乐减负。", contact: "" },
    { id: "48", theme: ["#bb91a0", "#680c2e", "#2e0514"], president: "江易阳", vicePresidents: ["杨义涵"], name: "DOGMA95 电影社", category: "Arts", shortDesc: "Film", tags: ["影评", "批判", "微电影摄制", "创造"], description: "解剖电影 理解电影 批判电影 创造电影", contact: "Alex09JYY" },
    { id: "49", theme: ["#9c9da4", "#232735", "#0f1117"], president: "吴亦芊", vicePresidents: ["袁亦凡", "彭波而"], name: "Radiation Studio", category: "Arts", shortDesc: "Art Studio", tags: ["融艺", "辐射", "创想", "拓界"], description: "这里是WFLA青年艺术家们的聚集地，也是多元艺术爱好者的部落。我们热爱艺术，创造艺术 ，向外辐射艺术。", contact: "uniK1_tsfu" },
    { id: "50", theme: ["#d1c4d1", "#b39eb3", "#594f59"], president: "须潆莹", vicePresidents: ["缪紫菀", "朱沛琳"], name: "翻唱社", category: "Arts", shortDesc: "Cover Songs", tags: ["热爱", "多元", "共鸣"], description: "以翻唱抒心意，凭歌声遇知音，奔赴音乐热爱。", contact: "Xuyingying0110", rating: "five-star" },
    { id: "51", theme: ["#ffffff", "#f0f0f0", "#b8b8b8"], president: "范宜遐", vicePresidents: ["沈梓颖"], name: "La Musique音乐社", category: "Arts", shortDesc: "Music", tags: ["古典乐", "流行乐", "民乐", "乐队"], description: "本社分享古典、流行、民乐的结合，组织参与各类演出，以乐会友丰富校园生活", contact: "" },
    { id: "52", theme: ["#ffffff", "#f0f0f0", "#b8b8b8"], president: "鲁姝仪", vicePresidents: ["史佳蓓"], name: "世外舞社", category: "Arts", shortDesc: "Dance", tags: ["舞蹈", "热爱"], description: "以热爱赴舞蹈之约 希望所有热爱现代舞 爵士舞 hiphop kpop等舞种的大家找到一个自由交流的平台", contact: "", rating: "outstanding" },
    { id: "53", theme: ["#ffffff", "#f0f0f0", "#b8b8b8"], president: "王欣辰", vicePresidents: ["陈令康", "陆柔嘉", "孙敬涵"], name: "OAO 摄影社", category: "Arts", shortDesc: "Photography", tags: ["专业制式工作流团队", "校内外多项活动官摄", "照片视频双团队"], description: "让我们一起用镜头记录下生活中的点点滴滴吧！", contact: "13764551764", rating: "five-star" },
    { id: "54", theme: ["#e04040", "#C00000", "#600000"], president: "周子涵", vicePresidents: ["蔡宇扬", "沈为易", "曾新然"], name: "Kaleido戏剧社", category: "Arts", shortDesc: "Theatre", tags: ["艺术", "交流", "思辨"], description: "在Kaleido专业化的戏剧制作过程中，你可以接触台前和台后的多种工作。来Kaleido，与我们一起踏入戏剧艺术的万华境。", contact: "zzhcatherine", rating: "five-star" },
    { id: "55", theme: ["#afc2e4", "#4e79c4", "#233658"], president: "李亦埼", vicePresidents: ["王其林"], name: "BlueX", category: "Arts", shortDesc: "Game Studies", tags: ["游戏", "研究"], description: "为游戏正名，我们希望更多人能够理解并研究游戏中的艺术。游戏不仅仅是一种娱乐，更有作为第九艺术的潜质。", contact: "xiaoyi1881846" },
    { id: "56", theme: ["#e0d0c1", "#bb9877", "#544435"], president: "来沐憧", vicePresidents: ["范宜遐", "高煜明"], name: "3D建模社", category: "Arts", shortDesc: "3D Modeling", tags: ["创新", "艺术", "技术"], description: "我们是一个计算机技术与艺术相融的创新社团，主要学习如何用Blender这个软件把脑海中的3D建构建模出来，并进行渲染和动画，运用领域包括动画视频，游戏道具建模，产品模型。", contact: "" },
    { id: "57", theme: ["#ead0d2", "#d1989c", "#5e4446"], president: "肖雨瑶", vicePresidents: ["沈为易", "赵一菡"], name: "心跳动漫社", category: "Arts", shortDesc: "ACGN", tags: ["热爱", "创作", "传播"], description: "从所热爱的ACGN作品出发，去探讨它的深层内核，做到热爱，创作与传播。", contact: "" },
    { id: "58", theme: ["#e8c5bb", "#cd7f68", "#5c392e"], president: "於荷清", vicePresidents: ["陈裕佳", "王韵涵"], name: "中国舞社", category: "Arts", shortDesc: "Chinese Dance", tags: ["民族", "文化", "舞蹈"], description: "传承民族舞韵，同展华夏之美", contact: "" },
    { id: "59", theme: ["#b29797", "#561a19", "#260b0b"], president: "张纯熙", vicePresidents: ["康怀瑾", "黄伊雯"], name: "Storyteller音乐剧社", category: "Arts", shortDesc: "Musical", tags: ["歌唱", "表演", "舞台", "戏剧"], description: "用歌声与表演，把一个个故事搬上舞台。", contact: "" },
    { id: "60", theme: ["#bdb2a9", "#6e5540", "#31261c"], president: "江紫萱", vicePresidents: ["王美涵", "曾沈鑫", "马余嫣"], name: "RSO管弦乐团", category: "Arts", shortDesc: "Orchestra", tags: ["古典乐", "合奏", "舞台"], description: "用琴弦与管乐，奏响校园最动人的旋律。", contact: "微信：pamelajiangzixuan", rating: "five-star" },
    { id: "61", theme: ["#9b96a5", "#211737", "#0e0a18"], president: "江昊", vicePresidents: ["万语宸", "蒋彦弘"], name: "魔术花切社", category: "Arts", shortDesc: "Magic & Cardistry", tags: ["表演", "手法", "社交", "自信"], description: "解遍天下花切法，你我皆为魔术生。", contact: "" },
    { id: "63", theme: ["#ddafaa", "#b54f43", "#51231e"], president: "孙乾瑞", vicePresidents: ["徐靖舜"], name: "汉文化社", category: "Life", shortDesc: "Chinese Culture", tags: ["中国文化", "社会", "传承", "古今碰撞"], description: "我们是汉文化社，包含着中国上下五千年的衣食住行，回溯历史，重看今世", contact: "" },
    { id: "64", theme: ["#ffffff", "#f0f0f0", "#b8b8b8"], president: "韩晓琳", vicePresidents: ["曹豪悦", "王欣辰"], name: "GI时尚与艺术社", category: "Arts", shortDesc: "Fashion & Design", tags: ["时尚", "设计", "文化"], description: "想玩走秀、街拍？Grab it！ 想衣服remake、玩转文化拼贴？Grab it！ 联手社团抓取跨学科灵感？Grab it！ 文化周捕捉全球美学？Grab it！ 在GI，一切精彩，等你来 Grab it! 加入GI，抓住设计无限可能！", contact: "" },
    { id: "65", theme: ["#b9ddf1", "#65b4e2", "#2d5065"], president: "陈梓轩", vicePresidents: ["柴懿珂"], name: "世外传媒", category: "Life", shortDesc: "Campus Media", tags: ["拍摄", "推文", "校园资讯", "视觉创作"], description: "深耕校园新媒体，创作优质校园纪实内容", contact: "foreverviolet10" },
    { id: "66", theme: ["#ecd2bc", "#d59c6c", "#5f4630"], president: "赵瑞国", vicePresidents: ["程啸恩", "孙北辰", "李若翎"], name: "无障碍社", category: "Service", shortDesc: "Accessibility", tags: ["物理无障碍", "社会服务", "艺术疗愈", "弱势群体关怀"], description: "我们是一群传播无障碍理念的使者", contact: "Ramen_14", rating: "five-star" },
    { id: "67", theme: ["#cccbd9", "#8f8dac", "#403f4d"], president: "王琚连", vicePresidents: ["朱潇晔"], name: "Asclepius急救医学社", category: "Service", shortDesc: "First Aid & Medicine", tags: ["科普急救", "医学交流", "轻松社活", "学术分享"], description: "一个旨在科普急救，交流医学的服务类社团", contact: "" },
    { id: "68", theme: ["#2dd4a7", "#1A5F4A", "#0f3d2f"], president: "刘彧华", vicePresidents: ["吴问涵", "陈升"], name: "信息化社", category: "Service", shortDesc: "网站好玩吗 我们做的", tags: ["技术", "运维", "服务", "协作"], description: "用技术支撑校园里的每一次活动与每一块屏幕。", contact: "", rating: "five-star" },
    { id: "69", theme: ["#ebe4c7", "#d3c483", "#5e583a"], president: "张雨萱", vicePresidents: ["王煦今"], name: "悦习社", category: "Service", shortDesc: "Education Charity", tags: ["公益教育", "社会"], description: "在JOL，你可以成为一名老师。 JOL是全中国第一个由高中学生自主发起的教育组织，也是全世外最能让你立马做实事的社团。 面对不同年龄群体，我们曾开过各式各样的课程：英语阅读、英语口语、街舞、电影、文学、心理学、性别教育等。 加入JOL，让我们一起用教育让这个社会变得更好！", contact: "zyx_vivalavida" },
    { id: "70", theme: ["#ffffff", "#f0f0f0", "#b8b8b8"], president: "吴佳仪", vicePresidents: [], name: "彩虹之下", category: "Service", shortDesc: "Autism Care", tags: ["科普宣传", "志愿服务", "关注自闭症儿童"], description: "彩虹之下致力于普及自闭症相关知识，并定期开展志愿服务，让更多“星星的孩子”被看见，被接纳。", contact: "HYuK07_Z6h5Ej" },
    { id: "71", theme: ["#acbbad", "#47684a", "#1f2e21"], president: "李立伦", vicePresidents: ["卢诺嘉", "顾岩茗", "陈紫瑜"], name: "世外根与芽", category: "Service", shortDesc: "Environment", tags: ["环境", "动态发展", "社会", "互动"], description: "根与芽以实际行动探索、建立、增进社会与自然之间的联系。", contact: "jefflililun", rating: "five-star" },
    { id: "72", theme: ["#cbd1c3", "#8d997b", "#3f4437"], president: "王嘉和", vicePresidents: ["李楠辙"], name: "1803", category: "Service", shortDesc: "Charity · Hope Road", tags: ["桥梁", "希望", "启蒙", "承诺"], description: "The 1803 km of hope threads through mountains to touch young hearts. 这条长达1803公里的希望之路穿越群山，直抵年轻心灵。", contact: "" },
    { id: "73", theme: ["#b3b7b5", "#58605c", "#272b29"], president: "徐梓然", vicePresidents: ["吴佳仪", "黄奕婷"], name: "VOICE 有声书社", category: "Service", shortDesc: "Social Voice", tags: ["观测", "共鸣", "连接", "发声"], description: "请带上好奇心，我们带你一起去到真实的社会里，做一场不设限的冒险，和你未曾谋面的他们交个朋友～", contact: "18621190426", rating: "five-star" },
    { id: "74", theme: ["#949695", "#121715", "#080a09"], president: "王思宬", vicePresidents: ["王美涵"], name: "世外频道", category: "Service", shortDesc: "Campus TV", tags: ["采访", "拍摄", "剪辑", "新媒体"], description: "当视觉成为了更加重要的传播方式时，世外频道更是紧随其后，用相机拍摄，利用高效的节目策划和视频剪辑的方式制作学生们感兴趣，可以体现世外独特故事的片子。你的记者和导演梦，在这里开机！", contact: "" },
    { id: "75", theme: ["#ced9df", "#93acb9", "#424d53"], president: "谈仲岳", vicePresidents: ["王思允"], name: "微笑社", category: "Service", shortDesc: "Care & Volunteering", tags: ["Helping", "Caring", "Loving"], description: "你们的笑容是真正的不老药", contact: "Th0910171912" },
    { id: "76", theme: ["#faedb9", "#f4d865", "#6d612d"], president: "钱简文", vicePresidents: ["黄奕婷", "江易阳"], name: "学生公司", category: "Service", shortDesc: "Student Enterprise", tags: ["实践", "商业", "公益", "传承"], description: "以实践感受市场与销售的魅力，赚取人生的第一桶金", contact: "Qikw_Tau18" },
    { id: "77", theme: ["#e7ccbb", "#cb8f68", "#5b402e"], president: "顾昕瑶", vicePresidents: ["沈恰彤", "彭波而"], name: "Prologue动物保护社", category: "Service", shortDesc: "Animal Welfare", tags: ["温暖", "团结", "有爱", "抽象"], description: "看见动物，了解动物，保护动物", contact: "LovingCats529520", rating: "outstanding" },
];

// Prefix a site-relative asset path with Vite's base URL so it resolves under
// the GitHub Pages subpath. Full http(s) URLs (placeholder photos) pass through.
export function asset(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}

