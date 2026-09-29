import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Robust generation helper with retry and fallback
async function generateLegalContent(params: {
  contents: any;
  config?: any;
}) {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed, attempting next if available...`, err.message);
    }
  }

  throw lastError || new Error('Không thể kết nối với mô hình AI');
}

const SYSTEM_INSTRUCTION = `BẠN LÀ "LEGAL AI MENTOR", một cố vấn học tập và định hướng nghề nghiệp luật tận tâm, chuyên nghiệp, hỗ trợ riêng cho sinh viên ngành Luật tại Việt Nam.

VAI TRÒ CỦA BẠN:
1. Persona: Duy trì giọng văn chuyên nghiệp, lập luận chặt chẽ, khách quan nhưng mang tính khích lệ, truyền cảm hứng. BẮT BUỘC xưng là "Mentor" và gọi người dùng là "bạn". Tuyệt đối không xưng là "tôi" hay xưng hô khác.
2. Mục tiêu chính: Giúp sinh viên Luật vạch ra lộ trình học tập, rèn luyện kỹ năng thực hành pháp luật và phát triển sự nghiệp vững chắc.
3. Bối cảnh kiến thức: Bạn có kiến thức sâu rộng về hệ thống pháp luật Việt Nam và quốc tế:
   - Luật Kinh tế, Doanh nghiệp, Thương mại, Đầu tư, M&A
   - Luật Dân sự, Hợp đồng, Bồi thường thiệt hại, Thừa kế, Đất đai
   - Luật Hình sự, Tội phạm, Trách nhiệm hình sự
   - Luật Quốc tế, Công pháp quốc tế, Tư pháp quốc tế, Trọng tài thương mại quốc tế (VIAC, SIAC)
   - Thủ tục Tố tụng dân sự, tố tụng hình sự, tố tụng hành chính
   - Đào tạo nghề tư pháp tại Học viện Tư pháp (Luật sư, Thẩm phán, Kiểm sát viên, Công chứng viên)
   - Thị trường lao động pháp lý: Top tier law firms (VILAF, YKVN, Frasers, LNT & Partners, Baker McKenzie...), In-house Counsel tại các tập đoàn, cơ quan tư pháp Tòa án - VKS.

QUY TRÌNH TƯ VẤN:
1. Chào hỏi và Thu thập thông tin: 
   Khi người dùng mới bắt đầu hoặc chưa cung cấp đầy đủ thông tin cá nhân, hãy chào mừng nồng nhiệt và yêu cầu người dùng cung cấp thông tin dưới dạng các gạch đầu dòng rõ ràng:
   - Chuyên ngành luật (hoặc định hướng chuyên sâu)
   - Môn học thế mạnh
   - Môn học còn yếu
   - Kỹ năng pháp lý hiện có (ví dụ: nghiên cứu văn bản, viết đơn từ, phương pháp IRAC...)
   - Mục tiêu nghề nghiệp (ví dụ: Luật sư tranh tụng, Luật sư tư vấn DN/M&A, Thẩm phán, Kiểm sát viên, Pháp chế doanh nghiệp/In-house...)

2. Phân tích và Đưa ra Lộ trình:
   Khi sinh viên đã cung cấp thông tin, lộ trình cố vấn bắt buộc phải bao gồm 3 phần rõ ràng, mạch lạc và có chiều sâu:
   - **Học tập**: Gợi ý các môn học tự chọn chiến lược; chứng chỉ ngoại ngữ pháp lý (TOLES Foundation/Higher/Advanced, IELTS band 7.0+); chứng chỉ hành nghề cần thiết (Chứng chỉ tốt nghiệp lớp đào tạo nghề luật sư/thẩm phán/kiểm sát viên tại Học viện Tư pháp); các kỹ năng nghiên cứu pháp lý trọng yếu (tra cứu Văn bản quy phạm pháp luật trên Thư viện pháp luật/Cơ sở dữ liệu quốc gia, nghiên cứu Án lệ của TANDTC, phương pháp phân tích IRAC/CREAC).
   - **Hoạt động ngoại khóa**: Đề xuất cụ thể việc tham gia Phiên tòa giả định (Moot Court: VMoot, FDI Moot, Philip C. Jessup, Willem C. Vis); CLB Luật gia trẻ / Đội tranh biện pháp luật; Trung tâm trợ giúp pháp lý (Legal Clinic) tại trường; Nghiên cứu khoa học (NCKH) sinh viên cấp trường/bộ.
   - **Phát triển sự nghiệp**: Gợi ý lộ trình thực tập từ năm 3-4 (thực tập sinh tại các Law firm, Tòa án nhân dân, Viện kiểm sát); định hướng thi tuyển và đào tạo tại Học viện Tư pháp sau đại học; kỹ năng soạn thảo Legal Opinion, CV pháp lý chuẩn ATS và kỹ năng phỏng vấn tình huống pháp lý.

3. Kết thúc:
   Luôn kết thúc bằng một lời động viên giàu nhiệt huyết, khẳng định tiềm năng của sinh viên, và khuyến khích sinh viên đặt thêm câu hỏi pháp lý cụ thể hoặc chia sẻ khó khăn đang gặp phải.`;

// API: General Mentorship Chat
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, userProfile } = req.body;

    let promptContents: any[] = [];

    // Contextualize with userProfile if available
    let profileContext = '';
    if (userProfile && (userProfile.major || userProfile.careerGoal)) {
      profileContext = `[Hồ sơ sinh viên hiện tại:
- Chuyên ngành: ${userProfile.major || 'Chưa cung cấp'}
- Năm học/Trường: ${userProfile.year || 'Chưa cung cấp'}
- Môn thế mạnh: ${userProfile.strengths || 'Chưa cung cấp'}
- Môn còn yếu: ${userProfile.weaknesses || 'Chưa cung cấp'}
- Kỹ năng hiện có: ${userProfile.skills || 'Chưa cung cấp'}
- Mục tiêu nghề nghiệp: ${userProfile.careerGoal || 'Chưa cung cấp'}
- Trình độ tiếng Anh/Chứng chỉ: ${userProfile.englishCert || 'Chưa cung cấp'}
]\n\n`;
    }

    if (Array.isArray(messages) && messages.length > 0) {
      promptContents = messages.map((m: any, index: number) => {
        const textContent = index === messages.length - 1 && profileContext 
          ? `${profileContext}Câu hỏi/phản hồi của sinh viên: ${m.content}`
          : m.content;
        return {
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: textContent }],
        };
      });
    } else {
      promptContents = [{ role: 'user', parts: [{ text: 'Chào Mentor, tôi là sinh viên Luật cần được định hướng.' }] }];
    }

    const response = await generateLegalContent({
      contents: promptContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Mentor luôn sẵn sàng đồng hành cùng bạn trên con đường chinh phục ngành Luật.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({
      error: 'Không thể kết nối với Legal AI Mentor. Vui lòng kiểm tra lại cấu hình hoặc thử lại sau.',
      details: error.message,
    });
  }
});

// API: Detailed Structured Roadmap Generator
app.post('/api/gemini/generate-roadmap', async (req, res) => {
  try {
    const { profile } = req.body;
    const prompt = `Phân tích hồ sơ sinh viên Luật sau và xây dựng LỘ TRÌNH 3 PHẦN TOÀN DIỆN:
- Chuyên ngành: ${profile.major || 'Luật chung'}
- Năm học: ${profile.year || 'Sinh viên đại học'}
- Môn thế mạnh: ${profile.strengths || 'Chưa rõ'}
- Môn còn yếu: ${profile.weaknesses || 'Chưa rõ'}
- Kỹ năng hiện có: ${profile.skills || 'Chưa rõ'}
- Ngoại ngữ: ${profile.englishCert || 'Chưa có'}
- Mục tiêu nghề nghiệp: ${profile.careerGoal || 'Luật sư / Chuyên viên pháp lý'}

Hãy lập lộ trình bài bản, logic, sát với thực tế pháp lý Việt Nam theo 3 phần chuẩn:
1. Học tập (Môn tự chọn, chứng chỉ TOLES/IELTS, chứng chỉ hành nghề Học viện Tư pháp, kỹ năng nghiên cứu & IRAC)
2. Hoạt động ngoại khóa (Moot Court, CLB Luật gia trẻ, Trung tâm trợ giúp pháp lý - Legal Clinic, NCKH)
3. Phát triển sự nghiệp (Lộ trình thực tập Law firm/Tòa án/VKS, định hướng Học viện Tư pháp, kỹ năng xin việc & CV)

Đồng thời tạo một bản tóm tắt định dạng sẵn (formatted text) để có thể chia sẻ lên Google Chat cho các bạn trong nhóm học tập hoặc peer mentor.`;

    const response = await generateLegalContent({
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mentorSummary: {
              type: Type.STRING,
              description: 'Nhận định tổng quan và đánh giá của Mentor về tiềm năng sinh viên',
            },
            academicTrack: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                electiveCourses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Gợi ý các môn học tự chọn nên đăng ký',
                },
                languageCertificates: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Chứng chỉ ngoại ngữ pháp lý (TOLES, IELTS,...)',
                },
                professionalCertificates: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Chứng chỉ hành nghề và khóa học nghiệp vụ tại Học viện Tư pháp',
                },
                legalResearchSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Kỹ năng tra cứu VBQPPL, Án lệ, Phương pháp IRAC/CREAC',
                },
              },
              required: ['title', 'electiveCourses', 'languageCertificates', 'professionalCertificates', 'legalResearchSkills'],
            },
            extracurricularTrack: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                mootCourts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Các cuộc thi Phiên tòa giả định nên tham gia (Moot Court)',
                },
                clubsAndOrgs: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'CLB Luật gia trẻ, Đội tranh tụng, Hội sinh viên',
                },
                legalClinic: {
                  type: Type.STRING,
                  description: 'Đề xuất tham gia Trung tâm trợ giúp pháp lý thực hành',
                },
                scientificResearch: {
                  type: Type.STRING,
                  description: 'Định hướng Nghiên cứu khoa học sinh viên (NCKH)',
                },
              },
              required: ['title', 'mootCourts', 'clubsAndOrgs', 'legalClinic', 'scientificResearch'],
            },
            careerTrack: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                internshipTimeline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      period: { type: Type.STRING },
                      targetOrg: { type: Type.STRING },
                      actionPlan: { type: Type.STRING },
                    },
                    required: ['period', 'targetOrg', 'actionPlan'],
                  },
                },
                judicialAcademyGuidance: {
                  type: Type.STRING,
                  description: 'Lộ trình sau tốt nghiệp tại Học viện Tư pháp',
                },
                jobApplicationSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Kỹ năng viết CV pháp lý, Thư ứng tuyển, Phỏng vấn Law firm/Cơ quan',
                },
              },
              required: ['title', 'internshipTimeline', 'judicialAcademyGuidance', 'jobApplicationSkills'],
            },
            encouragementMessage: {
              type: Type.STRING,
              description: 'Lời động viên truyền cảm hứng và lời kêu gọi đặt thêm câu hỏi pháp lý',
            },
            googleChatFormatText: {
              type: Type.STRING,
              description: 'Bản tin tóm tắt có định dạng markdown đẹp mắt sẵn sàng chia sẻ vào Google Chat',
            },
          },
          required: [
            'mentorSummary',
            'academicTrack',
            'extracurricularTrack',
            'careerTrack',
            'encouragementMessage',
            'googleChatFormatText',
          ],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error('Không nhận được phản hồi từ mô hình');
    }
    const data = JSON.parse(jsonText);
    res.json(data);
  } catch (error: any) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Practical IRAC Case Evaluation Lab
app.post('/api/gemini/evaluate-irac', async (req, res) => {
  try {
    const { caseScenario, studentIrac } = req.body;

    const prompt = `Bạn là Legal AI Mentor. Hãy đánh giá bài giải tình huống pháp lý theo phương pháp IRAC của sinh viên Luật:
TÌNH HUỐNG PHÁP LÝ:
${caseScenario}

BÀI LÀM CỦA SINH VIÊN:
- I (Issue - Vấn đề pháp lý): ${studentIrac.issue}
- R (Rule - Quy định pháp luật áp dụng): ${studentIrac.rule}
- A (Application - Phân tích & Áp dụng thực tế): ${studentIrac.application}
- C (Conclusion - Kết luận pháp lý): ${studentIrac.conclusion}

Hãy chấm điểm theo thang điểm 100, nhận xét chi tiết từng phần, chỉ ra thiếu sót về căn cứ pháp luật và đưa ra gợi ý sửa đổi hoàn hảo.`;

    const response = await generateLegalContent({
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            gradeLevel: { type: Type.STRING, description: 'Xuất sắc / Tốt / Đạt / Cần cải thiện' },
            generalComment: { type: Type.STRING },
            evaluation: {
              type: Type.OBJECT,
              properties: {
                issueFeedback: { type: Type.STRING },
                ruleFeedback: { type: Type.STRING },
                applicationFeedback: { type: Type.STRING },
                conclusionFeedback: { type: Type.STRING },
              },
              required: ['issueFeedback', 'ruleFeedback', 'applicationFeedback', 'conclusionFeedback'],
            },
            modelAnswer: {
              type: Type.OBJECT,
              properties: {
                idealIssue: { type: Type.STRING },
                idealRule: { type: Type.STRING },
                idealApplication: { type: Type.STRING },
                idealConclusion: { type: Type.STRING },
              },
              required: ['idealIssue', 'idealRule', 'idealApplication', 'idealConclusion'],
            },
            encouragement: { type: Type.STRING },
          },
          required: ['overallScore', 'gradeLevel', 'generalComment', 'evaluation', 'modelAnswer', 'encouragement'],
        },
      },
    });

    const jsonText = response.text;
    res.json(JSON.parse(jsonText || '{}'));
  } catch (error: any) {
    console.error('IRAC evaluation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend with Vite middlewares in dev, or static files in prod
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LEGAL AI MENTOR server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
