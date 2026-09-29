import { StudentProfile, IracCase } from '../types/mentor';

export const PRESET_PROFILES: { label: string; description: string; data: StudentProfile }[] = [
  {
    label: 'Luật sư Doanh nghiệp / M&A',
    description: 'Sinh viên năm 3 định hướng gia nhập các hãng luật quốc tế hoặc Top tier Việt Nam',
    data: {
      name: 'Nguyễn Văn Minh',
      university: 'Đại học Luật Hà Nội / ĐH Luật TP.HCM',
      year: 'Năm thứ 3',
      major: 'Luật Kinh tế & Thương mại Quốc tế',
      strengths: 'Pháp luật Hợp đồng thương mại, Luật Doanh nghiệp, tiếng Anh giao tiếp tốt',
      weaknesses: 'Thủ tục Tố tụng, Pháp luật Cạnh tranh và Thuế doanh nghiệp',
      skills: 'Tra cứu văn bản pháp luật, đọc hiểu hợp đồng song ngữ Anh - Việt cơ bản',
      careerGoal: 'Luật sư tư vấn Doanh nghiệp / M&A tại các Law Firm hàng đầu (VILAF, YKVN, LNT...)',
      englishCert: 'IELTS 6.5 (đang hướng tới 7.5 và TOLES Higher)',
    },
  },
  {
    label: 'Luật sư Tranh tụng Tòa án',
    description: 'Sinh viên muốn rèn luyện kỹ năng biện hộ tại Tòa án và Trọng tài thương mại',
    data: {
      name: 'Trần Thị Mai',
      university: 'Khoa Luật - ĐHQGHN / UEL',
      year: 'Năm thứ 2',
      major: 'Luật Dân sự & Tố tụng Dân sự',
      strengths: 'Kỹ năng tranh luận, tư duy logic, nắm vững Pháp luật Nghĩa vụ và Bồi thường thiệt hại',
      weaknesses: 'Kỹ năng nghiên cứu Án lệ chuyên sâu, tâm lý đứng trước hội đồng xét xử',
      skills: 'Thuyết trình pháp lý, tư duy phản biện, phương pháp phân tích IRAC sơ cấp',
      careerGoal: 'Luật sư Tranh tụng tại Tòa án và Trung tâm Trọng tài Quốc tế Việt Nam (VIAC)',
      englishCert: 'IELTS 6.0',
    },
  },
  {
    label: 'Thẩm phán / Kiểm sát viên',
    description: 'Sinh viên định hướng phụng sự cơ quan tư pháp Nhà nước',
    data: {
      name: 'Lê Hoàng Long',
      university: 'Đại học Kiểm sát / Học viện Tòa án',
      year: 'Năm thứ 3',
      major: 'Luật Hình sự & Tố tụng Hình sự',
      strengths: 'Lý luận Nhà nước & Pháp luật, Cấu thành tội phạm, Quy trình tố tụng tư pháp',
      weaknesses: 'Ngoại ngữ pháp lý chuyên ngành, pháp luật hợp đồng kinh tế',
      skills: 'Kỹ năng nghiên cứu hồ sơ vụ án, lập luận theo điều luật, viết báo cáo pháp lý',
      careerGoal: 'Trúng tuyển công chức Tòa án / Viện kiểm sát và học nghiệp vụ tại Học viện Tư pháp',
      englishCert: 'B1 Vstep',
    },
  },
  {
    label: 'Pháp chế Doanh nghiệp (In-house Counsel)',
    description: 'Sinh viên hướng tới bảo vệ quyền lợi pháp lý cho các tập đoàn công nghệ & bán lẻ',
    data: {
      name: 'Phạm Thu Trang',
      university: 'Đại học Kinh tế - Luật',
      year: 'Năm thứ 4',
      major: 'Luật Thương mại & Lao động',
      strengths: 'Pháp luật Lao động, Sở hữu trí tuệ, quản trị rủi ro hợp đồng',
      weaknesses: 'Tố tụng hình sự, thủ tục hành chính chuyên ngành',
      skills: 'Soạn thảo quy chế nội bộ, review hợp đồng thương mại, giải quyết tranh chấp lao động',
      careerGoal: 'In-house Legal Counsel tại tập đoàn Fintech hoặc E-commerce',
      englishCert: 'IELTS 7.0',
    },
  },
];

export const IRAC_SAMPLE_CASES: IracCase[] = [
  {
    id: 'case-commercial-penalty',
    title: 'Tranh chấp Thỏa thuận Phạt vi phạm Hợp đồng thương mại vượt quá 8%',
    category: 'Luật Thương mại & Kinh tế',
    facts: `Công ty TNHH Hoàng Phát (Bên mua) ký hợp đồng mua 500 tấn nông sản xuất khẩu của Công ty CP Nông sản Đại Nam (Bên bán) trị giá 10 tỷ đồng.
Trong hợp đồng, Điều 12 quy định: "Nếu Bên bán giao hàng chậm quá 15 ngày thì phải chịu phạt vi phạm hợp đồng bằng 15% tổng giá trị hợp đồng".
Thực tế, Bên bán chậm giao hàng 20 ngày do khó khăn vận tải. Bên mua căn cứ Điều 12 yêu cầu Bên bán nộp phạt 1,5 tỷ đồng (15%).
Bên bán từ chối và cho rằng theo quy định của Luật Thương mại 2005, mức phạt hợp đồng tối đa chỉ là 8% giá trị phần nghĩa vụ hợp đồng bị vi phạm.`,
    suggestedIssueHint: 'Thỏa thuận phạt vi phạm 15% trong hợp đồng thương mại có hiệu lực pháp luật không? Mức phạt tối đa mà Bên mua được hưởng là bao nhiêu?',
  },
  {
    id: 'case-labor-termination',
    title: 'Đơn phương chấm dứt HĐLĐ trái pháp luật và Trách nhiệm bồi thường',
    category: 'Luật Lao động',
    facts: `Anh Bình làm việc tại Công ty TechVN theo Hợp đồng lao động xác định thời hạn 24 tháng (lương 25 triệu đồng/tháng). Sau 8 tháng làm việc, do cắt giảm chi phí bất ngờ, Giám đốc gửi email thông báo chấm dứt HĐLĐ với anh Bình sau 5 ngày báo trước với lý do "doanh nghiệp tái cơ cấu nhưng không có phương án sử dụng lao động theo quy định".
Anh Bình khiếu nại cho rằng Công ty đã chấm dứt hợp đồng trái pháp luật và đòi bồi thường toàn bộ tiền lương của những ngày còn lại theo hợp đồng.`,
    suggestedIssueHint: 'Công ty TechVN có vi phạm căn cứ và thời hạn báo trước theo Bộ luật Lao động 2019 không? Anh Bình được hưởng những quyền lợi và khoản bồi thường nào?',
  },
  {
    id: 'case-tort-liability',
    title: 'Bồi thường thiệt hại ngoài hợp đồng do Cây xanh đô thị gãy đổ',
    category: 'Luật Dân sự & Án lệ',
    facts: `Trong một buổi chiều mưa dông bình thường (không có bão lớn), một cành cây xà cừ lớn do Công ty TNHH MTV Công viên Cây xanh thành phố quản lý bị gãy rơi trúng ô tô của ông Tuấn đang đỗ đúng nơi quy định dưới lòng đường, gây thiệt hại sửa chữa xe 120 triệu đồng.
Công ty Cây xanh từ chối bồi thường với lý do đây là "sự kiện bất khả kháng do thiên tai mưa gió". Ông Tuấn khởi kiện yêu cầu Công ty bồi thường toàn bộ thiệt hại.`,
    suggestedIssueHint: 'Chủ thể quản lý cây xanh có phải chịu trách nhiệm bồi thường thiệt hại do cây cối gây ra theo Điều 604 Bộ luật Dân sự 2015 không? Yếu tố bất khả kháng có được chấp nhận trong trường hợp này?',
  },
];

export const LEGAL_CAREER_GUIDES = [
  {
    title: 'Học viện Tư pháp (Judicial Academy)',
    badge: 'Đào tạo chức danh tư pháp',
    description: 'Cơ sở đào tạo nghề duy nhất tại Việt Nam cấp chứng chỉ nghiệp vụ cho Luật sư, Thẩm phán, Kiểm sát viên, Công chứng viên, Thừa phát lại.',
    points: [
      'Thời gian đào tạo nghề Luật sư: 12 tháng (tập trung hoặc cuối tuần). Sau khi tốt nghiệp phải tập sự hành nghề luật sư 12 tháng tại tổ chức hành nghề luật sư.',
      'Đào tạo chung nguồn Thẩm phán, Kiểm sát viên, Luật sư: Chương trình 24 tháng cho những ai định hướng cơ quan công quyền hoặc tư pháp cấp cao.',
      'Điều kiện xét tuyển: Bằng Cử nhân Luật (LL.B) từ các cơ sở đào tạo luật được Bộ GD&ĐT công nhận.',
    ],
  },
  {
    title: 'Top Hãng Luật (Law Firms) tại Việt Nam',
    badge: 'Môi trường làm việc chuyên nghiệp',
    description: 'Phân loại các tổ chức hành nghề luật sư từ Top-tier trong nước đến International firms.',
    points: [
      'Tier 1 Local Firms: VILAF, YKVN, LNT & Partners, Phuoc & Partners, Apolat Legal, Bross & Partners.',
      'International Law Firms: Baker McKenzie, Frasers Law Company, Rajah & Tann LCT, Allen & Overy, Tilleke & Gibbins.',
      'Yêu cầu tuyển dụng Intern / Junior Associate: GPA khá/giỏi, tiếng Anh pháp lý lưu loát (IELTS 7.0+ hoặc TOLES), kỹ năng tra cứu IRAC và tinh thần chịu áp lực cao.',
    ],
  },
  {
    title: 'Ngoại ngữ Pháp lý: TOLES vs. IELTS',
    badge: 'Vũ khí cạnh tranh quốc tế',
    description: 'Lựa chọn lộ trình chứng chỉ ngoại ngữ phù hợp cho người hành nghề luật.',
    points: [
      'TOLES (Test of Legal English Skills): Chứng chỉ chuyên sâu hàng đầu thế giới về tiếng Anh pháp lý, gồm 3 cấp độ Foundation, Higher và Advanced. Được Law Society of England and Wales công nhận.',
      'IELTS Academic: Thước đo khả năng học thuật tổng quát, sinh viên Luật nên đạt tối thiểu Band 6.5 - 7.0+ để đủ điều kiện xét tuyển học bổng LL.M hoặc ứng tuyển Law firm quốc tế.',
      'Ngoại ngữ 2: Tiếng Trung, Tiếng Hàn, Tiếng Nhật là lợi thế vượt trội khi làm việc tại các FDI Law firms tại Việt Nam.',
    ],
  },
  {
    title: 'Phiên tòa giả định (Moot Court)',
    badge: 'Đấu trường tranh biện sinh viên',
    description: 'Sân chơi mô phỏng quá trình tranh tụng thực tế giúp sinh viên nâng tầm tư duy phản biện.',
    points: [
      'Philip C. Jessup International Law Moot Court: Cuộc thi phiên tòa giả định lớn nhất thế giới về Công pháp Quốc tế.',
      'Willem C. Vis International Commercial Arbitration Moot: Cuộc thi về Trọng tài Thương mại Quốc tế và CISG.',
      'VMoot / Vietnam Moot Court: Cuộc thi quy mô quốc gia bằng tiếng Việt mô phỏng tranh chấp dân sự và thương mại.',
    ],
  },
];
