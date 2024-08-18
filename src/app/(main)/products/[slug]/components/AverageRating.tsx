import { StarRating } from "./StarRating";

export function AverageRating({ reviews }: { reviews: { rating: number }[] }) {
	const rating = reviews?.length
		? reviews.reduce(
				(sum: number, { rating }: { rating: number }) => sum + rating / Math.ceil(rating / 5),
				0,
		  ) / reviews.length
		: 0;
	return (
		<div className="flex flex-wrap items-center gap-2">
			<StarRating rating={rating} readonly={true} />
			<span className="space-x-1 text-sm text-gray-600">
				<strong>{rating.toFixed(2)}</strong>
				<span>({reviews.length})</span>
			</span>
		</div>
	);
}
