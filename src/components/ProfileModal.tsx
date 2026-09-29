import React, { useState } from 'react';
import { X, Sparkles, User, GraduationCap, Target, BookMarked, AlertCircle, CheckCircle2 } from 'lucide-react';
import { StudentProfile } from '../types/mentor';
import { PRESET_PROFILES } from '../data/mockLawData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  onGenerateRoadmapImmediately?: (profile: StudentProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onGenerateRoadmapImmediately,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);

  if (!isOpen) return null;

  const handlePresetSelect = (presetData: StudentProfile) => {
    setFormData(presetData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
    if (onGenerateRoadmapImmediately) {
      onGenerateRoadmapImmediately(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-600/30 w-full max-w-3xl rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-amber-400">
                Hồ Sơ Sinh Viên Ngành Luật
              </h2>
              <p className="text-xs text-slate-400">
                Cung cấp 5 thông tin trọng yếu để Legal AI Mentor xây dựng lộ trình cá nhân hóa
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

        {/* Quick Presets */}
        <div className="p-4 bg-slate-800/40 border-b border-slate-800">
          <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Chọn nhanh hồ sơ mẫu (Presets):</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_PROFILES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(preset.data)}
                className="text-left p-2 rounded-lg bg-slate-800 hover:bg-amber-900/30 border border-slate-700 hover:border-amber-500/50 text-xs transition group"
              >
                <p className="font-semibold text-slate-200 group-hover:text-amber-300">{preset.label}</p>
                <p className="text-[10px] text-slate-400 line-clamp-1">{preset.data.year}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Họ và Tên sinh viên
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Trường & Năm học
              </label>
              <input
                type="text"
                value={formData.year || ''}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="Ví dụ: ĐH Luật Hà Nội - Năm thứ 3"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 1. Chuyên ngành */}
          <div>
            <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center space-x-1">
              <span>1. Chuyên ngành Luật đang học / định hướng</span>
              <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              placeholder="Ví dụ: Luật Kinh tế, Luật Dân sự & Tố tụng dân sự, Luật Quốc tế, Luật Hình sự..."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 2. Môn học thế mạnh */}
            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1 flex items-center space-x-1">
                <span>2. Môn học thế mạnh (điểm cao, hứng thú)</span>
                <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.strengths}
                onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                placeholder="Ví dụ: Pháp luật Hợp đồng thương mại, Luật Sở hữu trí tuệ, Luật Doanh nghiệp..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* 3. Môn học còn yếu */}
            <div>
              <label className="block text-xs font-semibold text-rose-400 mb-1 flex items-center space-x-1">
                <span>3. Môn học còn yếu (khó khăn, điểm chưa tốt)</span>
                <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.weaknesses}
                onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
                placeholder="Ví dụ: Tố tụng dân sự, Lý luận Nhà nước & Pháp luật, Pháp luật Cạnh tranh, Thuế..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 4. Kỹ năng pháp lý hiện có */}
          <div>
            <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center space-x-1">
              <span>4. Kỹ năng pháp lý hiện có</span>
              <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="Ví dụ: Tra cứu VBQPPL trên Thư Viện Pháp Luật, phương pháp phân tích IRAC cơ bản, viết tóm tắt vụ việc, kỹ năng tranh biện..."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 5. Mục tiêu nghề nghiệp */}
            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center space-x-1">
                <span>5. Mục tiêu nghề nghiệp định hướng</span>
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.careerGoal}
                onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                placeholder="Ví dụ: Luật sư M&A tại Law Firm quốc tế, Thẩm phán Tòa án, In-house Counsel..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Ngoại ngữ & Chứng chỉ */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Trình độ Ngoại ngữ / Chứng chỉ hiện có
              </label>
              <input
                type="text"
                value={formData.englishCert || ''}
                onChange={(e) => setFormData({ ...formData, englishCert: e.target.value })}
                placeholder="Ví dụ: IELTS 6.5, mục tiêu TOLES Higher, tiếng Trung sơ cấp..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition"
            >
              Lưu thông tin hồ sơ
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-900/30 flex items-center justify-center space-x-2 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>Yêu cầu Mentor phân tích & lập lộ trình</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
