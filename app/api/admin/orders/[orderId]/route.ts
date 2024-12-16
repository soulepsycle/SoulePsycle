import prisma from "@/lib/db";
import { orderUpdateFormSchema } from "@/lib/schemas/orderSchemas";
import { ORDER_STATUS } from "@prisma/client";

export const PATCH = async (req: Request, {params} : {
  params: {
    orderId: string;
  }
}) => {
  const orderIdParams = params.orderId
  const json = await req.json();

  const validatedData = orderUpdateFormSchema.safeParse(json);

  if (!validatedData.success) {
    return new Response(JSON.stringify({
      error: 'Error in API_ADMIN_ORDERS_[orderId]_PATCH',
      zod_error: validatedData.error.format()
    }), {
      status: 404
    })
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderIdParams
    }
  })

  if (!order) {
    return new Response(JSON.stringify({
      error: 'Error in API_ADMIN_ORDERS_[orderId]_PATCH: Order Not Found!'
    }), {
      status: 404
    })
  }

  const {status, tracking_number} = validatedData.data

  try {
    const updatedOrder = await prisma.$transaction(async (prisma) => {
      // 1. Update the Order status and tracking number
      const order = await prisma.order.update({
        where: { id: orderIdParams },
        data: {
          updated_at: new Date(),
          status: status as ORDER_STATUS,
          tracking_number: tracking_number as string,
        },
      });

      if (status === ORDER_STATUS.PROCESSING) {
        // 2. Fetch all Order Items
        const orderItems = await prisma.order_item.findMany({
          where: { order_id: orderIdParams },
          include: { variant_size: true }, // Include stock details if needed
        });

        // 3. Deduct stock for each item
        for (const item of orderItems) {
          const { variant_size_id, quantity } = item;

          // Validate stock availability
          const variantSize = await prisma.variant_size.findUnique({
            where: { id: variant_size_id! },
          });

          if (!variantSize || variantSize.stock < quantity) {
            return new Response(JSON.stringify(`Insufficient stock for variant ${variant_size_id}. Available: ${variantSize?.stock}, Required: ${quantity}`), { status: 404 });
            throw new Error(
              `Insufficient stock for variant ${variant_size_id}. Available: ${variantSize?.stock}, Required: ${quantity}`
            );
          }

          // Deduct stock
          await prisma.variant_size.update({
            where: { id: variant_size_id! },
            data: { stock: { decrement: quantity } },
          });
        }
      }

      return order;
    });

    return new Response(JSON.stringify(updatedOrder), { status: 201 });

  } catch (error) {
    console.log('Error in API_ADMIN_ORDERS_[orderId]_PATCH: ', error)
    return new Response(JSON.stringify({
      error: 'Error in API_ADMIN_ORDERS_[orderId]_PATCH: ' + error
    }), {
      status: 500 
    })
  }
}