"use client";
/* eslint-disable import/order */
import React, { useState, useTransition } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { redirect } from "next/navigation";
import { useUser } from "@/checkout/hooks/useUser";
import { MediaInput, type MediaItem } from "../../products/[slug]/components/MediaInput";
// import { SubmitProductReview } from '../actions';
import { ErrorMessage } from "./ErrorMessage";
import { ApiResponseErrors } from "./ApiResponseErrors";
import { Loader } from "lucide-react";

type Props = {
	searchParams: {
		product: string;
		slug: string;
		variant?: string;
	};
};

type FormValues = {
	title: string;
	rating: string;
	review: string;
};

const SignupSchema = Yup.object().shape({
	title: Yup.string().trim().min(3, "Too Short!").max(50, "Too Long!").required("Required Field"),
	rating: Yup.number()
		.min(1, "Min Rating is 1")
		.max(5, "Max Rating is 5")
		.required("Required Field")
		.integer("Rating should be integer")
		.typeError("Rating should be a number"),
	review: Yup.string().trim().min(5, "Too Short!").max(250, "Too Long!").required("Required Field"),
});

export function ReviewForm({ searchParams }: Props) {
	const { product, slug, variant } = searchParams;
	const [isPending, startTransition] = useTransition();
	const [errors, setErrors] = useState<{ message: string }[] | null>(null);
	const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
	const { user, loading } = useUser();

	console.log({ user, setErrors, startTransition });

	let redirectUrl = `/products/${slug}?success=true&message=Review Submitted Successfully!`;
	console.log(redirectUrl);
	if (variant) redirectUrl += `&variant=${variant}`;

	if (!product || !slug) {
		redirect("/404");
	}

	if (isPending || loading) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center">
				<Loader />
			</div>
		);
	}

	return (
		<section className="mx-auto flex w-full items-center justify-center py-8">
			<div className="mx-auto w-full max-w-lg rounded-md border border-gray-200 bg-gray-100 p-4">
				<div className="mb-6 text-center text-lg font-medium">Create New Review</div>

				<Formik<FormValues>
					initialValues={{
						title: "Test Title",
						rating: "4",
						review: "Test Description",
					}}
					validationSchema={SignupSchema}
					onSubmit={(values) => {
						if (loading) return;
						alert(JSON.stringify(values));
						// const formData = new FormData();
						// startTransition(async () => {
						//   mediaItems.filter((e) => e.type === 'file' && e.file).forEach((e) => {
						//     formData.append('image', e.file!);
						//   });

						//   const mediaData = { mediaUrl: mediaItems.filter((e) => e.type === 'url').map((e) => e.url!), image: formData };
						//   const reviewData = { ...values, rating: Number(values.rating), product, user: user?.id! };

						//   const res: any = await SubmitProductReview(reviewData, mediaData);
						//   if (res && res?.review?.id) redirect(redirectUrl);
						//   setErrors(res?.errors);
						// });
					}}
				>
					{({ errors, touched }) => (
						<Form className="space-y-4">
							<div className="mb-5">
								<label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-900">
									Title<sup className="text-red-500">*</sup>
								</label>
								<Field
									className={`border bg-gray-50 ${
										touched.title && errors.title ? "border-red-500" : "border-gray-300"
									} block w-full rounded-lg p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500`}
									name="title"
									id="title"
									placeholder="Enter Review Title"
								/>
								{touched.title ? <ErrorMessage error={errors.title} /> : null}
							</div>
							<div className="mb-5">
								<label htmlFor="rating" className="mb-2 block text-sm font-medium text-gray-900">
									Rating<sup className="text-red-500">*</sup>
								</label>
								<Field
									className={`border bg-gray-50 ${
										touched.rating && errors.rating ? "border-red-500" : "border-gray-300"
									} block w-full rounded-lg p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500`}
									name="rating"
									id="rating"
									placeholder="Enter Rating"
								/>
								{touched.rating ? <ErrorMessage error={errors.rating} /> : null}
							</div>
							<div className="mb-5">
								<label htmlFor="review" className="mb-2 block text-sm font-medium text-gray-900">
									Description<sup className="text-red-500">*</sup>
								</label>
								<Field
									className={`border bg-gray-50 ${
										touched.review && errors.review ? "border-red-500" : "border-gray-300"
									} block w-full rounded-lg p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500`}
									name="review"
									id="review"
									placeholder="Enter Review Description"
								/>
								{touched.review ? <ErrorMessage error={errors.review} /> : null}
							</div>

							<MediaInput mediaItems={mediaItems} setMediaItems={setMediaItems} />

							<input
								type="submit"
								value="Submit"
								className="block w-full cursor-pointer rounded-md border border-blue-700 bg-blue-500 px-4 py-1.5 text-center font-medium text-white"
							/>
						</Form>
					)}
				</Formik>
				<ApiResponseErrors errors={errors} />
			</div>
		</section>
	);
}
