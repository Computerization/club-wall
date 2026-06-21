import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';
import { useClub, useClubIdParam, useClubNavigation } from '../hooks/useClub';

/**
 * 返回按钮组件
 */
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-[#1A5F4A] hover:text-[#144a3a] 
                 transition-colors mb-6"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">返回</span>
    </button>
  );
}

/**
 * 海报图片组件
 */
function PosterImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-auto rounded-xl shadow-lg"
    />
  );
}

/**
 * 社团未找到提示组件
 */
function NotFound({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-400 mb-4">社团未找到</h2>
      <button onClick={onGoHome} className="text-[#1A5F4A] hover:underline">
        返回首页
      </button>
    </div>
  );
}

/**
 * 社团详情页主组件
 */
export default function ClubDetail() {
  const clubId = useClubIdParam();
  const club = useClub(clubId);
  const { goHome } = useClubNavigation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <BackButton onClick={goHome} />
          {club ? (
            <>
              <PosterImage src={club.poster} alt={`${club.name} 海报`} />
              {/* 简介专区 */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-[#1A5F4A] mb-4">简介</h3>
                <div className="w-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
                  简介区域
                </div>
              </div>
            </>
          ) : (
            <NotFound onGoHome={goHome} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
