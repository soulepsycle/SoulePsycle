import { OrderStatusEmail } from '@/components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, firstName, orderId, trackingNumber, orderStatus } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'SoulePsycle <onboarding@resend.dev>',
      to: [email],
      subject: `Order #${orderId} Update: ${orderStatus}`,
      react: OrderStatusEmail({
        firstName,
        orderId,
        trackingNumber,
        orderStatus,
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
