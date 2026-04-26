import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Mic, Image as ImageIcon, Video, X } from 'lucide-react';

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function Chat({ isOpen, onClose, userId }: ChatProps) {
  const [message, setMessage] = useState('');
  const [targetId, setTargetId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenChat = () => {
      const target = localStorage.getItem('chatTarget');
      setTargetId(target);
    };

    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed bottom-20 left-4 w-full max-w-md bg-[#0a0f1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
          style={{ height: '50vh' }}
        >
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0b1f3a]">
            <div className="flex flex-col">
              <h3 className="text-white font-bold flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-500" />
                Chat
              </h3>
              {targetId && (
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                  Target: {targetId.slice(0, 12)}...
                </span>
              )}
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Placeholder messages */}
            <div className="flex justify-start">
              <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                <p className="text-white text-sm">안녕하세요! 게시물 보고 연락드렸습니다.</p>
                <span className="text-[10px] text-white/40 mt-1 block">12:00 PM</span>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                <p className="text-white text-sm">네, 안녕하세요! 무엇을 도와드릴까요?</p>
                <span className="text-[10px] text-white/40 mt-1 block">12:05 PM</span>
              </div>
            </div>
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-white/10 bg-[#0b1f3a] flex items-center gap-2">
            <button className="text-white/60 hover:text-white p-2">
              <Mic size={20} />
            </button>
            <button className="text-white/60 hover:text-white p-2">
              <ImageIcon size={20} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
              <Send size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
