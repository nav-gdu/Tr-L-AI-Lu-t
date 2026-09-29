import React from 'react';
import { Scale, MessageSquare, MapPin, Award, BookOpen, Send, UserCheck, LogOut, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  activeTab: 'chat' | 'roadmap' | 'irac' | 'googleChat' | 'handbook';
  setActiveTab: (tab: 'chat' | 'roadmap' | 'irac' | 'googleChat' | 'handbook') => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  onOpenProfile: () => void;
  studentName?: string;
  careerGoal?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogin,
  onLogout,
  isLoggingIn,
  onOpenProfile,
  studentName,
  careerGoal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-amber-600/30 text-white shadow-xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('chat')}>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/40 border border-amber-400/40">
              <Scale className="h-6 w-6 sm:h-7 sm:w-7 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-black text-xl sm:text-2xl tracking-wider text-amber-400">
                  LEGAL AI MENTOR
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Vietnamese Law
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                Cố vấn học tập & Định hướng nghề nghiệp sinh viên Luật
              </p>
            </div>
          </div>

          {/* Student Profile Quick Badge & Google Chat Auth */}
          <div className="flex items-center space-x-3">
            {/* Profile Summary Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-amber-500/50 text-xs sm:text-sm text-slate-200 transition"
              title="Cập nhật hồ sơ sinh viên Luật"
            >
              <UserCheck className="h-4 w-4 text-amber-400" />
              <div className="text-left hidden md:block">
                <p className="font-semibold text-white leading-tight">{studentName || 'Hồ sơ Sinh viên'}</p>
                <p className="text-[10px] text-amber-300 truncate max-w-[130px]">{careerGoal || 'Thiết lập mục tiêu'}</p>
              </div>
              <span className="md:hidden text-amber-300 font-medium">Hồ sơ</span>
            </button>

            {/* Google Chat Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2 bg-slate-800/90 border border-emerald-600/40 rounded-lg p-1.5 pl-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="hidden sm:block text-left text-xs">
                    <p className="text-slate-200 font-medium truncate max-w-[110px]">{user.displayName || user.email}</p>
                    <p className="text-[10px] text-emerald-400 font-medium">Google Chat sẵn sàng</p>
                  </div>
                </div>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    className="w-7 h-7 rounded-full border border-slate-600"
                  />
                )}
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded-md hover:bg-slate-700/50 transition"
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                disabled={isLoggingIn}
                className="gsi-material-button text-xs py-1.5 px-3 flex items-center space-x-2 bg-white text-slate-800 hover:bg-slate-100 font-medium rounded-lg shadow transition"
              >
                <div className="w-4 h-4">
                  <svg viewBox="0 0 48 48" className="w-full h-full">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </div>
                <span>{isLoggingIn ? 'Đang kết nối...' : 'Kết nối Google Chat'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-4 border-t border-slate-800 py-2.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition ${
              activeTab === 'chat'
                ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Tư vấn & Trò chuyện</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition ${
              activeTab === 'roadmap'
                ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Lộ trình 3 Phần</span>
          </button>

          <button
            onClick={() => setActiveTab('irac')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition ${
              activeTab === 'irac'
                ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Luyện IRAC Thực chiến</span>
          </button>

          <button
            onClick={() => setActiveTab('googleChat')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition ${
              activeTab === 'googleChat'
                ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Chia sẻ Google Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('handbook')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition ${
              activeTab === 'handbook'
                ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Cẩm nang Nghề Luật</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
