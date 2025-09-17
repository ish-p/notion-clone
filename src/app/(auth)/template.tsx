"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

const variants = {
	hidden: { opacity: 0, x: -100 },
	enter: { opacity: 1, x: 0 },
	exit: { opacity: 0, x: 100 },
};

const PageTransitionEffect = ({ children }: { children: React.ReactNode }) => {
	const key = usePathname();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={key}
				initial="hidden"
				animate="enter"
				exit="exit"
				variants={variants}
				transition={{ ease: "linear", duration: 0.5, type: "tween" }}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};

export default PageTransitionEffect;
