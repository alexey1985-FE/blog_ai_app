'use server';
import SubscribeEmail from '@/emails/SubscribeEmail';
import React from 'react';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const SendEmail = async (FormData: FormData, user: string) => {
  const senderMail = FormData.get('senderMail');

  try {
    await resend.emails.send({
      from: 'Blog AI app <onboarding@resend.dev>',
      to: senderMail as string,
      subject: 'Subscribe message',
      reply_to: senderMail as string,
      react: <SubscribeEmail email={senderMail as string} user={user} />
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false };
  }
};
