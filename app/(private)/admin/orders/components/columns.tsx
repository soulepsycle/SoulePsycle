"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ORDER_STATUS } from "@prisma/client";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Order = {
	id: string;
	customer_name: string;
	total_price: number;
	status: ORDER_STATUS;
	total_items: number;
};

export const columns: ColumnDef<Order>[] = [
	{
		accessorKey: "customer_name",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Customer Name" />;
		},
	},
	{
		accessorKey: "total_price",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Total Price" />;
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Status" />;
		},
	},
	{
		accessorKey: "total_items",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Total Items" />;
		},
	},
	{
		accessorKey: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const orderId = row.original.id;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem asChild>
							<Button type="button" asChild>
								<Link
									href={`/admin/orders/${orderId}/edit`}
								>
									View
								</Link>
							</Button>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
