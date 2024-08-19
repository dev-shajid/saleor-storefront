"use server";

import { cookies } from "next/headers";

export async function setRefreshToken(token: string) {
	cookies().set("refreshToken", token);
}

export async function getRefreshToken(): Promise<string> {
	return cookies().get("refreshToken")?.value ?? "";
}
