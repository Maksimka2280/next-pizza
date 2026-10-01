
'use server';

import { AgentMailClient } from 'agentmail';

const client = new AgentMailClient({
  apiKey: process.env.AGENTMAIL_API_KEY,
});

const confirmationCodes = new Map<string, string>();

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function sendEmail(email: string) {
  const code = generateCode();
  const normalizedEmail = email.trim().toLowerCase();

  confirmationCodes.set(normalizedEmail, code);

  try {
    const response = await client.inboxes.messages.send(
      process.env.AGENTMAIL_INBOX_ID!,
      {
        to: [email],
        subject: 'Підтвердження оплати — Next pizza',
        html: `
          <div style="margin:0;padding:0;background:#fff7f0;font-family:Arial,Helvetica,sans-serif;color:#22130d;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff7f0; margin:0; padding:0;">
              <tr>
                <td align="center" style="padding:32px 16px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #f4d8bf;">
                    <tr>
                      <td align="center" style="padding:28px 24px 10px; background:linear-gradient(135deg,#ffedd5,#fffaf5);">
                        <div style="display:inline-block;padding:8px 18px;border-radius:999px;background:#ff8c42;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:1.5px;">
                          🍕 NEXT PIZZA
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:24px 32px 8px; text-align:center;">
                        <h1 style="margin:0;color:#1f120d;font-size:32px;line-height:1.2;">Підтвердження оплати</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 32px 20px; text-align:center;">
                        <p style="margin:0;color:#5f4636;font-size:16px;line-height:1.6;">
                          Щоб завершити оплату, введіть цей код у формі на сайті:
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding:10px 32px 24px;">
                        <div style="display:inline-block;padding:18px 28px;border-radius:16px;background:#fff1e6;border:2px dashed #ff9f60;color:#1f120d;font-size:34px;font-weight:800;letter-spacing:6px;">
                          ${code}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 32px 28px; text-align:center;">
                        <p style="margin:0;color:#7b6255;font-size:14px;line-height:1.6;">
                          Якщо ви не оформлювали замовлення, просто проігноруйте цей лист.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:18px 24px;background:#fffaf5;border-top:1px solid #f4d8bf;text-align:center;color:#7b6255;font-size:12px;">
                        Next Pizza • Смачно, швидко, по-домашньому
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        `,
        text: `Ваш код підтвердження для оплати: ${code}\n\nВведіть його на сторінці для завершення замовлення.`,
      }
    );

    console.log('Email sent:', response);

    return { success: true, code };
  } catch (error) {
    console.error('AgentMail error:', error);
    throw new Error('Не вдалося відправити email');
  }
}

export async function verifyEmailCode(email: string, code: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const storedCode = confirmationCodes.get(normalizedEmail);

  if (!storedCode || storedCode !== code.trim()) {
    return false;
  }

  confirmationCodes.delete(normalizedEmail);
  return true;
}

