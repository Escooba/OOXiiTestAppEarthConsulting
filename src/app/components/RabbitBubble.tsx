import React from 'react';
import { motion } from 'motion/react';
import { RabbitMascot } from './RabbitMascot';

interface Props {
  text: string;
  type?: 'default' | 'error' | 'success';
}

export function RabbitBubble({ text, type = 'default' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-3 mb-4 ml-2"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        className="bg-[#2A0730] p-2 rounded-full shadow-[0_4px_15px_rgba(0,209,193,0.3)] relative z-10 shrink-0 border-2 border-[#A984FF] flex items-center justify-center"
      >
        <RabbitMascot size={22} />
      </motion.div>
      <div
        className={`px-4 py-2.5 rounded-2xl rounded-bl-sm text-[13px] font-medium shadow-lg max-w-[280px] leading-snug ${
          type === 'error'
            ? 'bg-[#FF5C5C] text-white'
            : type === 'success'
            ? 'bg-[#A984FF] text-[#2A0730]'
            : 'bg-white text-[#2A0730]'
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
}
