"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const transition = { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] };
const variants = {
    hidden: { filter: "blur(10px)", transform: "translateY(20%)", opacity: 0 },
    visible: { filter: "blur(0)", transform: "translateY(0)", opacity: 1 },
};

const texts = [
    "Structuring your lesson...", // Initial state
    "Crafting learning objectives...",
    "Designing sequential activities...",
    "Formulating assessment questions...",
    "Finalizing your document...",
];

export default function BlurReveal({ isLoading }) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    useEffect(() => {
        if (!isLoading) {
            setCurrentTextIndex(0); // Reset when not loading
            return;
        }

        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }, 2500); // Change text every 2.5 seconds

        return () => clearInterval(interval);
    }, [isLoading]);

    if (!isLoading) return null;

    const words = texts[currentTextIndex].split(" ");

    return (
        <div className="flex flex-col items-center justify-center py-10 min-h-[300px]">
            <motion.div
                key={currentTextIndex} // Key change triggers re-animation
                initial="hidden"
                whileInView="visible"
                exit="hidden"
                transition={{ staggerChildren: 0.04 }}
                className="text-center"
            >
                <h1 className="mb-6 text-3xl font-bold leading-relaxed text-slate-800 dark:text-slate-100 md:text-4xl">
                    {words.map((word, index) => (
                        <React.Fragment key={index}>
                            <motion.span
                                className="inline-block"
                                transition={transition}
                                variants={variants}
                            >
                                {word}
                            </motion.span>
                            {index < words.length - 1 && " "}
                        </React.Fragment>
                    ))}
                </h1>
                <motion.p
                    key={`desc-${currentTextIndex}`} // Unique key for p as well if we wanted to animate it differently
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mb-8 text-lg text-slate-500 dark:text-slate-400"
                >
                    AI is generating a comprehensive plan for you.
                </motion.p>
            </motion.div>

            {/* Optional: Subtle loader to show ongoing activity underneath the text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4"
            >
                <div className="w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-cyan-500"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
