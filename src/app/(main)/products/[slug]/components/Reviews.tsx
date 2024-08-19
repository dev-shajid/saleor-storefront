/* eslint-disable import/order */
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { AverageRating } from "./AverageRating";
import { StarRating } from "./StarRating";
import { ExpandableText } from "./ExpandableText";
import { formatDate } from "@/lib/date";
import { ReviewMediaType, type GetProductReviewsQuery } from "@/gql/graphql";

interface ReviewsProps {
	reviews: GetProductReviewsQuery["getProductReview"];
	productId: string;
	slug: string;
	variant?: string;
}

export function Reviews({ reviews, productId, slug, variant }: ReviewsProps) {
	let createReviewUrl = `/review/create?product=${productId}&slug=${slug}`;
	if (variant) createReviewUrl += `&variant=${variant}`;

	function textSlice(text: string, length: number = 20) {
		return text.length > length ? text.slice(0, length) + "..." : text;
	}

	// console.log(reviews);

	return (
		<div className="mt-12 bg-gray-100">
			<div className="flex justify-between gap-4 p-4">
				<div className="space-y-2">
					<div className="text-xl font-semibold">Product Review</div>
					{reviews && reviews?.length ? (
						<div>
							<AverageRating reviews={reviews.map((e) => ({ rating: e?.rating || 0 }))} />
						</div>
					) : null}
				</div>
				<div>
					<Link
						className="rounded-md border border-gray-500 px-4 py-1.5 text-xs text-gray-500"
						href={createReviewUrl}
					>
						Create Review
					</Link>
				</div>
			</div>
			<hr />
			<div className="flex flex-col space-y-3">
				{reviews && reviews?.length ? (
					<>
						{reviews.map((review) => {
							if (!review) return null;
							const label =
								review?.user?.firstName && review?.user?.lastName
									? `${review?.user?.firstName.slice(0, 1)}${review?.user?.lastName.slice(0, 1)}`
									: review?.user?.email.slice(0, 2);
							return (
								<div key={review.id} className="flex flex-col space-y-1 p-4">
									<div className="flex items-center gap-2">
										<span
											className={`flex !aspect-square h-10 w-10 items-center justify-center rounded-full border bg-white text-center text-xs font-bold uppercase`}
											aria-hidden="true"
										>
											{label}
										</span>
										<div>
											<div className="text-sm text-slate-500">
												{review?.user?.firstName} {review?.user?.lastName}
											</div>
											<dd className="text-xs text-neutral-500">
												<time dateTime={review.createdAt.toString()}>
													{formatDate(new Date(review.createdAt))}
												</time>
											</dd>
										</div>
									</div>
									<div className="flex cursor-default items-center gap-1">
										<StarRating readonly className="!w-4" rating={review.rating} />
										<span className="text-xs text-gray-500">
											{(review.rating / Math.ceil(review.rating / 5)).toFixed(2)}
										</span>
									</div>
									<div className="text-base font-medium">{review.title}</div>
									<div className="text-sm">
										<ExpandableText text={review.review} />
									</div>
									<div
										className="grid gap-4"
										style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 120px))" }}
									>
										{review?.media
											? review?.media.map((media, index) => (
													<React.Fragment key={index}>
														{media.type === ReviewMediaType.Image ? (
															<a
																target="_blank"
																href={media.url}
																className="max-w-full rounded-md border border-gray-300 bg-gray-200"
															>
																<Image
																	src={media.url}
																	alt={media.alt}
																	width={100}
																	height={100}
																	className="aspect-square h-full w-full rounded-md object-contain"
																/>
															</a>
														) : media.type === ReviewMediaType.Video ? (
															<a
																href={media.url}
																target="_blank"
																className="flex aspect-square max-w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border border-gray-400 bg-gray-300 text-center text-xs"
															>
																<PlayCircle size={24} className="text-gray-500" />
																<p>{textSlice(media.alt)}</p>
															</a>
														) : null}
													</React.Fragment>
											  ))
											: null}
									</div>
								</div>
							);
						})}
					</>
				) : (
					<div className="py-12 text-center text-base font-light text-gray-500">No reviews</div>
				)}
			</div>
		</div>
	);
}
