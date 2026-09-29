import React, { useState } from 'react';
import { Scale, Award, CheckCircle2, AlertCircle, Sparkles, BookOpen, Send, RefreshCw, ChevronRight } from 'lucide-react';
import { IracCase, IracEvaluation } from '../types/mentor';
import { IRAC_SAMPLE_CASES } from '../data/mockLawData';

interface IracLabProps {
  onShareToGoogleChat: (text: string) => void;
}

export const IracLab: React.FC<IracLabProps> = ({ onShareToGoogleChat }) => {
  const [selectedCase, setSelectedCase] = useState<IracCase>(IRAC_SAMPLE_CASES[0]);
  const [customFacts, setCustomFacts] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const [studentIrac, setStudentIrac] = useState({
    issue: '',
    rule: '',
    application: '',
    conclusion: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<IracEvaluation | null>(null);

  const activeFacts = isCustom ? customFacts : selectedCase.facts;

  const handleSelectCase = (c: IracCase) => {
    setIsCustom(false);
    setSelectedCase(c);
    setEvaluation(null);
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIrac.issue || !studentIrac.rule || !studentIrac.application || !studentIrac.conclusion) {
      alert('Vui lòng hoàn thành đủ 4 phần: Issue, Rule, Application, Conclusion trước khi nộp cho Mentor chấm điểm.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/evaluate-irac', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseScenario: activeFacts,
          studentIrac,
        }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi chấm bài IRAC');
      }

      const data = await response.json();
      setEvaluation(data);
    } catch (err: any) {
      console.error(err);
      alert('Không thể kết nối với Mentor để chấm bài. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-amber-600/30 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Thực hành Kỹ năng Tư duy Pháp lý
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
              Phòng Luyện Phương Pháp IRAC (Issue - Rule - Application - Conclusion)
            </h2>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          IRAC là tiêu chuẩn vàng trong tranh tụng tại Tòa án và tư vấn pháp lý quốc tế. Hãy rèn luyện kỹ năng phân tích tình huống thực tế và nhận nhận xét phản biện từ Legal AI Mentor.
        </p>
      </div>

      {/* Case Studies Selector */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
          Chọn tình huống pháp lý thực tiễn:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {IRAC_SAMPLE_CASES.map((c) => {
            const isSelected = !isCustom && selectedCase.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectCase(c)}
                className={`text-left p-3.5 rounded-xl border transition ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-semibold text-amber-400 uppercase block mb-1">
                  {c.category}
                </span>
                <p className="font-semibold text-xs text-slate-100 line-clamp-2">{c.title}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Case Fact Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-amber-400" />
            <h3 className="font-serif font-bold text-white text-sm sm:text-base">
              {isCustom ? 'Tình huống pháp lý tự nhập' : selectedCase.title}
            </h3>
          </div>
          <span className="text-xs text-amber-400 font-medium">
            {!isCustom && selectedCase.category}
          </span>
        </div>

        <div className="bg-slate-850 rounded-xl p-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans border border-slate-800 whitespace-pre-wrap">
          {activeFacts}
        </div>

        {!isCustom && selectedCase.suggestedIssueHint && (
          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start space-x-2">
            <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Gợi ý từ Mentor:</strong> {selectedCase.suggestedIssueHint}
            </span>
          </div>
        )}
      </div>

      {/* Student IRAC Submission Form */}
      <form onSubmit={handleEvaluate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* I - ISSUE */}
          <div className="bg-slate-900 border border-slate-800 focus-within:border-amber-500 rounded-2xl p-4 transition shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs border border-blue-500/30">
                I
              </span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Issue (Vấn đề pháp lý cốt lõi)
                </h4>
                <p className="text-[10px] text-slate-400">Câu hỏi pháp lý cần được giải quyết là gì?</p>
              </div>
            </div>
            <textarea
              rows={3}
              required
              value={studentIrac.issue}
              onChange={(e) => setStudentIrac({ ...studentIrac, issue: e.target.value })}
              placeholder="Ví dụ: Thỏa thuận phạt vi phạm 15% trong hợp đồng có hiệu lực pháp luật không? Mức phạt tối đa mà Bên mua được yêu cầu là bao nhiêu?"
              className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* R - RULE */}
          <div className="bg-slate-900 border border-slate-800 focus-within:border-amber-500 rounded-2xl p-4 transition shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs border border-emerald-500/30">
                R
              </span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Rule (Căn cứ pháp luật & Án lệ)
                </h4>
                <p className="text-[10px] text-slate-400">Nêu rõ Điều luật, Bộ luật hoặc Án lệ áp dụng</p>
              </div>
            </div>
            <textarea
              rows={3}
              required
              value={studentIrac.rule}
              onChange={(e) => setStudentIrac({ ...studentIrac, rule: e.target.value })}
              placeholder="Ví dụ: Căn cứ Điều 300, Điều 301 Luật Thương mại 2005 quy định mức phạt đối với vi phạm nghĩa vụ hợp đồng... hoặc Điều 418 BLDS 2015..."
              className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* A - APPLICATION */}
          <div className="bg-slate-900 border border-slate-800 focus-within:border-amber-500 rounded-2xl p-4 transition shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs border border-amber-500/30">
                A
              </span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Application (Lập luận & Áp dụng thực tiễn)
                </h4>
                <p className="text-[10px] text-slate-400">Áp dụng điều luật vào từng tình tiết của vụ việc</p>
              </div>
            </div>
            <textarea
              rows={4}
              required
              value={studentIrac.application}
              onChange={(e) => setStudentIrac({ ...studentIrac, application: e.target.value })}
              placeholder="Ví dụ: Hai bên đều là thương nhân, mục đích sinh lợi nên quan hệ hợp đồng thuộc phạm vi điều chỉnh của Luật Thương mại. Thỏa thuận 15% vượt quá trần 8% theo luật..."
              className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* C - CONCLUSION */}
          <div className="bg-slate-900 border border-slate-800 focus-within:border-amber-500 rounded-2xl p-4 transition shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs border border-purple-500/30">
                C
              </span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Conclusion (Kết luận & Hướng giải quyết)
                </h4>
                <p className="text-[10px] text-slate-400">Khẳng định câu trả lời cho Issue và kiến nghị</p>
              </div>
            </div>
            <textarea
              rows={4}
              required
              value={studentIrac.conclusion}
              onChange={(e) => setStudentIrac({ ...studentIrac, conclusion: e.target.value })}
              placeholder="Ví dụ: Thỏa thuận phạt vượt quá 8% bị vô hiệu phần vượt quá. Bên mua chỉ có quyền yêu cầu Bên bán trả tiền phạt tối đa là 8% (800 triệu đồng)..."
              className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-950/30 flex items-center justify-center space-x-2 transition"
          >
            {isLoading ? (
              <>
                <Scale className="h-4 w-4 animate-spin" />
                <span>Mentor đang chấm bài và đối chiếu văn bản luật...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Nộp bài để Legal AI Mentor Đánh Giá & Chấm Điểm</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="bg-slate-900 border border-amber-600/40 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Kết Quả Đánh Giá Bài Luyện IRAC
              </span>
              <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                Nhận Xét Chuyên Môn Của Legal AI Mentor
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-center">
                <span className="text-2xl font-black text-amber-400">{evaluation.overallScore}</span>
                <span className="text-[10px] text-slate-400 block font-medium">/ 100 Điểm</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-amber-300 font-semibold border border-slate-700">
                Xếp loại: {evaluation.gradeLevel}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-850 rounded-xl text-xs sm:text-sm text-slate-200 border border-slate-800 leading-relaxed">
            <strong className="text-amber-300 block mb-1">Đánh giá chung:</strong>
            {evaluation.generalComment}
          </div>

          {/* 4 Quadrants Detailed Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
              <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <ChevronRight className="h-3.5 w-3.5" />
                <span>Nhận xét Issue (Vấn đề pháp lý):</span>
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">{evaluation.evaluation.issueFeedback}</p>
            </div>

            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
              <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <ChevronRight className="h-3.5 w-3.5" />
                <span>Nhận xét Rule (Căn cứ pháp luật):</span>
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">{evaluation.evaluation.ruleFeedback}</p>
            </div>

            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <ChevronRight className="h-3.5 w-3.5" />
                <span>Nhận xét Application (Lập luận phân tích):</span>
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">{evaluation.evaluation.applicationFeedback}</p>
            </div>

            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
              <h5 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <ChevronRight className="h-3.5 w-3.5" />
                <span>Nhận xét Conclusion (Kết luận):</span>
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">{evaluation.evaluation.conclusionFeedback}</p>
            </div>
          </div>

          {/* Model Answer Provided by Mentor */}
          <div className="bg-slate-850/90 border border-amber-600/30 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
              <BookOpen className="h-4 w-4" />
              <span>Đáp án Chuẩn & Lập luận Tham khảo Từ Mentor:</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p><strong className="text-blue-300">[Issue chuẩn]:</strong> {evaluation.modelAnswer.idealIssue}</p>
              <p><strong className="text-emerald-300">[Rule chuẩn]:</strong> {evaluation.modelAnswer.idealRule}</p>
              <p><strong className="text-amber-300">[Application chuẩn]:</strong> {evaluation.modelAnswer.idealApplication}</p>
              <p><strong className="text-purple-300">[Conclusion chuẩn]:</strong> {evaluation.modelAnswer.idealConclusion}</p>
            </div>
          </div>

          {/* Encouragement & Share */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <p className="text-xs italic text-amber-200">
              &quot;{evaluation.encouragement}&quot;
            </p>
            <button
              type="button"
              onClick={() => {
                const shareText = `⚖️ [KẾT QUẢ LUYỆN TẬP IRAC - LEGAL AI MENTOR]
Tình huống: ${selectedCase.title}
Điểm số: ${evaluation.overallScore}/100 (${evaluation.gradeLevel})
Nhận xét của Mentor: ${evaluation.generalComment}

- Issue Chuẩn: ${evaluation.modelAnswer.idealIssue}
- Căn cứ Pháp luật: ${evaluation.modelAnswer.idealRule}
- Lời động viên: ${evaluation.encouragement}`;
                onShareToGoogleChat(shareText);
              }}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl flex items-center space-x-2 transition"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Chia sẻ kết quả lên Google Chat</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
