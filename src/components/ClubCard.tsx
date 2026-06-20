import type { Club } from '../data/clubs';
import { ArrowRight } from 'lucide-react';
import { ClubCardImage } from './ImageComponents';

interface ClubCardProps {
  club: Club;
  onClick: (id: string) => void;
}

/**
 * 社团卡片组件
 */
export default function ClubCard({ club, onClick }: ClubCardProps) {
  return (
    <div
      onClick={() => onClick(club.id)}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl 
                 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 
                 border border-gray-100"
    >
      <ClubCardImage club={club} />
      <CardContent name={club.name} shortDesc={club.shortDesc} />
    </div>
  );
}

function CardContent({ name, shortDesc }: { name: string; shortDesc: string }) {
  return (
    <div className="p-5">
      <h3 className="text-xl font-bold text-[#1A5F4A] mb-2">{name}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shortDesc}</p>
      <div className="flex items-center justify-between">
        <span className="text-[#1A5F4A] text-sm font-medium">查看详情</span>
        <ArrowRight className="w-4 h-4 text-[#1A5F4A]" />
      </div>
    </div>
  );
}
