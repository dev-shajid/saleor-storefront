"use server";

import { SubmitProductReviewDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

type SubmitReviewArgs = {
	rating: number;
	title: string;
	review: string;
	user: string;
	product: string;
};

type MediaArgs = {
	image?: FormData | undefined;
	mediaUrl?: string[] | undefined;
};

export const SubmitProductReview = async (
	{ rating, title, review, user, product }: SubmitReviewArgs,
	{ image, mediaUrl }: MediaArgs,
) => {
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

		console.log({ image, mediaUrl });
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

/*




export const CreateReviewMedia = async (review: string, { image, mediaUrl }: MediaArgs) => {
	try {
		// Get Image Files from FormData
		const files = image?.getAll("image");

		if (files?.length) {
			for (const file of files as File[]) {
				try {
					await uploadFileWithReviewId(review, file);
					// console.log(imageFileRes?.data?.createReviewMedia);
				} catch (error) {
					console.error('Error uploading file:', file, error);
				}
			}
		}



		if (mediaUrl?.length) {
			for (const url of mediaUrl) {
				console.log("Url", url);
				await executeGraphQL(CreateReviewMediaMutation, {
					variables: {
						review,
						mediaUrl: url,
					},
					cache: "no-cache",
				});
			}
		}
	} catch (error) {
		console.log("Error submitting review media", error);
		return JSON.parse(JSON.stringify(error));
	}
};


const uploadFileWithReviewId = async (reviewId: string, file: File) => {
	// Define the mutation
	const mutation = `
        mutation createReviewMedia($review: ID!, $image: Upload, $alt: String) {
            createReviewMedia(input: {
                review: $review,
                image: $image,
                alt: $alt
            }) {
                review {
                    media {
                        url
                        alt
                    }
                }
                errors {
                    code
                    field
                }
            }
        }
    `;

	// Define the variables
	const variables = {
		review: reviewId,
		alt: '',  // Or any other alt text you want to use
	};

	// Prepare the multipart request body
	const operations = {
		query: mutation,
		variables: variables
	};

	const map = {
		"0": ["variables.image"]
	};

	const formData = new FormData();
	formData.append("operations", JSON.stringify(operations));
	formData.append("map", JSON.stringify(map));
	formData.append("0", file);  // Add the file to the request

	// Send the request
	const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL!, {
		method: 'POST',
		body: formData
	});

	const result = await response.json();
	return result;
};
*/
