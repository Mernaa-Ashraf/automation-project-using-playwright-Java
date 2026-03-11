import { expect, type Locator, type Page } from '@playwright/test';

import { appConfig } from '../../test-data/competitions';

export default class UserManagementPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly addNewUsersButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: 'User Management' });
    this.addNewUsersButton = page.getByRole('button', { name: 'Add New Users image' });
    this.searchInput = page.getByRole('textbox', { name: 'Search ...' });
  }

  async goto(): Promise<void> {
    await this.page.goto(`${appConfig.enterpriseBaseUrl}/organization/user-management`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async assertLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.addNewUsersButton).toBeVisible();
  }

  async openAddUsersManually(): Promise<void> {
    await this.addNewUsersButton.click();
    await this.page.getByRole('menuitem', { name: 'user icon Add Users Manually' }).click();
  }

  async searchForUser(value: string): Promise<void> {
    await this.searchInput.fill(value);
  }

  userEmail(email: string): Locator {
    return this.page.getByText(email, { exact: true });
  }
}
