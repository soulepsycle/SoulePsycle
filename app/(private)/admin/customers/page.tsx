import prisma from "@/lib/db";
import { columns, Customer } from "./components/columns";
import { DataTable } from "./components/data-table";

async function getData(): Promise<Customer[]> {
	const customers = await prisma.user.findMany({

	})

	return customers.map((c) => ({
		id: c.id,
		first_name: c.first_name!,
		last_name: c.last_name!,
		email: c.email
	}))
}

export default async function Customers() {
	const data = await getData();

	return (
		<section className="admin-content">
			<h1>Customers</h1>

			<div className="content">
				<DataTable columns={columns} data={data} />
			</div>
		</section>
	);
}
