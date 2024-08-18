import { PlayCircleIcon, X } from "lucide-react";
import React, { useState, type ChangeEvent } from "react";
import Image from "next/image";

export type MediaItem = {
	file?: File;
	url?: string;
	type: "file" | "url";
	mediaType: "image" | "video";
};

const isYouTubeUrl = (url: string): boolean => {
	const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/;
	return youtubePattern.test(url);
};

type Props = {
	mediaItems: MediaItem[];
	setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
};

export const MediaInput: React.FC<Props> = ({ mediaItems, setMediaItems }) => {
	const [inputType, setInputType] = useState<"file" | "url">("file");
	const [urlInput, setUrlInput] = useState<string>("");
	const [error, setError] = useState<string>("");

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (mediaItems.length >= 5) return;

		if (inputType === "file" && e.target.files) {
			const files = Array.from(e.target.files);
			const newItems: MediaItem[] = files.map((file) => ({
				file,
				type: "file",
				mediaType: "image",
			}));
			setMediaItems((prev) => [...prev, ...newItems].slice(0, 5));
		} else if (inputType === "url") {
			setUrlInput(e.target.value.trim());
		}
	};

	const fetchMediaType = async (url: string): Promise<"image" | "video" | "unknown"> => {
		if (isYouTubeUrl(url)) {
			return "video";
		}

		try {
			const response = await fetch(url, { method: "HEAD" });
			const contentType = response.headers.get("Content-Type") || "";

			if (contentType.startsWith("image/")) return "image";
			if (contentType.startsWith("video/")) return "video";
			return "unknown";
		} catch (error) {
			console.error("Error fetching media type:", error);
			return "unknown";
		}
	};

	const handleUrlSubmit = async () => {
		if (urlInput && mediaItems.length < 5) {
			const mediaType = await fetchMediaType(urlInput);

			if (mediaType === "unknown") {
				setError("The URL is not a valid image or video.");
				return;
			}

			const newItem: MediaItem = {
				url: urlInput,
				type: "url",
				mediaType,
			};
			setMediaItems((prev) => [...prev, newItem].slice(0, 5));
			setUrlInput("");
			setError("");
		}
	};

	const handleRemoveItem = (index: number) => {
		setMediaItems((prev) => prev.filter((_, i) => i !== index));
	};

	const isLimitReached = mediaItems.length >= 5;

	return (
		<div className="pt-3">
			<div className="mb-4">
				<label className="mr-4">
					<input
						type="radio"
						value="file"
						checked={inputType === "file"}
						onChange={() => setInputType("file")}
						className="mr-1"
						disabled={isLimitReached}
					/>
					Upload File
				</label>
				<label>
					<input
						type="radio"
						value="url"
						checked={inputType === "url"}
						onChange={() => setInputType("url")}
						className="mr-1"
						disabled={isLimitReached}
					/>
					Enter Image URL
				</label>
			</div>

			{inputType === "file" ? (
				<input
					type="file"
					accept="image/*"
					multiple
					onChange={handleInputChange}
					className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-100"
					disabled={isLimitReached}
				/>
			) : (
				<div className="flex space-x-2">
					<input
						type="text"
						value={urlInput}
						onChange={handleInputChange}
						onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
						placeholder="Enter image or video URL"
						className="flex-grow rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
						disabled={isLimitReached}
					/>
					<button
						type="button"
						onClick={handleUrlSubmit}
						className={`rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none ${
							isLimitReached ? "cursor-not-allowed opacity-50" : ""
						}`}
						disabled={isLimitReached}
					>
						Add URL
					</button>
				</div>
			)}

			{error && <p className="mt-2 text-red-500">{error}</p>}

			<ul className="mt-4 space-y-2">
				{mediaItems.map((item, index) => (
					<li
						key={index}
						className="flex items-center justify-between rounded-lg border border-gray-300 bg-blue-50 p-2"
					>
						{item.mediaType === "image" && item.file ? (
							<Image
								src={URL.createObjectURL(item.file)}
								alt="Media"
								width={64}
								height={64}
								className="rounded-lg object-cover"
							/>
						) : item.mediaType === "image" && item.url ? (
							<Image src={item.url} alt="Media" width={64} height={64} className="rounded-lg object-cover" />
						) : item.mediaType === "video" && item.url ? (
							<div className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-400 bg-gray-200">
								<a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-500">
									<PlayCircleIcon size={24} />
								</a>
							</div>
						) : null}
						<button
							type="button"
							onClick={() => handleRemoveItem(index)}
							className="text-red-500 hover:text-red-700 focus:outline-none"
						>
							<X size={16} />
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};
