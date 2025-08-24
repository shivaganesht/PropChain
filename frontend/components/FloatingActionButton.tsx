'use client';

import { useState, useEffect } from 'react';
import { Plus, Home, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {isConnected && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap text-gray-900">
                  List Property
                </span>
                <Link
                  href="/dashboard"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="h-5 w-5" />
                </Link>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <span className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap text-gray-900">
                Browse Properties
              </span>
              <Link
                href="/marketplace"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                onClick={() => setIsOpen(false)}
              >
                <Home className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen 
            ? 'bg-gradient-to-r from-red-500 to-pink-600' 
            : 'bg-gradient-to-r from-purple-600 to-indigo-600'
        } text-white p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
}
