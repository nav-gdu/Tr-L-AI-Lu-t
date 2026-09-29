import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { ChatView } from './components/ChatView';
import { RoadmapView } from './components/RoadmapView';
import { IracLab } from './components/IracLab';
import { GoogleChatHub } from './components/GoogleChatHub';
import { CareerHandbook } from './components/CareerHandbook';
import { ProfileModal } from './components/ProfileModal';
import { GoogleChatModal } from './components/GoogleChatModal';
import { StudentProfile, ChatMessage, RoadmapData } from './types/mentor';
import { PRESET_PROFILES } from './data/mockLawData';
import { initAuth, googleSignIn, logout, getAccessToken } from './services/auth';
import { fetchChatSpaces, postMessageToChatSpace, ChatSpace } from './services/googleChat';

const INITIAL_MENTOR_MESSAGE: ChatMessage = {
  id: 'mentor-welcome-1',
  role: 'assistant',
  content: `Chào mừng bạn đến với **LEGAL AI MENTOR**! Mentor rất vui mừng được đồng hành cùng bạn trên con đường học tập và chinh phục nghề luật.

Nghề luật là một hành trình đòi hỏi tư duy logic sắc bén, kỹ năng thực hành chuẩn mực và bản lĩnh nghề nghiệp vững vàng. Để Mentor có thể thấu hiểu hoàn cảnh và vạch ra lộ trình cá nhân hóa toàn diện, bạn vui lòng chia sẻ thông tin theo các gạch đầu dòng sau:

• **Chuyên ngành luật:** (hoặc định hướng chuyên sâu bạn muốn theo đuổi)
• **Môn học thế mạnh:** (môn bạn đạt điểm cao hoặc thực sự hứng thú)
• **Môn học còn yếu:** (môn bạn cảm thấy khó khăn, khô khan hoặc chưa nắm chắc kiến thức)
• **Kỹ năng pháp lý hiện có:** (tra cứu văn bản QPPL, phân tích tình huống IRAC, soạn thảo, tranh biện...)
• **Mục tiêu nghề nghiệp:** (Luật sư tranh tụng, Luật sư tư vấn DN/M&A, Thẩm phán, Kiểm sát viên, Pháp chế doanh nghiệp/In-house...)

*Gợi ý:* Bạn có thể gõ câu trả lời trực tiếp hoặc nhấn nút **"Hồ sơ Sinh viên"** ở thanh điều hướng để chọn nhanh các hồ sơ mẫu. Mentor luôn sẵn sàng phân tích và lập lộ trình 3 phần cho bạn!`,
  timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'roadmap' | 'irac' | 'googleChat' | 'handbook'>('chat');
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Student Profile
  const [profile, setProfile] = useState<StudentProfile>(PRESET_PROFILES[0].data);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MENTOR_MESSAGE]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Roadmap State
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);

  // Google Chat Spaces & Sharing Modal
  const [chatSpaces, setChatSpaces] = useState<ChatSpace[]>([]);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareText, setShareText] = useState('');
  const [selectedSpaceForModal, setSelectedSpaceForModal] = useState('');

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        loadChatSpaces(token);
      },
      () => {
        setUser(null);
        setChatSpaces([]);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadChatSpaces = async (token?: string) => {
    const authToken = token || (await getAccessToken());
    if (!authToken) return;

    setIsLoadingSpaces(true);
    try {
      const spaces = await fetchChatSpaces(authToken);
      setChatSpaces(spaces);
      if (spaces.length > 0 && !selectedSpaceForModal) {
        setSelectedSpaceForModal(spaces[0].name);
      }
    } catch (err) {
      console.error('Failed to load Google Chat spaces:', err);
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        await loadChatSpaces(res.accessToken);
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      alert('Đăng nhập Google thất bại: ' + (err.message || 'Lỗi kết nối'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setChatSpaces([]);
  };

  // Send message to Legal AI Mentor
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoadingChat(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          userProfile: profile,
        }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi nhận phản hồi từ Mentor');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          'Mentor đang gặp trục trặc khi kết nối mạng. Bạn vui lòng thử lại câu hỏi trong giây lát nhé!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Generate 3-part structured roadmap
  const handleGenerateRoadmap = async (customProfile?: StudentProfile) => {
    const targetProfile = customProfile || profile;
    setIsLoadingRoadmap(true);
    setActiveTab('roadmap');

    try {
      const response = await fetch('/api/gemini/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: targetProfile,
        }),
      });

      if (!response.ok) {
        throw new Error('Lỗi tạo lộ trình từ máy chủ');
      }

      const data: RoadmapData = await response.json();
      setRoadmap(data);
    } catch (err: any) {
      console.error(err);
      alert('Không thể tạo lộ trình lúc này: ' + err.message);
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  // Trigger Google Chat sharing modal with explicit confirmation
  const handleOpenGoogleChatModal = (textToShare: string, spaceId?: string) => {
    setShareText(textToShare);
    if (spaceId) {
      setSelectedSpaceForModal(spaceId);
    } else if (chatSpaces.length > 0 && !selectedSpaceForModal) {
      setSelectedSpaceForModal(chatSpaces[0].name);
    }
    setIsShareModalOpen(true);
  };

  // Post message to Google Chat after explicit confirmation
  const handleConfirmSendToGoogleChat = async (spaceName: string, text: string) => {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Bạn cần đăng nhập Google để thực hiện thao tác này.');
    }
    await postMessageToChatSpace(token, spaceName, text);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        studentName={profile.name}
        careerGoal={profile.careerGoal}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-10">
        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoadingChat}
            profile={profile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onSwitchToRoadmap={() => {
              if (!roadmap) {
                handleGenerateRoadmap();
              } else {
                setActiveTab('roadmap');
              }
            }}
            onOpenGoogleChatShare={handleOpenGoogleChatModal}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            roadmap={roadmap}
            isLoading={isLoadingRoadmap}
            onGenerateRoadmap={() => handleGenerateRoadmap()}
            profile={profile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onShareToGoogleChat={handleOpenGoogleChatModal}
          />
        )}

        {activeTab === 'irac' && (
          <IracLab onShareToGoogleChat={handleOpenGoogleChatModal} />
        )}

        {activeTab === 'googleChat' && (
          <GoogleChatHub
            user={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
            spaces={chatSpaces}
            isLoadingSpaces={isLoadingSpaces}
            onRefreshSpaces={() => loadChatSpaces()}
            onTriggerShareModal={handleOpenGoogleChatModal}
          />
        )}

        {activeTab === 'handbook' && <CareerHandbook />}
      </main>

      {/* Profile Management Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={(updated) => setProfile(updated)}
        onGenerateRoadmapImmediately={(updated) => {
          setProfile(updated);
          handleGenerateRoadmap(updated);
        }}
      />

      {/* Google Chat Confirmation Modal */}
      <GoogleChatModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        messageText={shareText}
        spaces={chatSpaces}
        selectedSpace={selectedSpaceForModal}
        onSelectSpace={(s) => setSelectedSpaceForModal(s)}
        onConfirmSend={handleConfirmSendToGoogleChat}
        isLoadingSpaces={isLoadingSpaces}
        user={user}
        onLogin={handleLogin}
      />
    </div>
  );
}
