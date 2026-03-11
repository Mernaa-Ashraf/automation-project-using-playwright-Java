import { expect, type Locator, type Page } from '@playwright/test';

import { appConfig } from '../../test-data/competitions';

export default class LmsAdminUserEditPage {
  readonly page: Page;
  readonly editHeading: Locator;
  readonly emailInput: Locator;
  readonly statusCombobox: Locator;
  readonly profileUpdateButton: Locator;
  readonly passwordInput: Locator;
  readonly updatePasswordButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editHeading = page.getByRole('heading', { name: 'Edit' });
    this.emailInput = page.locator('input[name="email"]');
    this.statusCombobox = page.getByRole('combobox', {
      name: /Active|Pending|Suspended/i,
    });
    this.profileUpdateButton = page.getByRole('button', { name: 'Update' }).first();
    this.passwordInput = page.getByLabel('Password');
    this.updatePasswordButton = page.getByRole('button', { name: 'Update Password' });
  }

  async goto(userId: string): Promise<void> {
    await this.page.goto(`${appConfig.lmsAdminBaseUrl}/admin/user/${userId}/edit`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async assertLoaded(): Promise<void> {
    await expect(this.editHeading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
  }

  async ensureStatusActive(): Promise<void> {
    const currentStatus = (await this.statusCombobox.first().innerText()).trim();

    if (!/active/i.test(currentStatus)) {
      await this.statusCombobox.first().click();
      await this.page.getByRole('treeitem', { name: 'Active' }).click();
      await this.profileUpdateButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async updatePassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.updatePasswordButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
