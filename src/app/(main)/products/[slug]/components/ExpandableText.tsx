"use client";

import React, { useState } from "react";

interface ExpandableTextProps {
	text: string;
	maxLength?: number; // Optional: default length to display before truncating
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLength = 100 }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpansion = () => {
		setIsExpanded(!isExpanded);
	};

	// Determine if the text is longer than the max length
	const isLongText = text.length > maxLength;

	// Show either the truncated text or the full text based on the `isExpanded` state
	const displayedText = isExpanded || !isLongText ? text : text.slice(0, maxLength) + "...";

	return (
		<div>
			<span>{displayedText}</span>
			{isLongText && (
				<span onClick={toggleExpansion} className="cursor-pointer text-blue-500 underline">
					{isExpanded ? "See Less" : "See More"}
				</span>
			)}
		</div>
	);
};
