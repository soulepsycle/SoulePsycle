import prisma from "@/lib/db";
import { columns, Order } from "./components/columns";
import { DataTable } from "./components/data-table";

async function getData(): Promise<Order[]> {
	const order = await prisma.order.findMany({
		include: {
			address: true,
			user: true,
			order_item: true
		}
	})

	return order.map((o => ({
		id: o.id,
		customer_name: `${o.user.first_name} ${o.user.last_name}`,
		total_price: o.total_price,
		status: o.status,
		total_items: o.order_item.map(oi => oi).length
	})))
}

export default async function Orders() {

	const orders = await getData();

	return (
		<section className="admin-content">
			<h1>Orders</h1>

			<div className="content">
				<DataTable columns={columns} data={orders} />
			</div>
		</section>
	);
}
