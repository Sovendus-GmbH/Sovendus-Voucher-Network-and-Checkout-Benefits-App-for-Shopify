import { authenticate } from "../shopify.server";
import db from "../db.server";
import type { ActionArgs } from "@remix-run/node";
import type { Transporter } from "nodemailer";
import { createTransport } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export const action = async ({ request }: ActionArgs) => {
  const { payload, topic, session, shop } = await authenticate.webhook(request);
  try {
    switch (topic) {
      case "APP_UNINSTALLED":
        if (session) {
          await db.session.deleteMany({ where: { shop } });
        }
        return new Response();
      case "CUSTOMERS_DATA_REQUEST":
        return await sendDataRequestMail(
          payload as unknown as payloadType,
          shop
        );
      case "CUSTOMERS_REDACT":
        return await sendDataRedactMail(
          payload as unknown as payloadType,
          shop
        );
      case "SHOP_REDACT":
        return new Response();
      default:
        throw new Response("Unhandled webhook topic", { status: 404 });
    }
  } catch (error) {
    throw new Response("Something went wrong: " + error, { status: 404 });
  }
};

interface payloadType {
  customer: { email: string };
  orders_requested?: number[];
}

async function sendDataRedactMail(payload: payloadType, shop: string) {
  if (!payload?.customer?.email) {
    return new Response("No email in payload", { status: 500 });
  }
  await sendEmail({
    subject: "Datenlöschanfrage",
    text: `
    Hallo Team,

    bitte löscht alle Daten vom folgenden End User:
    E-Mail: ${payload.customer.email}
    Order IDs: ${payload.orders_requested}
    Die Daten wurden über den Shop ${shop} gesammelt.

    Das ist eine automatische generierte E-Mail und erfordert keine Antwort.

    Liebe Grüße
    Robot
  `,
  });
  return new Response();
}

async function sendDataRequestMail(payload: payloadType, shop: string) {
  if (!payload?.customer?.email) {
    return new Response("No email in payload", { status: 500 });
  }
  await sendEmail({
    subject: "Datenauskunft",
    text: `
    Hallo Team,

    bitte sendet die gespeicherten Daten vom folgenden End User and die vom Shop ${shop} hinterlegte E-Mail Adresse:
    E-Mail: hello@example.com
    Order IDs: ${payload.orders_requested}
    Die Daten wurden über den Shop ${shop} gesammelt.
    
    Das ist eine automatische generierte E-Mail und ERFORDERT eine Antwort an den Shop Betreiber und NICHT an den End User.
    
    Liebe Grüße
    Robot        
  `,
  });
  return new Response();
}

async function sendEmail({
  subject,
  text,
}: {
  subject: string;
  text: string;
}): Promise<SMTPTransport.SentMessageInfo> {
  const transporter: Transporter<SMTPTransport.SentMessageInfo> =
    createTransport({
      host: process.env.SEND_EMAIL_HOST,
      port: Number(process.env.SEND_EMAIL_PORT),
      auth: {
        user: process.env.SEND_EMAIL_USERNAME,
        pass: process.env.SEND_EMAIL_PASSWORD,
      },
    });

  return await transporter.sendMail({
    from: `${process.env.SEND_NAME} <${process.env.SEND_EMAIL}>`,
    to: process.env.DATA_REQUEST_EMAIL,
    subject,
    text,
  });
}
