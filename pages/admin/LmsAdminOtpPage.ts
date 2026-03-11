import { expect, type Locator, type Page } from '@playwright/test';

import { appConfig } from '../../test-data/competitions';

export default class LmsAdminOtpPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly codeInputs: Locator;
  readonly verifyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByText('OTP', { exact: true }).first();
    this.codeInputs = page.locator('input[name="code[]"]');
    this.verifyButton = page.getByRole('button', { name: 'Verify' });
  }

  async goto(): Promise<void> {
    await this.page.goto(`${appConfig.lmsAdminBaseUrl}/admin/code`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async assertLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.verifyButton).toBeVisible();
    await expect(this.codeInputs).toHaveCount(4);
  }

  async verify(otp: string): Promise<void> {
    const digits = otp.trim().split('');

    if (digits.length !== 4) {
      throw new Error('LMS admin OTP must contain exactly 4 digits.');
    }

    for (const [index, digit] of digits.entries()) {
      await this.codeInputs.nth(index).fill(digit);
    }

    await Promise.all([
      this.page.waitForURL('**/admin/dashboard', { timeout: 30000 }),
      this.verifyButton.click(),
    ]);
  }
}
