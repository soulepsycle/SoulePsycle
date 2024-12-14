import AdminNav from "@/components/admin/admin-nav";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await currentUser()

	if (user?.emailAddresses.map(e => e.emailAddress)[0] !== "soulepsycle1201@gmail.com") {
		redirect('sign-up')
	}

	return (
		<div className="flex gap-4">
			<AdminNav />
			<main className="flex-1 bg-background overflow-y-scroll">
				{children}
			</main>
		</div>
	);
}
