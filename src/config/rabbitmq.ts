// import amqp, { type Channel } from "amqplib";

// let connection: Awaited<ReturnType<typeof amqp.connect>> | null = null;
// let channel: Channel | null = null;

// export async function connectRabbitMQ(): Promise<Channel> {
//   if (channel) return channel;

//   connection = await amqp.connect({
//     protocol: "amqp",
//     hostname: process.env.RABBITMQ_HOSTNAME,
//     port: 5672,
//     username: process.env.RABBITMQ_USERNAME,
//     password: process.env.RABBITMQ_PASSWORD,
//   } as any);

//   connection.on("error", (err) => {
//     console.error("RabbitMQ connection error:", err.message);
//     connection = null;
//     channel = null;
//   });

//   connection.on("close", () => {
//     console.warn("RabbitMQ connection closed");
//     connection = null;
//     channel = null;
//   });

//   channel = await connection.createChannel();
//   await channel.assertQueue("email_queue", { durable: true });

//   console.log("✅ RabbitMQ connected & channel ready");
//   return channel;
// }

// export async function getChannel(): Promise<Channel> {
//   return channel ?? (await connectRabbitMQ());
// }

// export async function closeRabbitMQ(): Promise<void> {
//   if (channel) {
//     await channel.close();
//     channel = null;
//   }
//   if (connection) {
//     await connection.close();
//     connection = null;
//   }
// }


import amqp, { type Channel } from "amqplib";
import dotenv from "dotenv";

dotenv.config();
let connection: Awaited<ReturnType<typeof amqp.connect>> | null = null;
let channel: Channel | null = null;


export async function connectRabbitMQ(): Promise<Channel> {
  if (channel) return channel;

  const cloudAmqpUrl = process.env.CLOUDAMQP_URL;
  if (!cloudAmqpUrl) {
    throw new Error("CLOUDAMQP_URL is not defined in .env file");
  }
console.log("AMPQ_URL=>",process.env.CLOUDAMQP_URL)
  // CloudAMQP URL directly use karein (ye automatically TLS, credentials, aur vhost handle kar leta hai)
  connection = await amqp.connect(cloudAmqpUrl);

  connection.on("error", (err) => {
    console.error("RabbitMQ connection error:", err.message);
    connection = null;
    channel = null;
  });

  connection.on("close", () => {
    console.warn("RabbitMQ connection closed");
    connection = null;
    channel = null;
  });

  channel = await connection.createChannel();
  await channel.assertQueue("email_queue", { durable: true });

  console.log("✅ CloudAMQP connected & channel ready");
  return channel;
}

export async function getChannel(): Promise<Channel> {
  return channel ?? (await connectRabbitMQ());
}

export async function closeRabbitMQ(): Promise<void> {
  if (channel) {
    await channel.close();
    channel = null;
  }
  if (connection) {
    await connection.close();
    connection = null;
  }
}