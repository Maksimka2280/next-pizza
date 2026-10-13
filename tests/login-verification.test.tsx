// @vitest-environment jsdom

import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import React from 'react';

const { verifyEmailCodeMock, verifyRegistrationCodeMock, sendLoginCodeMock } = vi.hoisted(() => ({
  verifyEmailCodeMock: vi.fn(),
  verifyRegistrationCodeMock: vi.fn(),
  sendLoginCodeMock: vi.fn(),
}));

vi.mock('@/actions/EmailActions', () => ({
  sendLoginCode: sendLoginCodeMock,
  verifyEmailCode: verifyEmailCodeMock,
  verifyRegistrationCode: verifyRegistrationCodeMock,
}));

import { useLoginForm } from '../shared/hooks/useLoginForm';

describe('Login verification flow', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('validates login code against the login verification record, not the registration record', async () => {
    verifyEmailCodeMock.mockResolvedValue(true);
    verifyRegistrationCodeMock.mockResolvedValue(false);

    let hookApi: ReturnType<typeof useLoginForm>;

    const container = document.createElement('div');
    const root = createRoot(container);

    function TestComponent() {
      hookApi = useLoginForm();
      return null;
    }

    await act(async () => {
      root.render(<TestComponent />);
    });

    await act(async () => {
      hookApi.form.setValue('Email', 'user@example.com');
      hookApi.form.setValue('Password', 'pass1234');
      hookApi.setCode('1234');
      hookApi.setIsCodeSent(true);
      await hookApi.handleVerifyCode();
    });

    expect(verifyEmailCodeMock).toHaveBeenCalledWith('user@example.com', '1234');
    expect(verifyRegistrationCodeMock).not.toHaveBeenCalled();

    root.unmount();
  });
});
