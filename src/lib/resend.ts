import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Resend } from "resend";

const { env } = getCloudflareContext();

export const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  body: string,
  replyTo?: string
) => {
  try {
    const response = await resend.emails.send({
      from: "Axyl <contact@axyl.io.vn>",
      to,
      subject,
      html: body,
      replyTo: replyTo ? replyTo : undefined,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
