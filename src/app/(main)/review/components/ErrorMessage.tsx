import React from "react";

export function ErrorMessage({ error }: { error?: string | null }) {
	if (!error) return null;
	return <div className="pl-1 text-sm text-red-500">{error}</div>;
}
