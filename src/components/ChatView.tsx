import React, { useState, useRef, useEffect } from 'react';
import { Send, Scale, Sparkles, User, Copy, Check, ArrowRight, BookOpen, MapPin, Share2 } from 'lucide-react';
import { ChatMessage, StudentProfile } from '../types/mentor';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  profile: StudentProfile;
  onOpenProfile: () => void;
  onSwitchToRoadmap: () => void;
  onOpenGoogleChatShare: (text: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  profile,
  onOpenProfile,
  onSwitchToRoadmap,
  onOpenGoogleChatShare,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickQuestions = [
    'Mentor hãy lập lộ trình 3 phần chi tiết dựa trên hồ sơ hiện tại của tôi',
    'Làm thế nào để cải thiện kỹ năng nghiên cứu Án lệ và phương pháp IRAC?',
    'Định hướng học và thi chứng chỉ hành nghề tại Học viện Tư pháp',
    'Kinh nghiệm chuẩn bị thi Moot Court quốc tế (Willem C. Vis / Jessup)?',
    'Nên chọn chứng chỉ TOLES hay IELTS khi muốn vào Law Firm chuyên M&A?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto p-2 sm:p-4">
      {/* Student Profile Context Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-amber-600/30 rounded-xl p-3 sm:p-4 mb-3 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Hồ sơ sinh viên đang tư vấn:
              </span>
              <span className="text-xs bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
                {profile.major || 'Chưa chọn chuyên ngành'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Mục tiêu: <strong className="text-amber-200">{profile.careerGoal || 'Chưa thiết lập'}</strong> | Thế mạnh:{' '}
              <span className="text-emerald-300">{profile.strengths || 'Chưa rõ'}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenProfile}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg transition"
          >
            Chỉnh sửa 5 thông tin hồ sơ
          </button>
          <button
            onClick={onSwitchToRoadmap}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow transition"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Xem Bản đồ Lộ trình</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth">
        {messages.map((message) => {
          const isMentor = message.role === 'assistant';
          return (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${isMentor ? 'justify-start' : 'justify-end'}`}
            >
              {isMentor && (
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-serif font-black shadow-md border border-amber-400/50">
                  <Scale className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 shadow-lg text-sm sm:text-base leading-relaxed ${
                  isMentor
                    ? 'bg-slate-900 border border-slate-700 text-slate-100 rounded-tl-sm'
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 font-medium rounded-tr-sm'
                }`}
              >
                {/* Header inside message */}
                <div className="flex items-center justify-between border-b border-slate-700/40 pb-2 mb-2 text-xs">
                  <span className={`font-semibold ${isMentor ? 'text-amber-400 font-serif tracking-wide' : 'text-slate-950'}`}>
                    {isMentor ? 'LEGAL AI MENTOR' : (profile.name || 'Bạn (Sinh viên Luật)')}
                  </span>
                  <div className="flex items-center space-x-2 text-[11px] opacity-75">
                    <span>{message.timestamp}</span>
                    {isMentor && (
                      <>
                        <button
                          onClick={() => handleCopy(message.id, message.content)}
                          className="hover:text-amber-300 transition"
                          title="Sao chép nội dung"
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => onOpenGoogleChatShare(message.content)}
                          className="hover:text-amber-300 transition"
                          title="Gửi nội dung vào Google Chat"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Formatted Message Body */}
                <div className="whitespace-pre-wrap font-sans text-slate-100 selection:bg-amber-500 selection:text-slate-950">
                  {message.content}
                </div>
              </div>

              {!isMentor && (
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold shadow">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-slate-950">
              <Scale className="h-4 w-4 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-amber-300 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 animate-pulse text-amber-400" />
              <span>Mentor đang đối chiếu quy định pháp luật và phân tích lộ trình cho bạn...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="mt-2 mb-1 flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-semibold text-amber-400 whitespace-nowrap pl-1">
          Gợi ý hỏi Mentor:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(q)}
            className="text-xs whitespace-nowrap bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 px-2.5 py-1 rounded-full transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={handleSubmit} className="mt-1 relative">
        <div className="relative flex items-center bg-slate-900 border border-slate-700 focus-within:border-amber-500 rounded-xl shadow-xl overflow-hidden transition">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Đặt câu hỏi về học phần, phương pháp IRAC, thi Học viện Tư pháp hoặc chia sẻ khó khăn..."
            className="flex-1 bg-transparent py-3 pl-4 pr-12 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`absolute right-2 p-2 rounded-lg transition ${
              inputText.trim() && !isLoading
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md font-bold'
                : 'text-slate-600 bg-slate-800 cursor-not-allowed'
            }`}
            title="Gửi câu hỏi cho Mentor"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-500 mt-1">
          Legal AI Mentor xưng hô &quot;Mentor - bạn&quot;, đưa ra cố vấn học thuật và định hướng thực hành nghề luật Việt Nam.
        </p>
      </form>
    </div>
  );
};
