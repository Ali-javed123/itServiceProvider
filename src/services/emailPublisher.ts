import { getChannel } from "../config/rabbitmq.js";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function publishEmail(payload: EmailPayload): Promise<void> {
    console.log("Before getChannel");

  const channel = await getChannel();
    console.log("After getChannel");

  channel.sendToQueue(
    "email_queue",
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );
  console.log(`📤 Email job queued for ${payload.to}`);
}