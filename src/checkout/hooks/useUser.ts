import { useTokenRefreshMutation, useUserQuery } from "@/checkout/graphql";

export const useUser = () => {
	const [{ data, fetching: loading, stale }] = useUserQuery();
	const [tokenData, tokenMutation] = useTokenRefreshMutation();

	//FIXME: This is a hack to get the refresh token from local storage and get user data by token, as we are not getting user data from useUserQuery due to cookie issue

	const refresh_token: string =
		globalThis?.localStorage?.getItem(
			process.env.NEXT_PUBLIC_SALEOR_API_URL! + "+saleor_auth_module_refresh_token",
		) ?? "";
	const user = data?.user;

	const authenticated = !!user;

	return {
		user,
		loading: loading || stale || tokenData.fetching || tokenData.stale,
		authenticated,
		tokenData: tokenData.data?.tokenRefresh,
		tokenRefresh: async () => tokenMutation({ refreshToken: refresh_token }),
	};
};
