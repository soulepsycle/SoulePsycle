import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import Link from "next/link";
import React from "react";
import OrderForm from "./components/order-form";
import { Toaster } from "react-hot-toast";

const Order = async ({
	params,
}: {
	params: {
		orderId: string;
	};
}) => {
	const orderId = params.orderId;

	const order = await prisma.order.findFirst({
		where: {
			id: orderId,
		},
    include: {
			address: true,
			order_item: {
				include: {
					variant_size: true,
					variant_color: {
						include: {
							product: {
								include: {
									category: true
								}
							}
						}
					}
				}
			},
			user: true
		}
	});

	if (!order) {
		return (
			<div>
				<h2>Order Item is not Found, please go back.</h2>
				<Button asChild>
					<Link href={"/admin/orders"}>Back</Link>
				</Button>
			</div>
		);
	}

	return (
   <>
	 <Toaster 
	 	toastOptions={{
			duration: 3000
		}}
	 />
	 	 <section className="admin-content">
			<div className="grid gap-4">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/admin/orders">
								Orders
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Order</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<h1>Update Order</h1>
			</div>

			<div className="content">
				<OrderForm order={order} orderId={orderId} />
			</div>
		</section>
	 </>
  );
};

export default Order;
