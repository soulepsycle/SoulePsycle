import * as React from "react";

interface OrderStatusEmailProps {
	firstName: string;
	orderId: string;
	trackingNumber: string;
	orderStatus: string;
}

export const OrderStatusEmail: React.FC<Readonly<OrderStatusEmailProps>> = ({
	firstName,
	orderId,
	trackingNumber,
	orderStatus,
}) => (
	<div
		style={{
			fontFamily: "Arial, sans-serif",
			color: "#333",
			padding: "20px",
		}}
	>
		<h1 style={{ fontSize: "24px", color: "#0056b3" }}>
			Hello, {firstName}!
		</h1>
		<p>
			We&apos;re excited to inform you that your order is currently{" "}
			<strong>{orderStatus}</strong>.
		</p>
		<p>
			<strong>Order ID:</strong> {orderId}
		</p>
		<p>
			<strong>Tracking Number:</strong> {trackingNumber}
		</p>
		<p>
			You can track your order&apos;s progress using the tracking number
			above.
		</p>
		<hr
			style={{
				margin: "20px 0",
				border: "none",
				borderTop: "1px solid #ddd",
			}}
		/>
		<p>
			Thank you for shopping with us! If you have any questions or need
			assistance, feel free to contact our support team.
		</p>
		<p style={{ fontWeight: "bold" }}>SoulePsycle Team</p>
	</div>
);
