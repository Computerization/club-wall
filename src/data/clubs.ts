export type Category = 'Sports' | 'Arts' | 'Service' | 'Life' | 'Academic' | 'ClubsToBeEstablished';

export interface Club {
  id: string;
  name: string;
  category: Category;
  shortDesc: string;
  description: string;
  image: string;
  poster: string;
  contact: string;
}

export const categories: Category[] = ['Sports', 'Arts', 'Service', 'Life', 'Academic'];

export const clubs: Club[] = [
  // Sports
  { id: '1', name: '女篮社', category: 'Sports', shortDesc: 'Basketball', description: '', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '2', name: '骑行社', category: 'Sports', shortDesc: 'Cycling', description: '', image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '3', name: '棒球社', category: 'Sports', shortDesc: 'Baseball', description: '', image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '4', name: '中国舞社', category: 'Sports', shortDesc: 'Chinese Dance', description: '', image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '5', name: '飞盘社', category: 'Sports', shortDesc: 'Frisbee', description: '', image: 'https://images.unsplash.com/photo-1592503254549-d83d24a4dfab?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '6', name: '腰旗橄榄球社', category: 'Sports', shortDesc: 'Flag Football', description: '', image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '7', name: '象棋社', category: 'Sports', shortDesc: 'Chinese Chess', description: '', image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '8', name: '围棋社', category: 'Sports', shortDesc: 'Go', description: '', image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '9', name: '体能健身', category: 'Sports', shortDesc: 'Fitness', description: '', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '10', name: '世外飞镖社', category: 'Sports', shortDesc: 'Darts', description: '', image: 'https://images.unsplash.com/photo-1550537628-c6b5191a6884?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '11', name: '轻羽飞扬', category: 'Sports', shortDesc: 'Badminton', description: '', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '12', name: '弈语棋斋', category: 'Sports', shortDesc: 'Chess & Go', description: '', image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '13', name: '六合武学社', category: 'Sports', shortDesc: 'Martial Arts', description: '', image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '14', name: '随园跑社', category: 'Sports', shortDesc: 'Running', description: '', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '15', name: '乒乓社', category: 'Sports', shortDesc: 'Table Tennis', description: '', image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '16', name: '足球社', category: 'Sports', shortDesc: 'Football', description: '', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '17', name: '网球社', category: 'Sports', shortDesc: 'Tennis', description: '', image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '18', name: '世外篮球社', category: 'Sports', shortDesc: 'Basketball', description: '', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '19', name: '世外中学啦啦队', category: 'Sports', shortDesc: 'Cheerleading', description: '', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '20', name: '燃脂社', category: 'Sports', shortDesc: 'Fat Burning', description: '', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '21', name: 'WFLA排球社', category: 'Sports', shortDesc: 'Volleyball', description: '', image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=300&fit=crop', poster: '', contact: '' },

  // Service
  { id: '22', name: '天路', category: 'Service', shortDesc: 'Service', description: '', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '23', name: 'JOL悦习社', category: 'Service', shortDesc: 'Learning', description: '', image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '24', name: 'SRP科研社', category: 'Service', shortDesc: 'Research', description: '', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '25', name: '世外志愿者库', category: 'Service', shortDesc: 'Volunteer', description: '', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '26', name: '彩虹之下', category: 'Service', shortDesc: 'Autism Care', description: '', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '27', name: '1803零距离', category: 'Service', shortDesc: 'Service', description: '', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '28', name: '学生会', category: 'Service', shortDesc: 'Student Union', description: '', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '29', name: '世外信息化社', category: 'Service', shortDesc: 'IT Service', description: '', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '30', name: 'Roots&Shoots根与芽社', category: 'Service', shortDesc: 'Environment', description: '', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '31', name: '微笑社', category: 'Service', shortDesc: 'Service', description: '', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '32', name: '学生大使馆', category: 'Service', shortDesc: 'Ambassador', description: '', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '33', name: 'VOICE', category: 'Service', shortDesc: 'Voice', description: '', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '34', name: 'WFLA学生公司', category: 'Service', shortDesc: 'Student Company', description: '', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop', poster: '', contact: '' },

  // Arts
  { id: '35', name: '魔术花切社', category: 'Arts', shortDesc: 'Magic & Cardistry', description: '', image: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '36', name: '音乐剧社', category: 'Arts', shortDesc: 'Musical', description: '', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '37', name: '管弦乐团', category: 'Arts', shortDesc: 'Orchestra', description: '', image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '38', name: '心跳ACGN社', category: 'Arts', shortDesc: 'ACGN', description: '', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '39', name: 'Modi 3D建模社', category: 'Arts', shortDesc: '3D Modeling', description: '', image: 'https://images.unsplash.com/photo-1631557777783-22b11ce23828?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '40', name: '深蓝', category: 'Arts', shortDesc: 'Arts', description: '', image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '41', name: 'Radiation Studio', category: 'Arts', shortDesc: 'Studio', description: '', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '42', name: 'OAU世外舞社', category: 'Arts', shortDesc: 'Dance', description: '', image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '43', name: 'Dogma95电影社', category: 'Arts', shortDesc: 'Film', description: '', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '44', name: '工学美感社', category: 'Arts', shortDesc: 'Design', description: '', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '45', name: 'Museholic翻唱社', category: 'Arts', shortDesc: 'Cover Songs', description: '', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '46', name: '音乐社', category: 'Arts', shortDesc: 'Music', description: '', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '47', name: '艺术鉴赏社', category: 'Arts', shortDesc: 'Art Appreciation', description: '', image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '48', name: 'OAO摄影社', category: 'Arts', shortDesc: 'Photography', description: '', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '49', name: '戏剧社', category: 'Arts', shortDesc: 'Drama', description: '', image: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=400&h=300&fit=crop', poster: '', contact: '' },

  // Life
  { id: '50', name: 'The Thinker行读社', category: 'Life', shortDesc: 'Reading', description: '', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '51', name: 'バナナや香蕉屋', category: 'Life', shortDesc: 'Japanese', description: '', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '52', name: '拾荒者社', category: 'Life', shortDesc: 'Life', description: '', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '53', name: '世外传媒', category: 'Life', shortDesc: 'Media', description: '', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '54', name: '乱码动漫社', category: 'Life', shortDesc: 'Anime', description: '', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '55', name: 'GI服装设计杂志社', category: 'Life', shortDesc: 'Fashion', description: '', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '56', name: '汉文化社', category: 'Life', shortDesc: 'Chinese Culture', description: '', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop', poster: '', contact: '' },

  // Academic
  { id: '57', name: 'AI Lab', category: 'Academic', shortDesc: 'AI', description: '', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '58', name: '图寻地理社', category: 'Academic', shortDesc: 'Geography', description: '', image: 'https://images.unsplash.com/photo-1509266272358-7701da638078?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '59', name: '极客工坊', category: 'Academic', shortDesc: 'Geek', description: '', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '60', name: '环境科学社', category: 'Academic', shortDesc: 'Environment', description: '', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '61', name: '哲学社', category: 'Academic', shortDesc: 'Philosophy', description: '', image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '62', name: '食品研究社', category: 'Academic', shortDesc: 'Food', description: '', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '63', name: '韩文化社', category: 'Academic', shortDesc: 'Korean', description: '', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '64', name: '机器人社', category: 'Academic', shortDesc: 'Robotics', description: '', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '65', name: '汽车社', category: 'Academic', shortDesc: 'Automobile', description: '', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '66', name: '拾遗文化部落', category: 'Academic', shortDesc: 'Culture', description: '', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '67', name: 'Mapa西语社', category: 'Academic', shortDesc: 'Spanish', description: '', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '68', name: '天文社', category: 'Academic', shortDesc: 'Astronomy', description: '', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '69', name: 'Bulletin英文报社', category: 'Academic', shortDesc: 'English', description: '', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '70', name: 'Pantheon學術社', category: 'Academic', shortDesc: 'Academic', description: '', image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '71', name: '思源社', category: 'Academic', shortDesc: 'Academic', description: '', image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '72', name: '商业社', category: 'Academic', shortDesc: 'Business', description: '', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '73', name: '科幻社', category: 'Academic', shortDesc: 'Sci-Fi', description: '', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '74', name: 'WFLA数学社', category: 'Academic', shortDesc: 'Math', description: '', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '75', name: '世外头马', category: 'Academic', shortDesc: 'Toastmasters', description: '', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '76', name: '脑神经科学社', category: 'Academic', shortDesc: 'Neuroscience', description: '', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '77', name: '笔墨知音书法社', category: 'Academic', shortDesc: 'Calligraphy', description: '', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '78', name: '物理社', category: 'Academic', shortDesc: 'Physics', description: '', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '79', name: '日语社', category: 'Academic', shortDesc: 'Japanese', description: '', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '80', name: 'Luminosity光度心理社', category: 'Academic', shortDesc: 'Psychology', description: '', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '81', name: 'Teleskop德语社', category: 'Academic', shortDesc: 'German', description: '', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '82', name: '世外英语辩论社', category: 'Academic', shortDesc: 'Debate', description: '', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '83', name: '模拟法庭社', category: 'Academic', shortDesc: 'Moot Court', description: '', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '84', name: '起源', category: 'Academic', shortDesc: 'Origin', description: '', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '85', name: '拓科传媒', category: 'Academic', shortDesc: 'Media', description: '', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '86', name: '中文辩论社', category: 'Academic', shortDesc: 'Debate', description: '', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '87', name: '化学社', category: 'Academic', shortDesc: 'Chemistry', description: '', image: 'https://images.unsplash.com/photo-1509266272358-7701da638078?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '88', name: '法国文化社', category: 'Academic', shortDesc: 'French', description: '', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '89', name: '经济社', category: 'Academic', shortDesc: 'Economics', description: '', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '90', name: 'The BOLTS科技社', category: 'Academic', shortDesc: 'Technology', description: '', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '91', name: '模联社', category: 'Academic', shortDesc: 'MUN', description: '', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '92', name: '语言文学社', category: 'Academic', shortDesc: 'Literature', description: '', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '93', name: '生物社', category: 'Academic', shortDesc: 'Biology', description: '', image: 'https://images.unsplash.com/photo-1509266272358-7701da638078?w=400&h=300&fit=crop', poster: '', contact: '' },
  { id: '94', name: '历史社', category: 'Academic', shortDesc: 'History', description: '', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop', poster: '', contact: '' },

  // Clubs to be established
  { id: '95', name: '阈限空间 Negative Space design', category: 'ClubsToBeEstablished', shortDesc: 'Design', description: '', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', poster: '', contact: '' },
];

// The data has real photos in `image`; `poster` is usually empty — prefer
// whichever exists so tiles are never blank.
export function clubImageSrc(club: Club): string {
  return club.poster || club.image;
}
