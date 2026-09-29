import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Circle,
  Share2,
  Send,
  Award,
  ChevronRight,
  GraduationCap,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { RoadmapData, StudentProfile } from '../types/mentor';

interface RoadmapViewProps {
  roadmap: RoadmapData | null;
  isLoading: boolean;
  onGenerateRoadmap: () => void;
  profile: StudentProfile;
  onOpenProfile: () => void;
  onShareToGoogleChat: (text: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  isLoading,
  onGenerateRoadmap,
  profile,
  onOpenProfile,
  onShareToGoogleChat,
}) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const totalPossibleChecks = 15;
  const currentChecks = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((currentChecks / totalPossibleChecks) * 100));

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 animate-pulse">
          <Scale className="h-10 w-10 animate-bounce" />
        </div>
        <h3 className="text-xl font-serif font-bold text-amber-400 mb-2">
          Legal AI Mentor đang phân tích hồ sơ và kiến tạo lộ trình 3 phần...
        </h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Mentor đang tổng hợp các môn tự chọn chiến lược, chứng chỉ TOLES/IELTS, sân chơi Moot Court và lộ trình thi Học viện Tư pháp phù hợp với mục tiêu{' '}
          <strong className="text-amber-300">{profile.careerGoal || 'nghề luật'}</strong> của bạn.
        </p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="inline-flex p-4 rounded-2xl bg-slate-800 border border-slate-700 text-amber-400 mb-4">
          <GraduationCap className="h-12 w-12" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-white mb-2">
          Chưa Có Lộ Trình Được Khởi Tạo
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Hãy cung cấp thông tin chuyên ngành, môn thế mạnh, môn còn yếu và mục tiêu nghề nghiệp để Legal AI Mentor thiết kế lộ trình 3 phần chuẩn hóa.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenProfile}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 font-medium text-sm transition"
          >
            Xem & Chỉnh sửa 5 thông tin hồ sơ
          </button>
          <button
            onClick={onGenerateRoadmap}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-900/30 flex items-center justify-center space-x-2 transition"
          >
            <Sparkles className="h-4 w-4" />
            <span>Khởi tạo Lộ trình 3 Phần ngay</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Top Banner: Overview & Quick Actions */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-amber-600/40 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                Lộ Trình Chuẩn Hóa 3 Phần
              </span>
              <span className="text-xs text-slate-400">Dành cho sinh viên Luật</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-white mt-1">
              Chiến Lược Học Tập & Phát Triển Nghề Luật
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {roadmap.mentorSummary}
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <button
              onClick={onGenerateRoadmap}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Phân tích và tạo lại lộ trình mới"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => onShareToGoogleChat(roadmap.googleChatFormatText)}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition"
            >
              <Send className="h-4 w-4" />
              <span>Gửi vào Google Chat</span>
            </button>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="w-full sm:max-w-md">
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span className="text-slate-300">Tiến độ tích lũy kỹ năng pháp lý:</span>
              <span className="text-amber-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Đã hoàn thành <strong className="text-emerald-400">{currentChecks}</strong> mục tiêu trong lộ trình
          </p>
        </div>
      </div>

      {/* TRACK 1: HỌC TẬP (ACADEMIC TRACK) */}
      <section className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg transition">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Phần 1</span>
            <h3 className="text-lg font-serif font-bold text-white">
              Học Tập & Chứng Chỉ Pháp Lý
            </h3>
            <p className="text-xs text-slate-400">
              Gợi ý môn tự chọn, chứng chỉ ngoại ngữ (TOLES/IELTS), chứng chỉ hành nghề và kỹ năng tra cứu
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Môn học tự chọn */}
          <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center space-x-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              <span>Môn học tự chọn chiến lược:</span>
            </h4>
            <ul className="space-y-2">
              {roadmap.academicTrack.electiveCourses.map((course, idx) => {
                const key = `academic-elective-${idx}`;
                const done = !!completedItems[key];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleItem(key)}
                    className="flex items-start space-x-2 text-xs text-slate-200 cursor-pointer hover:text-white transition"
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={done ? 'line-through text-slate-400' : ''}>{course}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Chứng chỉ ngoại ngữ pháp lý */}
          <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2 flex items-center space-x-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              <span>Chứng chỉ ngoại ngữ (TOLES / IELTS):</span>
            </h4>
            <ul className="space-y-2">
              {roadmap.academicTrack.languageCertificates.map((cert, idx) => {
                const key = `academic-cert-${idx}`;
                const done = !!completedItems[key];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleItem(key)}
                    className="flex items-start space-x-2 text-xs text-slate-200 cursor-pointer hover:text-white transition"
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={done ? 'line-through text-slate-400' : ''}>{cert}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Chứng chỉ hành nghề cần thiết */}
          <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2 flex items-center space-x-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              <span>Chứng chỉ hành nghề & Nghiệp vụ tư pháp:</span>
            </h4>
            <ul className="space-y-2">
              {roadmap.academicTrack.professionalCertificates.map((item, idx) => {
                const key = `academic-prof-${idx}`;
                const done = !!completedItems[key];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleItem(key)}
                    className="flex items-start space-x-2 text-xs text-slate-200 cursor-pointer hover:text-white transition"
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={done ? 'line-through text-slate-400' : ''}>{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Kỹ năng nghiên cứu pháp lý */}
          <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center space-x-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              <span>Kỹ năng nghiên cứu pháp lý & IRAC:</span>
            </h4>
            <ul className="space-y-2">
              {roadmap.academicTrack.legalResearchSkills.map((skill, idx) => {
                const key = `academic-skill-${idx}`;
                const done = !!completedItems[key];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleItem(key)}
                    className="flex items-start space-x-2 text-xs text-slate-200 cursor-pointer hover:text-white transition"
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={done ? 'line-through text-slate-400' : ''}>{skill}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* TRACK 2: HOẠT ĐỘNG NGOẠI KHÓA (EXTRACURRICULAR TRACK) */}
      <section className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg transition">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Phần 2</span>
            <h3 className="text-lg font-serif font-bold text-white">
              Hoạt Động Ngoại Khóa & Thực Chiến
            </h3>
            <p className="text-xs text-slate-400">
              Phiên tòa giả định (Moot Court), CLB Luật gia trẻ, Trung tâm trợ giúp pháp lý (Legal Clinic) và NCKH
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Moot Court */}
          <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center space-x-1.5">
              <Award className="h-3.5 w-3.5" />
              <span>Phiên tòa giả định (Moot Court):</span>
            </h4>
            <ul className="space-y-2">
              {roadmap.extracurricularTrack.mootCourts.map((moot, idx) => {
                const key = `extra-moot-${idx}`;
                const done = !!completedItems[key];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleItem(key)}
                    className="flex items-start space-x-2 text-xs text-slate-200 cursor-pointer hover:text-white transition"
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={done ? 'line-through text-slate-400' : ''}>{moot}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* CLB Luật gia trẻ */}
          <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-2 flex items-center space-x-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>CLB Luật gia trẻ & Đội Tranh biện:</span>
            </h4>
            <ul className="space-y-2">
              {roadmap.extracurricularTrack.clubsAndOrgs.map((club, idx) => {
                const key = `extra-club-${idx}`;
                const done = !!completedItems[key];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleItem(key)}
                    className="flex items-start space-x-2 text-xs text-slate-200 cursor-pointer hover:text-white transition"
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={done ? 'line-through text-slate-400' : ''}>{club}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal Clinic */}
          <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2 flex items-center space-x-1.5">
              <Scale className="h-3.5 w-3.5" />
              <span>Trung tâm Trợ giúp pháp lý (Legal Clinic):</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {roadmap.extracurricularTrack.legalClinic}
            </p>
          </div>

          {/* NCKH */}
          <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-2 flex items-center space-x-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Nghiên cứu khoa học sinh viên (NCKH):</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {roadmap.extracurricularTrack.scientificResearch}
            </p>
          </div>
        </div>
      </section>

      {/* TRACK 3: PHÁT TRIỂN SỰ NGHIỆP (CAREER PROGRESSION TRACK) */}
      <section className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg transition">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Phần 3</span>
            <h3 className="text-lg font-serif font-bold text-white">
              Phát Triển Sự Nghiệp & Thực Tập
            </h3>
            <p className="text-xs text-slate-400">
              Lộ trình thực tập Law firm/Tòa án/VKS, đào tạo tại Học viện Tư pháp và kỹ năng xin việc
            </p>
          </div>
        </div>

        {/* Timeline thực tập */}
        <div className="space-y-3 mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Lộ trình Thực tập theo từng giai đoạn:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {roadmap.careerTrack.internshipTimeline.map((item, idx) => (
              <div key={idx} className="bg-slate-850 border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.period}
                </span>
                <h5 className="font-semibold text-white text-xs mt-2 text-slate-100">
                  {item.targetOrg}
                </h5>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {item.actionPlan}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Học viện Tư pháp */}
          <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center space-x-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Định hướng đào tạo tại Học viện Tư pháp:</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {roadmap.careerTrack.judicialAcademyGuidance}
            </p>
          </div>

          {/* Kỹ năng xin việc & CV */}
          <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center space-x-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Kỹ năng viết CV pháp lý & Phỏng vấn:</span>
            </h4>
            <ul className="space-y-2">
              {roadmap.careerTrack.jobApplicationSkills.map((skill, idx) => {
                const key = `career-skill-${idx}`;
                const done = !!completedItems[key];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleItem(key)}
                    className="flex items-start space-x-2 text-xs text-slate-200 cursor-pointer hover:text-white transition"
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={done ? 'line-through text-slate-400' : ''}>{skill}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Encouragement Footer */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-600/30 rounded-2xl p-5 shadow-lg flex items-start space-x-4">
        <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-sm font-serif font-bold text-amber-300">
            Lời Khuyên & Động Viên Từ Mentor
          </h4>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 italic leading-relaxed">
            &quot;{roadmap.encouragementMessage}&quot;
          </p>
          <div className="mt-3 flex items-center space-x-3">
            <button
              onClick={() => onShareToGoogleChat(roadmap.googleChatFormatText)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Chia sẻ lộ trình này lên Google Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
