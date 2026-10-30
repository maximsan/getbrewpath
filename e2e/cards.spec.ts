import courseFile from '@content/en/course.json' with { type: 'json' };
import { courseSchema } from '@domains/course/build-course';
import { cardPath } from '@domains/site/routes';

import { expect, test } from './fixtures';
import { openPath } from './helpers';

const course = courseSchema.parse(courseFile);

test.use({ viewport: { width: 320, height: 740 }, reducedMotion: 'reduce' });

for (const card of course.cards) {
  test(`${card.id}: complete Coffee Card content fits supported widths and moods`, async ({
    page,
    request,
  }) => {
    await openPath(page, cardPath(card.id));
    const main = page.getByRole('main');
    const title = main.getByRole('heading', { level: 2, name: card.reward.title, exact: true });
    const reward = title.locator('../..');

    await expect(main.getByRole('heading', { level: 1 })).toContainText(card.reward.title);
    await expect(reward).toContainText(card.reward.summary);
    await expect(reward).toContainText(card.reward.fact);
    const illustration = reward.getByRole('img', {
      name: `Illustration: ${card.reward.title}`,
      exact: true,
    });

    await expect(illustration).toBeVisible();
    const imageSource = await illustration.getAttribute('src');

    expect(imageSource).toMatch(/^data:image\/svg\+xml;base64,/);
    await expect
      .poll(() =>
        illustration.evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
      )
      .toBe(true);
    for (const [label, value] of card.reward.meta ?? []) {
      await expect(reward.getByText(label, { exact: true })).toBeVisible();
      await expect(reward.getByText(value, { exact: true })).toBeVisible();
    }

    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await expect(page.locator('html')).toHaveAttribute('data-scheme', colorScheme);
      for (const width of [320, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const overflow = await reward.evaluate((element) =>
          [...element.querySelectorAll('h2, p, dl, dl > div, dt, dd')]
            .filter((child) => child.scrollWidth > child.clientWidth + 1)
            .map((child) => child.textContent),
        );

        expect(overflow, `${width}px ${colorScheme}: text must wrap instead of clipping`).toEqual(
          [],
        );
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      }
    }

    const imageUrl = await page.locator('meta[property="og:image"]').getAttribute('content');

    expect(imageUrl).toBeTruthy();
    const image = await request.get(new URL(imageUrl!).pathname);

    expect(image.status()).toBe(200);
    expect(image.headers()['content-type']).toContain('image/png');
    const bytes = await image.body();

    expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(bytes.readUInt32BE(16)).toBe(1200);
    expect(bytes.readUInt32BE(20)).toBe(630);
  });
}

test('unknown Coffee Card pages and share images return 404', async ({ request }) => {
  for (const path of ['/card/no-such-card', '/card/no-such-card/opengraph-image']) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});
