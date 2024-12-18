import { OrderStatusEmail } from '@/components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, firstName, orderId, trackingNumber, orderStatus } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({
        error: 'No email found!'
      }), {
        status: 404
      })
    }

    if (!firstName) {
      return new Response(JSON.stringify({
        error: 'No first name found!'
      }), {
        status: 404
      })
    }

    if (!orderId) {
      return new Response(JSON.stringify({
        error: 'No order ID found!'
      }), {
        status: 404
      })
    }

    if (!trackingNumber) {
      return new Response(JSON.stringify({
        error: 'No tracking number found!'
      }), {
        status: 404
      })
    }

    if (!orderStatus) {
      return new Response(JSON.stringify({
        error: 'No order status found!'
      }), {
        status: 404
      })
    }

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
