import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import CheckoutCountButton from '../shared/components/CheckOutComponents/CheckoutCountButton';

describe('Checkout quantity buttons', () => {
  it('uses non-submit buttons to avoid form submission', () => {
    const html = renderToStaticMarkup(
      <CheckoutCountButton quantity={1} onChange={() => undefined} />,
    );

    expect(html).toContain('type="button"');
    expect((html.match(/type="button"/g) ?? []).length).toBe(2);
  });
});
