import React from 'react';
import { BookOpen, GraduationCap, Briefcase, Award, ExternalLink, Scale, CheckCircle2 } from 'lucide-react';
import { LEGAL_CAREER_GUIDES } from '../data/mockLawData';

export const CareerHandbook: React.FC = () => {
  const legalDatabases = [
    {
      name: 'Thư Viện Pháp Luật (thuvienphapluat.vn)',
      desc: 'Hệ thống tra cứu văn bản quy phạm pháp luật, hiệu lực văn bản, sơ đồ văn bản và nghị định hướng dẫn lớn nhất tại Việt Nam.',
    },
    {
      name: 'Cổng thông tin Án Lệ - TAND Tối Cao (anle.toan.gov.vn)',
      desc: 'Kho án lệ chính thức của Tòa án nhân dân tối cao được công bố để các Tòa án nghiên cứu, áp dụng trong xét xử.',
    },
    {
      name: 'Cơ sở Dữ liệu Quốc gia về Văn bản Pháp luật (vbpl.vn)',
      desc: 'Cổng thông tin chính thức của Bộ Tư pháp quản lý toàn bộ hệ thống văn bản từ Luật, Pháp lệnh đến Thông tư.',
    },
    {
      name: 'Trung tâm Trọng tài Quốc tế Việt Nam (viac.vn)',
      desc: 'Cơ quan giải quyết tranh chấp thương mại hàng đầu, nguồn tham khảo phán quyết trọng tài và điều khoản trọng tài mẫu.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/40 border border-amber-600/30 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Kiến Thức & Cẩm Nang
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
              Cẩm Nang Định Hướng Nghề Nghiệp Ngành Luật
            </h2>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Tổng hợp thông tin đào tạo chức danh tư pháp tại Học viện Tư pháp, tiêu chí tuyển dụng của các hãng luật hàng đầu, chứng chỉ ngoại ngữ pháp lý và các nguồn cơ sở dữ liệu tra cứu án lệ chuẩn xác.
        </p>
      </div>

      {/* Main Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {LEGAL_CAREER_GUIDES.map((guide, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg transition space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-wider">
                  {guide.badge}
                </span>
                <span className="text-xs text-slate-500 font-mono">0{idx + 1}</span>
              </div>
              <h3 className="font-serif font-bold text-base text-white">
                {guide.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {guide.description}
              </p>

              <div className="mt-3 space-y-2 border-t border-slate-800 pt-3">
                {guide.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start space-x-2 text-xs text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Databases & Resources */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center space-x-2">
          <Scale className="h-5 w-5 text-amber-400" />
          <h3 className="font-serif font-bold text-base text-white">
            Hệ Thống Cơ Sở Dữ Liệu Tra Cứu Pháp Lý Trọng Yếu
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Sinh viên Luật cần thành thạo việc tra cứu văn bản pháp luật hợp nhất, đối chiếu hiệu lực thi hành và án lệ giải thích áp dụng pháp luật.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {legalDatabases.map((db, idx) => (
            <div key={idx} className="bg-slate-850 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <h4 className="font-semibold text-xs text-amber-300">{db.name}</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">{db.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
