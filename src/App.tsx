/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Map as MapIcon, 
  List, 
  Bell, 
  Settings, 
  MessageSquare, 
  HelpCircle, 
  EyeOff, 
  Eye, 
  X,
  Phone,
  User,
  Users,
  Calendar,
  MapPin
} from 'lucide-react';
import Layout from './components/Layout';
import CategoryNav from './components/CategoryNav';
import PostCard from './components/PostCard';
import FloatingMap from './components/FloatingMap';
import Chat from './components/Chat';
import FAQ from './components/FAQ';
import LangSwitcher from './components/LangSwitcher';
import MobileNav from './components/MobileNav';
import Ballpit from './components/Ballpit';
import MapBackground from './components/MapBackground';
import { useGeolocation } from './hooks/useGeolocation';
import { getDictionary } from './lib/i18n';
import { Category, Post, GroupRoom } from './types';
import { DEFAULT_LANG } from './constants';
import { cn } from './lib/utils';
import { getThumbnail } from './lib/thumbnail';

export default function App() {
  const [lang, setLang] = useState(DEFAULT_LANG);
  const [dict, setDict] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [groupRooms, setGroupRooms] = useState<GroupRoom[]>([]);
  const [groupForm, setGroupForm] = useState({ title: '', maxParticipants: 10 });
  const [selectedGroupRoom, setSelectedGroupRoom] = useState<GroupRoom | null>(null);
  const [nickname, setNickname] = useState('');
  const [mobileTab, setMobileTab] = useState('home');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [writeForm, setWriteForm] = useState<Partial<Post>>({
    category: 'jobs',
    title: '',
    content: '',
    phone: '',
    images: [],
    video: ''
  });
  const { location, error: geoError } = useGeolocation();

  // Anonymous User ID
  const userId = useMemo(() => {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem('uid');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('uid', id);
    }
    return id;
  }, []);

  // Load Dictionary
  useEffect(() => {
    getDictionary(lang).then(setDict);
  }, [lang]);

  const [rawPosts, setRawPosts] = useState<Post[]>([]);

  // Initialize rawPosts
  useEffect(() => {
    const basePosts: Post[] = [
      {
        id: 'j1',
        userId: 'user_j1',
        category: 'jobs',
        title: '주말 단기 알바 구합니다',
        content: '카페 서빙 업무입니다. 경험자 우대하며 시급은 협의 가능합니다.',
        images: [],
        phone: '010-1234-5678',
        lat: 37.5000, lng: 127.0300, address: '서울특별시 강남구 논현동',
        likes: 5, dislikes: 0, createdAt: Date.now() - 7200000,
      },
      {
        id: 'j2',
        userId: 'user_j2',
        category: 'jobs',
        title: '야간 편의점 스태프 모집',
        content: '성실하신 분 찾습니다. 야간 수당 지급하며 업무 난이도 낮습니다.',
        images: [],
        phone: '010-2345-6789',
        lat: 37.4980, lng: 127.0280, address: '서울특별시 강남구 역삼동',
        likes: 3, dislikes: 1, createdAt: Date.now() - 14400000,
      },
      {
        id: 'j3',
        userId: 'user_j3',
        category: 'jobs',
        title: '배달 대행 기사님 모십니다',
        content: '강남 전 지역 배차 많습니다. 초보자 교육 가능하며 오토바이 리스 지원합니다.',
        images: [],
        phone: '010-3456-7890',
        lat: 37.5050, lng: 127.0400, address: '서울특별시 강남구 삼성동',
        likes: 7, dislikes: 2, createdAt: Date.now() - 21600000,
      },
      {
        id: 'r1',
        userId: 'user_r1',
        category: 'realestate',
        title: '강남역 도보 5분 오피스텔 전세',
        content: '풀옵션, 고층 전망 좋습니다. 즉시 입주 가능하며 보안 철저합니다.',
        images: [],
        phone: '010-4567-8901',
        lat: 37.4970, lng: 127.0260, address: '서울특별시 강남구 역삼동',
        likes: 15, dislikes: 1, createdAt: Date.now() - 3600000,
      },
      {
        id: 'r2',
        userId: 'user_r2',
        category: 'realestate',
        title: '논현동 깨끗한 원룸 월세',
        content: '조용한 주택가 위치. 채광 좋고 관리비 저렴합니다.',
        images: [],
        phone: '010-5678-9012',
        lat: 37.5110, lng: 127.0280, address: '서울특별시 강남구 논현동',
        likes: 9, dislikes: 0, createdAt: Date.now() - 86400000,
      },
      {
        id: 'r3',
        userId: 'user_r3',
        category: 'realestate',
        title: '역삼동 신축 투룸 첫 입주',
        content: '신축 첫 입주라 매우 깨끗합니다. 주차 가능하며 엘리베이터 있습니다.',
        images: [],
        phone: '010-6789-0123',
        lat: 37.4950, lng: 127.0350, address: '서울특별시 강남구 역삼동',
        likes: 12, dislikes: 2, createdAt: Date.now() - 172800000,
      },
      {
        id: 'm1',
        userId: 'user_m1',
        category: 'market',
        title: '아이폰 15 프로 팝니다',
        content: '상태 깨끗합니다. 박스 풀셋이고 직거래 선호합니다.',
        images: [],
        phone: '010-7890-1234',
        lat: 37.5100, lng: 127.0400, address: '서울특별시 강남구 삼성동',
        likes: 8, dislikes: 1, createdAt: Date.now() - 10800000,
      },
      {
        id: 'm2',
        userId: 'user_m2',
        category: 'market',
        title: '맥북 에어 M2 미개봉 새제품',
        content: '선물 받았는데 필요 없어서 팝니다. 실버 색상입니다.',
        images: [],
        phone: '010-8901-2345',
        lat: 37.4990, lng: 127.0290, address: '서울특별시 강남구 역삼동',
        likes: 20, dislikes: 0, createdAt: Date.now() - 43200000,
      },
      {
        id: 'm3',
        userId: 'user_m3',
        category: 'market',
        title: '캠핑용 텐트 급매합니다',
        content: '3회 사용했습니다. 상태 아주 좋고 구성품 다 있습니다.',
        images: [],
        phone: '010-9012-3456',
        lat: 37.5080, lng: 127.0350, address: '서울특별시 강남구 논현동',
        likes: 4, dislikes: 1, createdAt: Date.now() - 259200000,
      },
      {
        id: 'd1',
        userId: 'user_d1',
        category: 'drink',
        title: '오늘 저녁 강남역 번개하실 분?',
        content: '심심한데 가볍게 맥주 한잔해요! 나이대 상관없이 환영합니다.',
        images: [],
        phone: '010-0123-4567',
        lat: 37.4979, lng: 127.0276, address: '서울특별시 강남구 역삼동',
        likes: 6, dislikes: 2, createdAt: Date.now() - 1800000,
      },
      {
        id: 'd2',
        userId: 'user_d2',
        category: 'drink',
        title: '불금인데 같이 한잔해요',
        content: '안주 맛있는 곳 알고 있습니다. 같이 가실 분 구해요!',
        images: [],
        phone: '010-1111-2222',
        lat: 37.5010, lng: 127.0250, address: '서울특별시 강남구 서초동',
        likes: 11, dislikes: 3, createdAt: Date.now() - 3600000,
      },
      {
        id: 'd3',
        userId: 'user_d3',
        category: 'drink',
        title: '혼술하기 좋은 바 추천해주세요',
        content: '조용하게 위스키 한잔하고 싶은데 괜찮은 곳 있을까요?',
        images: [],
        phone: '010-2222-3333',
        lat: 37.5030, lng: 127.0320, address: '서울특별시 강남구 역삼동',
        likes: 14, dislikes: 0, createdAt: Date.now() - 5400000,
      },
      {
        id: 'p1',
        userId: 'user_p1',
        category: 'promo',
        title: '새로 오픈한 헬스장 이벤트',
        content: '선착순 50명 할인 행사 중입니다. 최신 기구 완비!',
        images: [],
        phone: '010-3333-4444',
        lat: 37.5020, lng: 127.0380, address: '서울특별시 강남구 삼성동',
        likes: 25, dislikes: 2, createdAt: Date.now() - 3600000,
      },
      {
        id: 'p2',
        userId: 'user_p2',
        category: 'promo',
        title: '1:1 영어 회화 과외 모집',
        content: '원어민 수준의 회화 실력 보장합니다. 기초부터 심화까지.',
        images: [],
        phone: '010-4444-5555',
        lat: 37.4960, lng: 127.0290, address: '서울특별시 강남구 역삼동',
        likes: 18, dislikes: 1, createdAt: Date.now() - 7200000,
      },
      {
        id: 'p3',
        userId: 'user_p3',
        category: 'promo',
        title: '자동차 디테일링 세차 할인',
        content: '오픈 기념 30% 할인 쿠폰 드립니다. 방문 전 예약 필수!',
        images: [],
        phone: '010-5555-6666',
        lat: 37.5120, lng: 127.0320, address: '서울특별시 강남구 논현동',
        likes: 30, dislikes: 0, createdAt: Date.now() - 10800000,
      },
      {
        id: 'f1',
        userId: 'user_f1',
        category: 'food',
        title: '강남역 근처 숨은 맛집 발견!',
        content: '여기 진짜 맛있어요. 분위기도 좋고 가격도 합리적입니다. 꼭 가보세요!',
        images: [],
        phone: '010-6666-7777',
        lat: 37.4979, lng: 127.0276, address: '서울특별시 강남구 역삼동',
        likes: 12, dislikes: 2, createdAt: Date.now() - 3600000,
      },
      {
        id: 'f2',
        userId: 'user_f2',
        category: 'food',
        title: '역삼동 인생 돈카츠집',
        content: '고기가 정말 두툼하고 육즙이 살아있습니다. 웨이팅 길지만 가치 있어요.',
        images: [],
        phone: '010-7777-8888',
        lat: 37.4990, lng: 127.0330, address: '서울특별시 강남구 역삼동',
        likes: 45, dislikes: 3, createdAt: Date.now() - 7200000,
      },
      {
        id: 'f3',
        userId: 'user_f3',
        category: 'food',
        title: '논현동 24시 국밥집 추천',
        content: '해장하기 딱 좋은 곳입니다. 국물이 진하고 고기가 많아요.',
        images: [],
        phone: '010-8888-9999',
        lat: 37.5080, lng: 127.0290, address: '서울특별시 강남구 논현동',
        likes: 22, dislikes: 1, createdAt: Date.now() - 10800000,
      }
    ];
    setRawPosts(basePosts);
  }, []);

  // Mock Posts (Keeping existing mock posts but adding more fields if needed)
  const posts: Post[] = useMemo(() => {
    if (!dict || !dict.posts) return rawPosts;

    return rawPosts.map(post => {
      const translated = dict.posts[post.id];
      if (translated && !post.isEdited) {
        return {
          ...post,
          title: translated.title || post.title,
          content: translated.content || post.content,
          address: translated.address || post.address
        };
      }
      return post;
    });
  }, [rawPosts, dict]);

  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter(p => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  const handleConsult = (targetUserId: string) => {
    localStorage.setItem("chatTarget", targetUserId);
    setIsChatOpen(true);
    setSelectedPost(null);
    // Dispatch event for Chat component to pick up
    window.dispatchEvent(new Event("openChat"));
  };

  const handleSavePost = () => {
    if (editingPost) {
      setRawPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, ...writeForm, isEdited: true } : p));
    } else {
      const newPost: Post = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        likes: 0,
        dislikes: 0,
        createdAt: Date.now(),
        lat: location?.lat || 37.5665,
        lng: location?.lng || 126.9780,
        address: '서울특별시 강남구',
        images: [],
        isEdited: true,
        ...writeForm as Post
      };
      setRawPosts(prev => [newPost, ...prev]);
    }
    setIsWriteModalOpen(false);
    setEditingPost(null);
    setWriteForm({
      category: 'jobs',
      title: '',
      content: '',
      phone: '',
      images: [],
      video: ''
    });
  };

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setWriteForm(post);
    setIsWriteModalOpen(true);
    setSelectedPost(null);
  };

  const handleVisit = (post: Post) => {
    setMapCenter({ lat: post.lat, lng: post.lng });
    setIsMapOpen(true);
    setSelectedPost(null);
  };

  const handleCreateGroupRoom = () => {
    if (!groupForm.title) return;
    const newRoom: GroupRoom = {
      id: Math.random().toString(36).substr(2, 9),
      title: groupForm.title,
      creatorId: 'me',
      maxParticipants: Math.min(30, Math.max(1, groupForm.maxParticipants)),
      participants: [],
      createdAt: Date.now()
    };
    setGroupRooms([...groupRooms, newRoom]);
    setIsGroupModalOpen(false);
    setGroupForm({ title: '', maxParticipants: 10 });
  };

  const handleJoinGroupRoom = () => {
    if (!selectedGroupRoom || !nickname) return;
    if (selectedGroupRoom.participants.length >= selectedGroupRoom.maxParticipants) return;
    
    const updatedRooms = groupRooms.map(room => {
      if (room.id === selectedGroupRoom.id) {
        return {
          ...room,
          participants: [...room.participants, { userId: 'me', nickname }]
        };
      }
      return room;
    });
    setGroupRooms(updatedRooms);
    setIsJoinModalOpen(false);
    setNickname('');
    setSelectedGroupRoom(null);
  };

  if (!dict) return <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center text-white">Loading...</div>;

  return (
    <Layout
      sidebar={
        <div className="p-6 flex flex-col h-full relative z-10">
          <div className="mb-8">
            <h1 className="text-xl font-black tracking-tighter text-white flex items-center gap-2">
              <span className="bg-blue-600 px-2 py-1 rounded-lg">{dict.header.title.split(' ')[0]}</span>
              <span>{dict.header.title.split(' ')[1]}</span>
            </h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mt-2">
              {dict.header.subtitle}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <button 
              onClick={() => setIsGroupModalOpen(true)}
              className="w-full bg-[#9b111e] hover:bg-[#b01e2d] text-white rounded-xl py-4 px-4 flex items-center justify-center gap-2 mb-6 transition-all shadow-lg shadow-[#9b111e]/20 font-black tracking-tight btn-magnetic"
            >
              <Users size={20} />
              {dict.labels.createGroupRoom}
            </button>

            <CategoryNav
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
              dict={dict}
            />

            {groupRooms.length > 0 && (
              <div className="mt-8">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 px-2">
                  {dict.labels.groupRooms}
                </h3>
                <div className="space-y-2">
                  {groupRooms.map(room => (
                    <button
                      key={room.id}
                      onClick={() => {
                        setSelectedGroupRoom(room);
                        setIsJoinModalOpen(true);
                      }}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-left transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate pr-2">
                          {room.title}
                        </span>
                        <span className="text-[10px] font-black text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
                          {room.participants.length}/{room.maxParticipants}
                        </span>
                      </div>
                      <div className="flex -space-x-2 overflow-hidden">
                        {room.participants.slice(0, 5).map((p, i) => (
                          <div key={i} className="w-5 h-5 rounded-full bg-blue-600 border-2 border-[#0a0f1c] flex items-center justify-center text-[8px] font-bold text-white">
                            {p.nickname[0]}
                          </div>
                        ))}
                        {room.participants.length > 5 && (
                          <div className="w-5 h-5 rounded-full bg-white/10 border-2 border-[#0a0f1c] flex items-center justify-center text-[8px] font-bold text-white/60">
                            +{room.participants.length - 5}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setIsPrivacyMode(!isPrivacyMode)}
                className={cn(
                  "p-2 rounded-lg transition-all btn-magnetic",
                  isPrivacyMode ? "bg-blue-600 text-white" : "text-white/40 hover:text-white"
                )}
              >
                {isPrivacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button className="p-2 text-white/40 hover:text-white transition-colors btn-magnetic">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      }
    >
      {/* Background Effects */}
      <MapBackground />
      <div className="fixed inset-0 -z-10 opacity-20 pointer-events-none">
        <Ballpit />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-0 z-30 py-4 glass-nav">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                placeholder={dict.placeholders.search}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
              />
            </div>
            <LangSwitcher currentLang={lang} onSelect={setLang} />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:text-white transition-all relative btn-magnetic">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0f1c]" />
            </button>
            <button 
              onClick={() => setIsWriteModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-lg shadow-blue-600/40 btn-magnetic"
            >
              <Plus size={20} />
              <span>{dict.buttons.write}</span>
            </button>
          </div>
        </div>

        {/* Posts Grid - 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <PostCard
                  post={post}
                  onLike={() => {}}
                  onDislike={() => {}}
                  onChat={() => handleConsult(post.userId)}
                  onClick={() => setSelectedPost(post)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Map */}
      <FloatingMap 
        isOpen={isMapOpen}
        onOpen={() => setIsMapOpen(true)}
        onClose={() => setIsMapOpen(false)}
        center={mapCenter || location || { lat: 37.5665, lng: 126.9780 }}
        markers={filteredPosts.map(p => ({ id: p.id, lat: p.lat, lng: p.lng, title: p.title }))}
      />

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform border border-white/10"
        >
          <MessageSquare size={24} />
        </button>
        <button
          onClick={() => setIsFAQOpen(!isFAQOpen)}
          className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform border border-white/10"
        >
          <HelpCircle size={24} />
        </button>
      </div>

      {/* Privacy Mode Overlay */}
      <AnimatePresence>
        {isPrivacyMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] privacy-blur pointer-events-none" 
          />
        )}
      </AnimatePresence>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-[#0A0F1C] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative group">
                <img 
                  src={getThumbnail(selectedPost)} 
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (event) => {
                      const file = (event.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        // Update the post directly for demo purposes
                        if (selectedPost) {
                          const updatedPost = { ...selectedPost, images: [url, ...selectedPost.images.slice(1)] };
                          setSelectedPost(updatedPost);
                          // In a real app, you'd update the global state/DB here
                        }
                      }
                    };
                    input.click();
                  }}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2"
                >
                  <Settings size={20} />
                  <span>{dict.labels.thumbnail}</span>
                </button>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
                    {selectedPost.category}
                  </span>
                  <div className="flex items-center gap-1 text-white/30 text-[10px] font-bold">
                    <Calendar size={12} />
                    <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <h2 className="text-2xl font-black text-white mb-4 leading-tight">
                  {selectedPost.title}
                </h2>

                <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">
                  {selectedPost.content}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-white/40 text-sm">
                    <MapPin size={18} className="text-blue-500" />
                    <span>{selectedPost.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/40 text-sm">
                    <User size={18} className="text-blue-500" />
                    <span>Anonymous User ({selectedPost.userId.slice(0, 8)})</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/40 text-sm">
                    <Phone size={18} className="text-blue-500" />
                    <span>{selectedPost.phone || 'Contact via Chat'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleConsult(selectedPost.userId)}
                    className="flex-1 btn-wine py-4 flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={20} />
                    <span>{dict.labels.chat}</span>
                  </button>
                  <button 
                    onClick={() => handleVisit(selectedPost)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 flex items-center justify-center gap-2 font-bold transition-all"
                  >
                    <MapPin size={20} />
                    <span>{dict.labels.visit}</span>
                  </button>
                  <button 
                    onClick={() => openEditModal(selectedPost)}
                    className="px-6 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white transition-all"
                  >
                    <Settings size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Write Modal */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsWriteModalOpen(false);
                setEditingPost(null);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-[#0A0F1C] rounded-3xl p-8 border border-white/10 relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white">
                  {editingPost ? `${dict.labels.edit} ${dict.labels.content}` : `${dict.buttons.write} ${dict.labels.content}`}
                </h2>
                <button onClick={() => {
                  setIsWriteModalOpen(false);
                  setEditingPost(null);
                }} className="text-white/40 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{dict.labels.category}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['jobs', 'realestate', 'market', 'drink', 'promo', 'food'].map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => setWriteForm({...writeForm, category: cat as Category})}
                        className={cn(
                          "py-2 border rounded-xl text-xs font-bold transition-all",
                          writeForm.category === cat 
                            ? "bg-blue-600 border-blue-500 text-white" 
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-blue-600/20"
                        )}
                      >
                        {dict.menu[cat]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{dict.labels.title}</label>
                  <input 
                    type="text" 
                    value={writeForm.title}
                    onChange={(e) => setWriteForm({...writeForm, title: e.target.value})}
                    placeholder={dict.placeholders.title} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500/50 outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{dict.labels.content}</label>
                  <textarea 
                    rows={4} 
                    value={writeForm.content}
                    onChange={(e) => setWriteForm({...writeForm, content: e.target.value})}
                    placeholder={dict.placeholders.content} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500/50 outline-none resize-none" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{dict.labels.phone}</label>
                    <input 
                      type="text" 
                      value={writeForm.phone}
                      onChange={(e) => setWriteForm({...writeForm, phone: e.target.value})}
                      placeholder="010-0000-0000" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500/50 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{dict.labels.uploadImage}</label>
                    <button 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.multiple = true;
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files;
                          if (files) {
                            const urls = Array.from(files).map(f => URL.createObjectURL(f));
                            setWriteForm({...writeForm, images: [...(writeForm.images || []), ...urls]});
                          }
                        };
                        input.click();
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      {dict.labels.selectFile}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{dict.labels.imageUrl}</label>
                  <input 
                    type="text" 
                    placeholder="https://..." 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value;
                        if (val) {
                          setWriteForm({...writeForm, images: [...(writeForm.images || []), val]});
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500/50 outline-none" 
                  />
                </div>

                {writeForm.images && writeForm.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {writeForm.images.map((img, idx) => (
                      <div key={idx} className={cn(
                        "relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                        idx === 0 ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-white/10"
                      )}>
                        <img src={img} className="w-full h-full object-cover" />
                        <div className="absolute top-1 right-1 flex gap-1">
                          {idx !== 0 && (
                            <button 
                              onClick={() => {
                                const newImages = [...(writeForm.images || [])];
                                const [selected] = newImages.splice(idx, 1);
                                newImages.unshift(selected);
                                setWriteForm({...writeForm, images: newImages});
                              }}
                              className="bg-blue-600/80 backdrop-blur-md rounded-full p-1 text-white hover:bg-blue-500"
                              title={dict.labels.thumbnail}
                            >
                              <Plus size={10} className="rotate-45" />
                            </button>
                          )}
                          <button 
                            onClick={() => setWriteForm({...writeForm, images: writeForm.images?.filter((_, i) => i !== idx)})}
                            className="bg-black/50 backdrop-blur-md rounded-full p-1 text-white hover:bg-red-500"
                          >
                            <X size={10} />
                          </button>
                        </div>
                        {idx === 0 && (
                          <div className="absolute bottom-0 inset-x-0 bg-blue-600/80 backdrop-blur-md py-0.5 text-[8px] font-black text-white text-center uppercase tracking-widest">
                            {dict.labels.thumbnail}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{dict.labels.uploadVideo}</label>
                    <button 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'video/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setWriteForm({...writeForm, video: url});
                          }
                        };
                        input.click();
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      {dict.labels.selectFile}
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{dict.labels.videoUrl}</label>
                    <input 
                      type="text" 
                      value={writeForm.video}
                      onChange={(e) => setWriteForm({...writeForm, video: e.target.value})}
                      placeholder="https://..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500/50 outline-none" 
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSavePost}
                  className="w-full btn-primary py-4"
                >
                  {editingPost ? dict.labels.edit : dict.labels.submit}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} userId={userId} />
      <FAQ items={dict.faq} isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
      
      {/* Group Room Creation Modal */}
      <AnimatePresence>
        {isGroupModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGroupModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-black text-white tracking-tight">{dict.labels.createGroupRoom}</h2>
                <button onClick={() => setIsGroupModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{dict.labels.roomTitle}</label>
                  <input 
                    type="text" 
                    value={groupForm.title}
                    onChange={(e) => setGroupForm({...groupForm, title: e.target.value})}
                    placeholder={dict.labels.roomTitle}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500/50 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{dict.labels.maxParticipants}</label>
                  <input 
                    type="number" 
                    min={1}
                    max={30}
                    value={groupForm.maxParticipants}
                    onChange={(e) => setGroupForm({...groupForm, maxParticipants: parseInt(e.target.value) || 1})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500/50 outline-none" 
                  />
                </div>
                <button 
                  onClick={handleCreateGroupRoom}
                  className="w-full bg-[#9b111e] hover:bg-[#b01e2d] text-white py-4 rounded-xl font-black tracking-tight transition-all shadow-lg shadow-[#9b111e]/20"
                >
                  {dict.labels.submit}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Join Group Room Modal */}
      <AnimatePresence>
        {isJoinModalOpen && selectedGroupRoom && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">{selectedGroupRoom.title}</h2>
                  <p className="text-xs text-white/40 font-bold mt-1">
                    {selectedGroupRoom.participants.length} / {selectedGroupRoom.maxParticipants}
                  </p>
                </div>
                <button onClick={() => setIsJoinModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{dict.labels.nickname}</label>
                  <input 
                    type="text" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder={dict.labels.nickname}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500/50 outline-none" 
                  />
                </div>
                <button 
                  onClick={handleJoinGroupRoom}
                  disabled={selectedGroupRoom.participants.length >= selectedGroupRoom.maxParticipants}
                  className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {dict.labels.join}
                </button>

                {selectedGroupRoom.participants.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">
                      Participants
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedGroupRoom.participants.map((p, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-bold text-white">
                            {p.nickname[0]}
                          </div>
                          <span className="text-xs text-white/80 font-medium">{p.nickname}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MobileNav activeTab={mobileTab} onTabChange={setMobileTab} />
    </Layout>
  );
}


