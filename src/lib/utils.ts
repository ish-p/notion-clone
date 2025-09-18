import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateRandomName() {
	const adjectives = ["Mystic", "Ancient", "Whispering", "Silent", "Crimson"];
	const nouns = ["Forest", "River", "Mountain", "Dragon", "Shadow"];

	const randomAdjective =
		adjectives[Math.floor(Math.random() * adjectives.length)];
	const randomNoun1 = nouns[Math.floor(Math.random() * nouns.length)];
	const randomNoun2 = nouns[Math.floor(Math.random() * nouns.length)];

	return `${randomAdjective}${randomNoun1}${randomNoun2}`;
}
