import { notFound } from "next/navigation";
import { ReviewForm } from "../components/ReviewForm";
import { executeGraphQL } from "@/lib/graphql";
import { ProductDetailsDocument } from "@/gql/graphql";

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

	if (!product || searchParams.product != product.id) {
		notFound();
	}
	return (
		<>
			<ReviewForm searchParams={searchParams} />
		</>
	);
}
