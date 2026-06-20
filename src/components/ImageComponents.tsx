import type { Club } from '../data/clubs';

interface CardImageProps {
  poster: string;
  name: string;
}

interface ClubCardImageProps {
  club: Club;
}

interface PlaceholderProps {
  name: string;
}

/**
 * 社团图片组件，支持海报和占位图
 */
export function CardImage({ poster, name }: CardImageProps) {
  return poster ? (
    <img src={poster} alt={name} className="w-full h-full object-cover" />
  ) : (
    <Placeholder name={name} />
  );
}

/**
 * 俱乐部卡片图片组件
 */
export function ClubCardImage({ club }: ClubCardImageProps) {
  return (
    <div className="h-48 overflow-hidden bg-gray-100">
      <CardImage poster={club.poster} name={club.name} />
    </div>
  );
}

/**
 * 列表页卡片图片组件（较小尺寸）
 */
export function ListCardImage({ club }: ClubCardImageProps) {
  return (
    <div className="h-32 overflow-hidden bg-gray-100">
      <CardImage poster={club.poster} name={club.name} />
    </div>
  );
}

/**
 * 占位图组件
 */
function Placeholder({ name }: PlaceholderProps) {
  return (
    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
      {name}
    </div>
  );
}
