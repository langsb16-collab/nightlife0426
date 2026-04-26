import { useState } from "react";
import { Map as MapIcon, X } from "lucide-react";
import Map from "./Map";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingMapProps {
  center: { lat: number; lng: number };
  markers: Array<{ id: string; lat: number; lng: number; title: string }>;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export default function FloatingMap({ center, markers, isOpen: externalIsOpen, onOpen, onClose }: FloatingMapProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const handleOpen = () => {
    if (onOpen) onOpen();
    else setInternalIsOpen(true);
  };
  
  const handleClose = () => {
    if (onClose) onClose();
    else setInternalIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpen}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#0B3D91] text-white rounded-full flex items-center justify-center shadow-2xl z-40 border border-white/10"
      >
        <MapIcon size={24} />
      </motion.button>

      {/* Map Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 md:p-12 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl h-[80vh] bg-[#0A0F1C] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl flex flex-col cursor-default"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0A0F1C]">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <MapIcon size={18} className="text-blue-500" />
                  위치 안내
                </h3>
                <button
                  onClick={handleClose}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all text-sm font-bold border border-white/10"
                >
                  <X size={18} />
                  <span>지도 닫기</span>
                </button>
              </div>

              <div className="flex-1 w-full h-full relative">
                <Map center={center} markers={markers} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
