import React, { useState } from 'react';
import { MessageSquare, Send, RefreshCw, LogIn, CheckCircle2, Users, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { User } from 'firebase/auth';
import { ChatSpace } from '../services/googleChat';

interface GoogleChatHubProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  spaces: ChatSpace[];
  isLoadingSpaces: boolean;
  onRefreshSpaces: () => void;
  onTriggerShareModal: (text: string, spaceId?: string) => void;
}

export const GoogleChatHub: React.FC<GoogleChatHubProps> = ({
  user,
  onLogin,
  onLogout,
  spaces,
  isLoadingSpaces,
  onRefreshSpaces,
  onTriggerShareModal,
}) => {
  const [customText, setCustomText] = useState('');
  const [selectedSpaceName, setSelectedSpaceName] = useState<string>('');

  const quickTemplates = [
    {
      title: 'Chia sẻ tiến độ học tập & Chứng chỉ',
      content: `📢 [CẬP NHẬT TỪ LEGAL AI MENTOR]
Chào các bạn trong nhóm học tập Luật!
Mình vừa nhận được cố vấn từ Legal AI Mentor về lộ trình ôn thi chứng chỉ ngoại ngữ pháp lý TOLES Higher và hoàn thành môn Tố tụng Dân sự kỳ này.
Các bạn có muốn cùng lập nhóm ôn tập thực tế các vụ án theo phương pháp IRAC vào cuối tuần không?`,
    },
    {
      title: 'Kêu gọi lập đội thi Phiên tòa giả định (Moot Court)',
      content: `🏛️ [THÔNG BÁO THÀNH LẬP ĐỘI THI MOOT COURT]
Chào cả nhóm,
Legal AI Mentor khuyến nghị chúng ta nên tham gia cuộc thi Phiên tòa giả định cấp quốc gia (VMoot) và Willem C. Vis Moot để rèn luyện kỹ năng tranh tụng trước Hội đồng trọng tài.
Ai quan tâm vị trí nghiên cứu Án lệ hoặc Người biện hộ (Oralist) thì liên hệ mình cùng thảo luận hồ sơ vụ việc nhé!`,
    },
    {
      title: 'Thảo luận Tình huống thực hành IRAC',
      content: `⚖️ [THẢO LUẬN TÌNH HUỐNG PHÁP LÝ HỢP ĐỒNG]
Chào các thành viên,
Hôm nay Mentor vừa chấm bài giải tình huống phạt vi phạm hợp đồng vượt quá 8% theo Luật Thương mại 2005 của mình. Kết quả đạt 90/100 với lời khuyên đối chiếu thêm Án lệ số 09/2016/AL.
Mình xin chia sẻ lại dàn ý IRAC để nhóm cùng tham khảo và phản biện!`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border border-emerald-600/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Google Workspace Integration
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
                Trung Tâm Kết Nối Google Chat
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Chia sẻ lộ trình pháp lý, bài tập IRAC và thông báo nhóm học tập trực tiếp vào Google Chat với sự cho phép của bạn.
              </p>
            </div>
          </div>

          <div>
            {user ? (
              <div className="flex items-center space-x-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-200 font-medium">{user.email}</span>
                <button
                  onClick={onLogout}
                  className="text-xs text-slate-400 hover:text-red-400 pl-2 border-l border-slate-700 transition"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md transition flex items-center space-x-2"
              >
                <span>Đăng nhập Google Chat</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Spaces Listing & Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left: Spaces list */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:col-span-1 shadow-lg">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <h3 className="font-serif font-bold text-sm text-white">
                Không gian Chat của bạn
              </h3>
            </div>
            {user && (
              <button
                onClick={onRefreshSpaces}
                className="p-1 text-slate-400 hover:text-white transition"
                title="Làm mới danh sách không gian"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {!user ? (
            <div className="p-4 text-center text-xs text-slate-400 space-y-2">
              <p>Vui lòng đăng nhập bằng tài khoản Google để tải danh sách các phòng chat và không gian thảo luận.</p>
              <button
                onClick={onLogin}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                Kết nối tài khoản ngay
              </button>
            </div>
          ) : isLoadingSpaces ? (
            <div className="p-4 text-center text-xs text-slate-400 animate-pulse">
              Đang tải danh sách không gian Google Chat...
            </div>
          ) : spaces.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {spaces.map((s) => (
                <div
                  key={s.name}
                  onClick={() => setSelectedSpaceName(s.name)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    selectedSpaceName === s.name
                      ? 'bg-emerald-950/40 border-emerald-500 text-white'
                      : 'bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="font-semibold text-slate-100 truncate">{s.displayName}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.spaceType || 'Không gian thảo luận'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-xs text-slate-400 bg-slate-850 rounded-xl">
              Chưa có không gian nào được tìm thấy. Bạn có thể mở ứng dụng Google Chat trên trình duyệt hoặc điện thoại và tạo một không gian &quot;Nhóm Luật Học&quot;.
            </div>
          )}
        </div>

        {/* Right: Custom Composer & Quick Templates */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:col-span-2 shadow-lg space-y-4">
          <div>
            <h3 className="font-serif font-bold text-base text-white mb-1">
              Gửi Bản Tin & Lộ Trình Vào Nhóm Học Tập
            </h3>
            <p className="text-xs text-slate-400">
              Chọn mẫu thông báo hoặc soạn nội dung riêng để gửi. Trước khi gửi, hệ thống sẽ mở hộp thoại xác nhận rõ ràng để bạn kiểm tra.
            </p>
          </div>

          {/* Quick Template Buttons */}
          <div>
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block mb-2">
              Mẫu thông báo sẵn có:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {quickTemplates.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCustomText(tmpl.content)}
                  className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 text-left text-xs transition"
                >
                  <p className="font-bold text-slate-200 line-clamp-1">{tmpl.title}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{tmpl.content}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Composer Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nội dung thông điệp:
            </label>
            <textarea
              rows={6}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Nhập nội dung chia sẻ kết quả tư vấn của Legal AI Mentor cho các bạn trong nhóm học tập..."
              className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
              <ShieldAlert className="h-4 w-4 text-emerald-400" />
              <span>Luôn có bước xác nhận trước khi đăng tin</span>
            </div>
            <button
              type="button"
              onClick={() => onTriggerShareModal(customText, selectedSpaceName)}
              disabled={!customText.trim()}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg flex items-center space-x-2 transition ${
                customText.trim()
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send className="h-4 w-4" />
              <span>Tiếp tục để Xác nhận gửi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
