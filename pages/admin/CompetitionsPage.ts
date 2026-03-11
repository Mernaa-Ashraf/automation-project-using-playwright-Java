import { expect, type Locator, type Page } from '@playwright/test';

import { appConfig } from '../../test-data/competitions';

export default class CompetitionsPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly createCompetitionButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: 'Competitions', exact: true });
    this.createCompetitionButton = page.getByRole('button', { name: 'Create a new Competitions' });
    this.searchInput = page.getByRole('textbox', { name: 'Search by competition name ...' });
  }

  async goto(): Promise<void> {
    await this.page.goto(`${appConfig.enterpriseBaseUrl}/organization/competitions`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async assertLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible({ timeout: 20000 });
    await expect(this.createCompetitionButton).toBeVisible({ timeout: 20000 });
  }

  async openCreateCompetition(): Promise<void> {
    await this.createCompetitionButton.click();
  }

  async searchCompetition(competitionName: string): Promise<void> {
    await this.searchInput.fill(competitionName);
  }

  competitionTitle(competitionName: string): Locator {
    return this.page.getByText(competitionName, { exact: true }).first();
  }
}
