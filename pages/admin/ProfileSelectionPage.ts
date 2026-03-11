import { expect, type Locator, type Page } from '@playwright/test';

export default class ProfileSelectionPage {
  readonly page: Page;
  readonly welcomeHeading: Locator;
  readonly organizationButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeHeading = page.getByRole('heading', { name: /Welcome,/ });
    this.organizationButtons = page.getByRole('button', { name: /Login to organization/ });
  }

  async goto(): Promise<void> {
    await this.page.goto('http://20.1.140.13/profile-selection', {
      waitUntil: 'domcontentloaded',
    });
  }

  async assertLoaded(): Promise<void> {
    await expect(this.welcomeHeading).toBeVisible();
    await expect(this.organizationButtons.first()).toBeVisible();
  }

  async selectFirstOrganization(): Promise<void> {
    await Promise.all([
      this.page.waitForURL('**/organization/dashboard', { timeout: 30000 }),
      this.organizationButtons.first().click(),
    ]);
  }
}
