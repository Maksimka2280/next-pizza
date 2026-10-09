
'use server';

import { AgentMailClient } from 'agentmail';
import { hash } from 'bcryptjs';

import { prisma } from '../../prisma/prisma-client';

const client = new AgentMailClient({
  apiKey: process.env.AGENTMAIL_API_KEY,
});

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
};

export async function sendRegistrationCode(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    throw new Error('Введите корректный адрес электронной почты');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser?.verified) {
    throw new Error('Пользователь с этим адресом уже зарегистрирован');
  }

  const code = generateCode();

  await prisma.pendingVerification.upsert({
    where: { email: normalizedEmail },
    update: { code },
    create: {
      email: normalizedEmail,
      code,
    },
  });

  try {
    await client.inboxes.messages.send(process.env.AGENTMAIL_INBOX_ID!, {
      to: [normalizedEmail],
      subject: 'Підтвердження реєстрації — Next pizza',
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
                      <h1 style="margin:0;color:#1f120d;font-size:32px;line-height:1.2;">Подтверждение регистрации</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 32px 20px; text-align:center;">
                      <p style="margin:0;color:#5f4636;font-size:16px;line-height:1.6;">
                        Чтобы завершить регистрацию, введите этот код:
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
                        Если вы не регистрировались, просто проигнорируйте письмо.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 24px;background:#fffaf5;border-top:1px solid #f4d8bf;text-align:center;color:#7b6255;font-size:12px;">
                      Next Pizza • Вкусно, быстро, по‑домашнему
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
      text: `Ваш код подтверждения для регистрации: ${code}\n\nВведите его на странице регистрации.`,
    });

    return { success: true };
  } catch (error) {
    console.error('AgentMail error:', error);
    throw new Error('Не вдалося відправити email');
  }
}

export async function sendLoginCode(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    throw new Error('Введите корректный адрес электронной почты');
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error('Пользователь не найден');
  }

  if (!user.verified) {
    throw new Error('Сначала подтвердите email');
  }

  await sendEmail(normalizedEmail);
  return { success: true };
}

export async function verifyRegistrationCode(email: string, code: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const pending = await prisma.pendingVerification.findUnique({
    where: { email: normalizedEmail },
  });

  return Boolean(pending && pending.code === code.trim());
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string,
  code: string,
) {
  const normalizedName = fullName.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCode = code.trim();

  if (
    normalizedName.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
    password.length < 8 ||
    !/^\d{4}$/.test(normalizedCode)
  ) {
    return false;
  }

  const hashedPassword = await hash(password, 10);

  return prisma.$transaction(async (transaction) => {
    const pending = await transaction.pendingVerification.findUnique({
      where: { email: normalizedEmail },
    });

    if (!pending || pending.code !== normalizedCode) {
      return false;
    }

    const existingUser = await transaction.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return false;
    }

    await transaction.user.create({
      data: {
        fullName: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'USER',
        verified: new Date(),
      },
    });

    await transaction.pendingVerification.delete({
      where: { email: normalizedEmail },
    });

    return true;
  });
}

export async function sendEmail(email: string) {
  const code = generateCode();
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error('Пользователь не найден');
  }

  await prisma.verificationCode.upsert({
    where: { userId: user.id },
    update: { code },
    create: {
      userId: user.id,
      code,
    },
  });

  try {
    await client.inboxes.messages.send(process.env.AGENTMAIL_INBOX_ID!, {
      to: [normalizedEmail],
      subject: 'Підтвердження входу — Next pizza',
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
                                    <h1 style="margin:0;color:#1f120d;font-size:32px;line-height:1.2;">Подтверждение входа</h1>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding:0 32px 20px; text-align:center;">
                                    <p style="margin:0;color:#5f4636;font-size:16px;line-height:1.6;">
                                      Чтобы войти в аккаунт, введите этот код:
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
                        Если вы не запрашивали код, просто проигнорируйте письмо.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 24px;background:#fffaf5;border-top:1px solid #f4d8bf;text-align:center;color:#7b6255;font-size:12px;">
                      Next Pizza • Вкусно, быстро, по‑домашнему
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
      text: `Ваш код подтверждения для входа: ${code}\n\nВведите его на странице авторизации.`,
    });

    return { success: true, code };
  } catch (error) {
    console.error('AgentMail error:', error);
    throw new Error('Не вдалося відправити email');
  }
}

export async function verifyEmailCode(email: string, code: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { verificationCode: true },
  });

  if (!user?.verificationCode || user.verificationCode.code !== code.trim()) {
    return false;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verified: new Date(),
    },
  });

  await prisma.verificationCode.delete({
    where: { userId: user.id },
  });

  return true;
}
