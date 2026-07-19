// // src/workers/emailWorker.ts
// import amqp from "amqplib";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import type { EmailPayload } from "../services/emailPublisher.js";

// dotenv.config();

// // ✅ Gmail App Password use karein
// const EMAIL_USER = process.env.EMAIL_USER!;
// const EMAIL_PASS = process.env.EMAIL_PASS!;

// // Test transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: { 
//     user: EMAIL_USER, 
//     pass: EMAIL_PASS 
//   },
// });

// // ✅ Verify connection
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ SMTP Connection Error:", error);
//   } else {
//     console.log("✅ SMTP Server is ready to send emails");
//   }
// });

// async function startConsumer() {
//   try {
//     const conn = await amqp.connect({
//       protocol: "amqp",
//       hostname: process.env.RABBITMQ_HOSTNAME || "localhost",
//       port: 5672,
//       username: process.env.RABBITMQ_USERNAME || "guest",
//       password: process.env.RABBITMQ_PASSWORD || "guest",
//     });

//     const channel = await conn.createChannel();
//     await channel.assertQueue("email_queue", { durable: true });
//     channel.prefetch(1);

//     console.log("📨 Email worker started, waiting for messages...");

//     channel.consume("email_queue", async (msg) => {
//       if (!msg) return;
      
//       try {
//         const payload: EmailPayload = JSON.parse(msg.content.toString());
//         console.log(`📧 Sending email to: ${payload.to}`);
        
//         const info = await transporter.sendMail({
//           from: `"OTP Service" <${EMAIL_USER}>`,
//           to: payload.to,
//           subject: payload.subject,
//           html: payload.html,
//         });

//         console.log(`✅ Email sent to ${payload.to}, MessageId: ${info.messageId}`);
//         channel.ack(msg);
//       } catch (error) {
//         console.error("❌ Failed to send email:", error);
//         // Reject with requeue false to avoid infinite loop
//         channel.nack(msg, false, false);
//       }
//     });
//   } catch (error) {
//     console.error("❌ RabbitMQ Connection Error:", error);
//   }
// }

// startConsumer();





// src/workers/emailWorker.ts
import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import type { EmailPayload } from "../services/emailPublisher.js";

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER!;
const EMAIL_PASS = process.env.EMAIL_PASS!;
const CLOUDAMQP_URL = process.env.CLOUDAMQP_URL!;

// Test transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { 
    user: EMAIL_USER, 
    pass: EMAIL_PASS 
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error);
  } else {
    console.log("✅ SMTP Server is ready to send emails");
  }
});

async function startConsumer() {
  try {
    // CloudAMQP URL se direct connect karein
    const conn = await amqp.connect(CLOUDAMQP_URL);

    const channel = await conn.createChannel();
    await channel.assertQueue("email_queue", { durable: true });
    channel.prefetch(1);

    console.log("📨 Email worker started, waiting for messages from CloudAMQP...");

    channel.consume("email_queue", async (msg) => {
      if (!msg) return;
      
      try {
        const payload: EmailPayload = JSON.parse(msg.content.toString());
        console.log(`📧 Sending email to: ${payload.to}`);
        
        const info = await transporter.sendMail({
          from: `"OTP Service" <${EMAIL_USER}>`,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
        });

        console.log(`✅ Email sent to ${payload.to}, MessageId: ${info.messageId}`);
        channel.ack(msg);
      } catch (error) {
        console.error("❌ Failed to send email:", error);
        // Reject with requeue false to avoid infinite loop
        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    console.error("❌ CloudAMQP Connection Error:", error);
  }
}

startConsumer();