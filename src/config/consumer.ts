import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOtp = async () => {
  try {
    const connection = amqp.connect(
      {
        protocol: "amqp",
        hostname: process.env.RABBITMQ_HOSTNAME,
        port: 5672,
        username: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD,
      } as any,
    );
    const channel = await (await connection).createChannel();
    const queueName = "sendOtp" as string;
    await channel.assertQueue(queueName, { durable: true });

    console.log("mail service consumer started,listing for messages on queue:");

    channel.consume(queueName, async (message: any) => {
      try {
        const { to, subject, body } = JSON.parse(message.content.toString());
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
          },
        } as any);
        await transporter.sendMail({
          from: "chat-app",
          to,
          subject,
          text: body,
        });
        console.log(`OTP mail send to ${to}`);
        channel.ack(message);
      } catch (error) {
        console.log("failed to send OTP");
      }
    });
  } catch (error) {
      console.log("RabbitMQ Consumer Error:", error);

  }
};
