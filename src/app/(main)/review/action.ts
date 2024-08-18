// "use server";

import { CreateReviewMediaDocument, SubmitProductReviewDocument } from "@/gql/graphql";
import { executeGraphQL, executeMultipartGraphQL } from "@/lib/graphql";

type SubmitReviewArgs = {
	rating: number;
	title: string;
	review: string;
	user: string;
	product: string;
};

type MediaArgs = {
	image?: File[] | undefined;
	mediaUrl?: string[] | undefined;
};

export const SubmitProductReview = async ({ rating, title, review, user, product }: SubmitReviewArgs) => {
	try {
		const { submitProductReview } = await executeGraphQL(SubmitProductReviewDocument, {
			variables: {
				input: {
					rating,
					title,
					review,
					user: user || "VXNlcjox",
					product,
				},
			},
			cache: "no-cache",
		});

		console.log("Review Response", submitProductReview);

		if (submitProductReview?.errors.length) {
			// Handle GraphQL errors
			console.error("GraphQL errors:", submitProductReview?.errors);
			return {
				success: false,
				review: null,
				errors: submitProductReview.errors.map((e) => ({ message: e.message! })).filter((e) => e.message),
			};
		}

		// if (res?.submitProductReview?.review) {
		//   await CreateReviewMedia(res.submitProductReview.review.id!, { image, mediaUrl });
		// }

		return { success: true, review: submitProductReview?.review, errors: [] };
	} catch (error) {
		// Handle unexpected errors
		let errorMessage = "An unexpected error occurred";

		if (error instanceof Error) {
			errorMessage = error.message || errorMessage;
		} else if (typeof error === "string") {
			errorMessage = error;
		} else {
			console.error("Unknown error type:", error);
		}

		console.error("Error submitting review:", JSON.parse(JSON.stringify(error)));
		return { success: false, review: null, errors: formatGraphQLErrors([{ message: errorMessage }]) };
	}
};

// Utility function to format GraphQL errors
const formatGraphQLErrors = (errors: { message: string }[]): { message: string }[] => {
	return errors.map((error) => {
		let errorMessage = "An unknown error occurred";

		if (typeof error.message === "string") {
			// Extract detailed error messages
			const message = error.message;
			const match = message.match(/In field "(\w+)": Expected "(\w+)", found (\w+)/);

			if (match) {
				const [, field, expectedType, foundValue] = match;
				if (field === "user") {
					errorMessage = `The user field is required and cannot be null. Expected ${expectedType} but received ${foundValue}.`;
				} else {
					errorMessage = `Error in field "${field}": Expected ${expectedType}, but received ${foundValue}.`;
				}
			} else {
				errorMessage = message;
			}
		}

		return { message: errorMessage };
	});
};

export const CreateReviewMedia = async (review: string, { image, mediaUrl }: MediaArgs) => {
	try {
		const response: string[] = [];

		if (image?.length) {
			for (const file of image) {
				try {
					const { createReviewMedia } = await executeMultipartGraphQL(CreateReviewMediaDocument, {
						variables: {
							input: {
								review,
								image: file,
							},
						},
						file: file,
					});

					if (createReviewMedia?.errors.length)
						return {
							success: true,
							media: [] as string[],
							errors: createReviewMedia?.errors.map((e) => ({
								message: e.message ?? "An unkonwn error occured",
							})),
						};
					response.push(createReviewMedia?.media?.url ?? "");
				} catch (error) {
					console.error("Error uploading file:", file, error);
				}
			}
		}
		if (mediaUrl?.length) {
			for (const url of mediaUrl) {
				try {
					const { createReviewMedia } = await executeGraphQL(CreateReviewMediaDocument, {
						variables: {
							input: {
								review,
								mediaUrl: url,
							},
						},
						cache: "no-cache",
					});

					if (createReviewMedia?.errors.length)
						return {
							success: true,
							media: [] as string[],
							errors: createReviewMedia?.errors.map((e) => ({ message: e.message! })),
						};
					if (createReviewMedia?.media?.url) response.push(createReviewMedia?.media?.url);
				} catch (error) {
					console.error("Error uploading file by url:", url, error);
				}
			}
		}

		return { success: true, media: response, errors: [] };
	} catch (error) {
		console.error("Error submitting review media:", JSON.parse(JSON.stringify(error)));
		let errorMessage = "An unexpected error occurred";

		if (error instanceof Error) {
			errorMessage = error.message || errorMessage;
		} else if (typeof error === "string") {
			errorMessage = error;
		} else {
			console.error("Unknown error type:", error);
		}

		return {
			success: false,
			media: [] as string[],
			errors: formatGraphQLErrors([{ message: errorMessage }]),
		};
	}
};
