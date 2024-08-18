"use client";

import { X } from "lucide-react";
import React, { useState } from "react";

export function AlertSuccess({ message }: { message: string }) {
	const [show, setShow] = useState(true);

	if (!show || !message) return null;
	return (
		<div className="mx-1 mb-4 flex justify-between gap-4 space-y-1 rounded-md border border-green-500 bg-green-100 p-2 px-4 text-green-600 sm:mx-4">
			<div className="flex flex-1 items-center gap-2">{message}</div>
			<X className="cursor-pointer" size={16} onClick={() => setShow(false)} />
		</div>
	);
}
