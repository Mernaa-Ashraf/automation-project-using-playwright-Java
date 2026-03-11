import { expect, type Locator, type Page } from '@playwright/test';

import { appConfig } from '../../test-data/competitions';

export default class LmsAdminUsersPage {
  readonly page: Page;
  readonly indexHeading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.indexHeading = page.getByRole('heading', { name: 'Index' });
    this.searchInput = page.getByRole('textbox', {
      name: 'First Name, Last Name, Email, Phone',
    });
    this.searchButton = page.getByRole('button', { name: 'Search' });
  }

  async goto(): Promise<void> {
    await this.page.goto(`${appConfig.lmsAdminBaseUrl}/admin/user`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async assertLoaded(): Promise<void> {
    await expect(this.indexHeading).toBeVisible();
    await expect(this.searchInput).toBeVisible();
  }

  async searchUser(email: string): Promise<void> {
    await this.searchInput.fill(email);

    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.searchButton.click(),
    ]);
  }

  userEmail(email: string): Locator {
    return this.page.getByRole('cell', { name: email, exact: true }).first();
  }

  userRow(email: string): Locator {
    return this.page.locator('tr', { has: this.userEmail(email) }).first();
  }

  async openUserForEdit(email: string): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/\/admin\/user\/.+\/edit/, { timeout: 30000 }),
      this.userRow(email).locator('a[href*="/edit"]').first().click(),
    ]);
  }
}
