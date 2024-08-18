"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function AlertSuccess({ message }: { message: string }) {
	const [show, setShow] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	if (!show || !message) return null;
	return (
		<div className="mx-auto mb-4 flex max-w-7xl justify-between gap-4 space-y-1 rounded-md border border-green-500 bg-green-100 p-2 px-4 text-green-600">
			<div className="flex flex-1 items-center gap-2">{message}</div>
			<X
				className="cursor-pointer"
				size={16}
				onClick={() => {
					setShow(false);
					router.push(pathname);
				}}
			/>
		</div>
	);
}
