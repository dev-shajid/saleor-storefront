import React from "react";
import { InfoIcon } from "lucide-react";

export function ApiResponseErrors({ errors }: { errors: { message: string }[] | null }) {
	if (!errors || !errors.length) return null;
	return (
		<div className="mt-4 space-y-1 rounded-md border border-red-500 bg-red-100 p-4 text-red-600">
			{errors.map((error, index) => (
				<div key={index} className="flex items-center gap-2">
					<InfoIcon size={20} />
					{error.message}
				</div>
			))}
		</div>
	);
}
