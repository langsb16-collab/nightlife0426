import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, X } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  items: FAQItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function FAQ({ items, isOpen, onClose }: FAQProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 right-4 w-full max-w-md bg-[#0a0f1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          style={{ maxHeight: '60vh' }}
        >
          <div className="p-4 border-bottom border-white/10 flex justify-between items-center bg-[#0b1f3a]">
            <h3 className="text-white font-bold flex items-center gap-2">
              <HelpCircle size={20} className="text-orange-500" />
              FAQ
            </h3>
            <button onClick={onClose} className="text-white/60 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="overflow-y-auto p-2" style={{ maxHeight: 'calc(60vh - 60px)' }}>
            {items.map((item, index) => (
              <div key={index} className="mb-2">
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full p-3 text-left bg-white/5 hover:bg-white/10 rounded-xl flex justify-between items-center transition-colors"
                >
                  <span className="text-white text-sm font-medium">{item.q}</span>
                  {activeIndex === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 text-white/70 text-sm leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
