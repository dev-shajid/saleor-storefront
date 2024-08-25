import { notFound } from "next/navigation";
import { getRefreshToken } from "../../action";
import { ReviewForm } from "../components/ReviewForm";
import { executeGraphQL } from "@/lib/graphql";
import { ProductDetailsDocument, TokenRefreshDocument } from "@/gql/graphql";

type Props = {
	searchParams: {
		product: string;
		slug: string;
		variant?: string;
	};
};

export default async function Page({ searchParams }: Props) {
	if (!searchParams.product || !searchParams.slug) {
		notFound();
	}

	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(searchParams.slug),
		},
		revalidate: 60,
	});
	const { tokenRefresh } = await executeGraphQL(TokenRefreshDocument, {
		variables: {
			refreshToken: await getRefreshToken(),
		},
		revalidate: 60,
	});

	// console.log({tokenRefresh: tokenRefresh})

	if (!product || searchParams.product != product.id || !tokenRefresh?.user) {
		notFound();
	}
	return (
		<>
			<ReviewForm searchParams={searchParams} tokenRefresh={tokenRefresh} />
		</>
	);
}
