"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const Photo = () => {
  return (
    <div className="w-full h-full relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: 2, duration: 0.4, ease: "easeIn" },
        }}
      >
        {/* image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 1.4, duration: 0.4, ease: "easeInOut" },
          }}
          className="w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] mix-blend-lighten absolute"
        >
          <Image
            src="/assets/photo.png"
            priority
            quality={100}
            fill
            sizes="(max-width: 1280px) 298px, 498px"
            alt=""
            className="object-contain"
          />
        </motion.div>

        {/* circle */}
        <motion.svg
          className="w-[300px] xl:w-[506px] h-[300px] xl:h-[506px]"
          fill="transparant"
          viewBox="0 0 506 506"
          xmlns="http://www.w3.org/2000/svg"
        >
          <svg width="506" height="506">
            <defs>
              <linearGradient
                id="threeColorGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="50%" stopColor="#000000" />
                <stop offset="100%" stopColor="#00ffff" />
              </linearGradient>
            </defs>

            <motion.circle
              cx="253"
              cy="253"
              r="250"
              stroke="url(#threeColorGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ strokeDasharray: "24 10 0 0" }}
              animate={{
                strokeDasharray: ["15 120 25 25", "16 25 92 72", "4 250 22 22"],
                rotate: [120, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </svg>
        </motion.svg>
      </motion.div>
    </div>
  );
};

export default Photo;
