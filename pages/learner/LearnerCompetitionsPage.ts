import { expect, type Locator, type Page } from '@playwright/test';

import { appConfig } from '../../test-data/competitions';

export default class LearnerCompetitionsPage {
  readonly page: Page;
  readonly allCompetitionsText: Locator;
  readonly competitionsNavLink: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.allCompetitionsText = page.getByText('All Competitions', { exact: true });
    this.competitionsNavLink = page.getByRole('link', { name: 'ec-graduation Competitions' });
    this.searchInput = page.getByRole('textbox', { name: 'Search', exact: true });
  }

  async goto(): Promise<void> {
    const canUseSidebar = await this.competitionsNavLink.isVisible().catch(() => false);

    if (canUseSidebar) {
      await Promise.all([
        this.page.waitForURL('**/your-portal/competitions**', { timeout: 30000 }),
        this.competitionsNavLink.click(),
      ]);
      return;
    }

    await this.page.goto(`${appConfig.learnerBaseUrl}/your-portal/competitions?logged=true`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async assertLoaded(): Promise<void> {
    await expect(this.allCompetitionsText).toBeVisible();
    await expect(this.searchInput).toBeVisible();
  }

  async searchCompetition(competitionName: string): Promise<void> {
    await this.searchInput.fill(competitionName);
    await this.searchInput.press('Enter');
  }

  async openCompetitionTab(tabName: 'Live' | 'Upcoming' | 'Past'): Promise<void> {
    await this.page.getByRole('heading', { name: tabName, exact: true }).click();
  }

  async hasCompetition(competitionName: string): Promise<boolean> {
    return this.competitionTitle(competitionName).isVisible();
  }

  competitionTitle(competitionName: string): Locator {
    return this.page.getByRole('heading', { name: competitionName, exact: true }).first();
  }
}
