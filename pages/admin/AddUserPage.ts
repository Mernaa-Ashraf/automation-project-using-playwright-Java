import { expect, type Locator, type Page } from '@playwright/test';

import type { NewUserData } from '../../test-data/competitions';
import { appConfig } from '../../test-data/competitions';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default class AddUserPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly addUserButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: 'Add new User' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.addUserButton = page.getByRole('button', { name: 'Add user' });
  }

  async goto(): Promise<void> {
    await this.page.goto(`${appConfig.enterpriseBaseUrl}/organization/user-management/add-users`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async assertLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
  }

  async fillUserInfo(user: NewUserData): Promise<void> {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.emailInput.fill(user.email);
  }

  async selectRole(role: string): Promise<void> {
    await this.page.getByRole('combobox').nth(0).click();
    await this.page.getByRole('option', { name: role, exact: true }).click();
  }

  async enablePrivateCompetitionAssignment(): Promise<void> {
    await this.page.getByText('Assign Private Competition', { exact: true }).click();
  }

  async assignPrivateCompetition(competitionName: string): Promise<void> {
    await this.page.getByRole('combobox').nth(2).click();
    await this.page.getByRole('textbox', { name: 'Search' }).fill(competitionName);
    await this.page.getByRole('option', { name: new RegExp(escapeRegExp(competitionName)) }).click();
  }

  async submit(): Promise<void> {
    const redirectPromise = this.page
      .waitForURL(/\/organization\/user-management(?:\?|$)/, { timeout: 10000 })
      .catch(() => undefined);

    await this.page.keyboard.press('Escape');
    await this.pageHeading.click();
    await this.addUserButton.click();
    await redirectPromise;
    await this.page.waitForLoadState('networkidle');
  }
}
