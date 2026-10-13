import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import CheckoutCountButton from '../shared/components/CheckOutComponents/CheckoutCountButton';
import { RegisterForm } from '../shared/components/Auth/RgisterForm';
import { useRegisterForm } from '../shared/hooks/useRegsiterForm';
import { RegisterWindow } from '../shared/components/Auth/Register';
import { getVariantLabel } from '../shared/constants/Pizza';

vi.mock('../shared/hooks/useRegsiterForm', () => ({
  useRegisterForm: vi.fn(),
}));

vi.mock('../shared/components/Auth/RgisterForm', async () => {
  const actual = await vi.importActual<typeof import('../shared/components/Auth/RgisterForm')>(
    '../shared/components/Auth/RgisterForm',
  );

  return {
    RegisterForm: ({ onClose, ...props }: { onClose?: () => void; [key: string]: unknown }) => {
      const html = renderToStaticMarkup(<actual.RegisterForm {...props} onClose={onClose} />);

      return (
        <div
          data-has-close={String(Boolean(onClose))}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    },
  };
});

describe('Checkout quantity buttons', () => {
  it('uses non-submit buttons to avoid form submission', () => {
    const html = renderToStaticMarkup(
      <CheckoutCountButton quantity={1} onChange={() => undefined} />,
    );

    expect(html).toContain('type="button"');
    expect((html.match(/type="button"/g) ?? []).length).toBe(2);
  });
});

describe('Product variant labels', () => {
  it('maps drink and snack sizes to human-readable labels instead of pizza dough labels', () => {
    expect(getVariantLabel(20)).toBe('Маленькая');
    expect(getVariantLabel(200)).toBe('200 мл');
    expect(getVariantLabel(300)).toBe('300 мл');
    expect(getVariantLabel(500)).toBe('500 мл');
    expect(getVariantLabel(6)).toBe('6 шт');
    expect(getVariantLabel(12)).toBe('12 шт');
  });
});

describe('Register form verification flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hides send-code button after the code was sent and before verification succeeds', () => {
    vi.mocked(useRegisterForm).mockReturnValue({
      form: { setValue: vi.fn() },
      formRef: { current: null },
      register: () => ({ name: 'Email', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() }),
      errors: {},
      handleSubmit: (cb: any) => cb,
      getValues: () => ({
        Name: 'Test',
        Email: 'test@example.com',
        Password: 'password123',
        CodeConfirm: '1234',
      }),
      trigger: vi.fn().mockResolvedValue(true),
      code: '1234',
      setCode: vi.fn(),
      isCodeSent: true,
      isEmailVerified: false,
      isSendingCode: false,
      isVerifyingCode: false,
      isRegistering: false,
      handleSendCode: vi.fn(),
      handleVerifyCode: vi.fn(),
      handleRegister: vi.fn(),
    } as any);

    const html = renderToStaticMarkup(<RegisterForm />);

    expect(html).not.toContain('Надіслати код');
    expect(html).toContain('Подтвердить код');
  });

  it('passes the close callback to the register form so the modal closes after success', () => {
    const close = vi.fn();
    const html = renderToStaticMarkup(<RegisterWindow onClose={close} />);

    expect(html).toContain('data-has-close="true"');
  });
});
