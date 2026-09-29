import React, { useState } from 'react';
import { X, Send, AlertTriangle, MessageSquare, Check, Sparkles, LogIn } from 'lucide-react';
import { User } from 'firebase/auth';
import { ChatSpace } from '../services/googleChat';

interface GoogleChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageText: string;
  spaces: ChatSpace[];
  selectedSpace: string;
  onSelectSpace: (space: string) => void;
  onConfirmSend: (space: string, text: string) => Promise<void>;
  isLoadingSpaces: boolean;
  user: User | null;
  onLogin: () => void;
}

export const GoogleChatModal: React.FC<GoogleChatModalProps> = ({
  isOpen,
  onClose,
  messageText,
  spaces,
  selectedSpace,
  onSelectSpace,
  onConfirmSend,
  isLoadingSpaces,
  user,
  onLogin,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [editText, setEditText] = useState(messageText);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync editText if messageText changes
  React.useEffect(() => {
    setEditText(messageText);
    setSendSuccess(false);
    setErrorMessage(null);
  }, [messageText, isOpen]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!selectedSpace) {
      setErrorMessage('Vui lòng chọn một không gian Google Chat để gửi.');
      return;
    }
    if (!editText.trim()) {
      setErrorMessage('Nội dung tin nhắn không được để trống.');
      return;
    }

    setIsSending(true);
    setErrorMessage(null);
    try {
      await onConfirmSend(selectedSpace, editText.trim());
      setSendSuccess(true);
      setTimeout(() => {
        onClose();
        setSendSuccess(false);
      }, 1800);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gửi thất bại. Vui lòng kiểm tra quyền truy cập Google Chat.');
    } finally {
      setIsSending(false);
    }
  };

  const currentSpaceObj = spaces.find((s) => s.name === selectedSpace);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/40 w-full max-w-2xl rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-emerald-400">
                Chia Sẻ Vào Google Chat
              </h3>
              <p className="text-xs text-slate-400">
                Xác nhận quyền gửi lộ trình hoặc bài giải pháp lý vào nhóm học tập
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {!user ? (
            <div className="bg-slate-850 border border-amber-500/30 rounded-xl p-5 text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400">
                <LogIn className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-white text-sm">
                Bạn cần kết nối tài khoản Google để truy cập Google Chat
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Ứng dụng cần sự cho phép của bạn để hiển thị danh sách các không gian thảo luận và đăng tin nhắn theo yêu cầu.
              </p>
              <button
                type="button"
                onClick={onLogin}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md transition inline-flex items-center space-x-2"
              >
                <span>Đăng nhập với Google</span>
              </button>
            </div>
          ) : (
            <>
              {/* Space Selection */}
              <div>
                <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
                  Chọn Không gian Google Chat (Space):
                </label>
                {isLoadingSpaces ? (
                  <div className="text-xs text-slate-400 p-3 bg-slate-850 rounded-xl animate-pulse">
                    Đang tải danh sách không gian Google Chat của bạn...
                  </div>
                ) : spaces.length > 0 ? (
                  <select
                    value={selectedSpace}
                    onChange={(e) => onSelectSpace(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Vui lòng chọn không gian nhận tin --</option>
                    {spaces.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.displayName} ({s.spaceType})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-xs text-amber-300 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    Chưa tìm thấy Không gian thảo luận (Space) nào trong tài khoản Google Chat của bạn. Bạn có thể tạo một Space mới trên ứng dụng Google Chat (ví dụ: &quot;Nhóm Học Luật - Legal Mentoring&quot;) rồi nhấn Tải lại.
                  </div>
                )}
              </div>

              {/* Message Content Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Nội dung tin nhắn sẽ gửi:</span>
                  <span className="text-[10px] text-slate-400 font-normal">Có thể chỉnh sửa trước khi gửi</span>
                </label>
                <textarea
                  rows={8}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Mandatory Confirmation Notice Dialog Component */}
              <div className="bg-amber-950/30 border border-amber-600/40 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="font-bold text-amber-300">Xác nhận hành động gửi tin nhắn:</p>
                  <p>
                    Bạn sắp đăng tin nhắn trên vào không gian:{' '}
                    <strong>{currentSpaceObj?.displayName || selectedSpace || 'chưa chọn'}</strong>. Tin nhắn này sẽ được gửi đại diện cho tài khoản <strong>{user.email}</strong>.
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              {sendSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Tin nhắn đã được gửi thành công vào Google Chat!</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium transition"
          >
            Hủy bỏ
          </button>
          {user && (
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending || !selectedSpace || !editText.trim()}
              className={`px-5 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-lg flex items-center space-x-2 transition ${
                !isSending && selectedSpace && editText.trim()
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Xác nhận gửi vào Google Chat</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
