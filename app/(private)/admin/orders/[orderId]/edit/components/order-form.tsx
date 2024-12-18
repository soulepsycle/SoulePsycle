"use client";

import {
	ORDER_STATUS,
	orderUpdateFormSchema,
	TOrderUpdateFormValues,
} from "@/lib/schemas/orderSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import axios from "axios";
import React from "react";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CldImage } from "next-cloudinary";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const fallBackImage = "https://via.placeholder.com/800";

const OrderForm = ({
	order,
	orderId,
}: {
	order: Prisma.orderGetPayload<{
		include: {
			address: true;
			order_item: {
				include: {
					variant_size: true;
					variant_color: {
						include: {
							product: {
								include: {
									category: true;
								};
							};
						};
					};
				};
			};
			user: true;
		};
	}>;
	orderId: string;
}) => {
	const router = useRouter();

	const form = useForm<TOrderUpdateFormValues>({
		resolver: zodResolver(orderUpdateFormSchema),
		defaultValues: {
			status: order.status as ORDER_STATUS,
			tracking_number: order.tracking_number as string,
		},
	});

	const watchedTrackingNumber = useWatch({
		control: form.control,
		name: 'tracking_number'
	})

	const onSubmit: SubmitHandler<TOrderUpdateFormValues> = async (
		values: TOrderUpdateFormValues
	) => {
		const response = await axios.patch(
			`/api/admin/orders/${orderId}`,
			values
		);

		if (response.status === 201) {
			toast.success("Successfull Updated Order.");

			setTimeout(() => {
				router.refresh();
				router.push("/admin/orders");
			}, 3000);
		} else if (response.status === 404) {
			toast.error("Out of stock! Check the invetory for the stock");
		} else {
			toast.error("Please try again.");
		}

		const resendData = {
			email: order.user.email,
			firstName: order.user.first_name || "Unknown",
			orderId: order.id,
			trackingNumber: watchedTrackingNumber,
			orderStatus: "PROCESSING",
		};
		await axios.post("/api/send", resendData);
	};

	const isLoading = form.formState.isLoading || form.formState.isSubmitting;

	const onError = (errors: FieldErrors<TOrderUpdateFormValues>): void => {
		console.log("Error submitting form", errors);
		toast.error("Please try again.");
	};

	const customerFirstName = order.user.first_name;
	const customerLastName = order.user.last_name;
	const customerName = `${customerFirstName} ${customerLastName}`;

	const houseNumber = order.address.house_number;
	const street = order.address.street;
	const barangay = order.address.barangay;
	const municipality = order.address.municipality;
	const province = order.address.province;
	const zip_code = order.address.zip_code;
	const shippingAddress = `${houseNumber} ${street} St. Brgy. ${barangay} ${municipality}, ${province} ${zip_code}`;
	const paymentMethod = order.payment_method;
	const proofOfPayments = order.proof_of_payment;

	return (
		<Card>
			<CardContent className="p-6">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit, onError)}
						className="grid grid-cols-1 lg:grid-cols-2 gap-12"
					>
						<div className="order-items grid gap-6">
							{order.order_item.map((oi) => {
								const { id } = oi;

								const firstImage = oi.variant_color?.images[0];
								const productName =
									oi.variant_color?.product.name;
								const price = oi.price;
								const quantity = oi.quantity;
								const orderItemTotal = price * quantity;
								const category =
									oi.variant_color?.product.category.name;

								const productColor = oi.variant_color?.color;
								const productSize = oi.variant_size.size;

								return (
									<div
										key={id}
										className="shadow-xl rounded-md flex gap-6 p-4"
									>
										{/* image, price, quantity, total price */}
										<div className="relative h-32 aspect-square">
											<CldImage
												src={
													firstImage || fallBackImage
												}
												fill
												className="object-contain"
												alt="first-image"
											/>
										</div>

										<div className="space-y-3">
											<h2>{productName}</h2>
											<Badge>{category}</Badge>
											<p>
												{productColor}{" "}
												{productSize && (
													<>| {productSize}</>
												)}
											</p>
											<p>
												₱{price} x {quantity} = ₱
												{orderItemTotal}
											</p>
										</div>
									</div>
								);
							})}
						</div>

						<div className="space-y-4">
							<div>
								<FormLabel>Customer Name</FormLabel>
								<Input defaultValue={customerName} readOnly />
							</div>

							<div>
								<FormLabel>Shipping Address</FormLabel>
								<Input
									defaultValue={shippingAddress}
									readOnly
								/>
							</div>

							<div>
								<FormLabel>Payment Method</FormLabel>
								<Input defaultValue={paymentMethod} readOnly />
							</div>

							<div>
								<FormLabel>Proof of Payment</FormLabel>
								{proofOfPayments.map((pop, i) => {
									return (
										<div
											key={pop + i}
											className="relative h-28 aspect-square"
										>
											<CldImage
												src={pop}
												alt={`${pop}+${i}`}
												className="object-contain"
												fill
											/>
										</div>
									);
								})}
							</div>

							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Order Status</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select order status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(
													ORDER_STATUS
												).map((os) => {
													return (
														<SelectItem
															key={os}
															value={os}
														>
															{os}
														</SelectItem>
													);
												})}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="tracking_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tracking Number</FormLabel>
										<FormControl>
											<Input
												placeholder="123-456-789"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Processing..." : "Process Order"}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
			<CardFooter>
				<div>
					{proofOfPayments.map((pop, i) => {
						return (
							<div
								key={pop + i}
								className="relative h-[80vh] aspect-square"
							>
								<CldImage
									src={pop}
									alt={`${pop}+${i}`}
									className="object-contain"
									fill
								/>
							</div>
						);
					})}
				</div>
			</CardFooter>
		</Card>
	);
};

export default OrderForm;
