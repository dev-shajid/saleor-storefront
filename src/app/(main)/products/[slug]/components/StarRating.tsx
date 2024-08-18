"use client";

import React, { useState } from "react";

export function StarRating({
	rating = 0,
	setRating,
	readonly,
	className = "",
}: {
	rating?: number;
	readonly?: boolean;
	setRating?: (value: number) => void;
	className?: string;
}) {
	const [tempRating, setTempRating] = useState<number>(rating);

	function handleRating(value: number) {
		if (readonly) return;
		if (setRating) {
			setRating(value);
		}
		setTempRating(value);
	}

	function onHoverIn(value: number) {
		if (readonly) return;
		setTempRating(value);
	}

	function onHoverOut(value: number) {
		if (readonly) return;
		setTempRating(value);
	}

	const handleMouseMove = (e: React.MouseEvent, i: number) => {
		if (readonly) return;
		const { left, width } = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - left;
		const hoverValue = i + (Math.round(x / width) < 0.5 ? 0.5 : 1);
		setTempRating(hoverValue);
	};

	return (
		<div className="flex">
			{/* Make a fraction fill star rating component of 3.5 rating */}

			{Array.from({ length: 5 }, (_, i) => {
				const fillPercentage = Math.min(Math.max(tempRating - i, 0), 1) * 100;

				const gradientId = `grad-${Math.random()}-${i}`;

				return (
					<span
						key={gradientId}
						onClick={() => handleRating(tempRating)}
						onMouseMove={(e) => handleMouseMove(e, i)}
						onMouseEnter={() => onHoverIn(i + 1)}
						onMouseLeave={() => onHoverOut(rating)}
						className="relative"
					>
						<svg
							key={i}
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							className={`aspect-square w-8 cursor-pointer ${className}`}
							xmlns="http://www.w3.org/2000/svg"
						>
							<defs>
								<linearGradient id={gradientId}>
									<stop offset={`${fillPercentage}%`} stopColor="#FFD700" />
									<stop offset={`${fillPercentage}%`} stopColor="#E0E0E0" />
								</linearGradient>
							</defs>
							<path
								fill={`url(#${gradientId})`}
								d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.45 13.97L5.82 21L12 17.27Z"
							/>
						</svg>
					</span>
				);
			})}
		</div>
	);
}
