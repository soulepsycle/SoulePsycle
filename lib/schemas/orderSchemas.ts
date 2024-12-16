import { z } from "zod";

export enum ORDER_STATUS {
	PENDING = "PENDING",
	PROCESSING = "PROCESSING",
	SHIPPED = "SHIPPED",
	COMPLETED = "COMPLETED",
	CANCELLED = "CANCELLED",
}

export const orderFormSchema = z.object({
	id: z.string().uuid().optional(),
	user_id: z.string().uuid(),
	payment_method: z.string().min(1, "required payment method"),
	proof_of_payment: z.array(z.string()).min(1, 'receipt is required'),
	tracking_number: z.string().min(1, 'required tracking number').nullable().optional(),
	landmark: z.string().min(1, "required landmark").optional(),
	address_id: z.string().uuid(),
});

export type TOrderFormValues = z.infer<typeof orderFormSchema>;

export const orderUpdateFormSchema = z.object({
	tracking_number: z.string().min(1, 'tracking number is required'),
	status: z.nativeEnum(ORDER_STATUS)
})

export type TOrderUpdateFormValues = z.infer<typeof orderUpdateFormSchema>;