import { expect, type Locator, type Page } from '@playwright/test';

import type { NewUserData } from '../../test-data/competitions';
import { appConfig } from '../../test-data/competitions';

export default class CompetitionCreationPage {
  readonly page: Page;
  readonly createCompetitionTitle: Locator;
  readonly competitionNameInput: Locator;
  readonly templateStepHeading: Locator;
  readonly participantStepHeading: Locator;
  readonly nextButton: Locator;
  readonly templateSearchInput: Locator;
  readonly participantSearchInput: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createCompetitionTitle = page.getByText('Create New Competition', { exact: true });
    this.competitionNameInput = page.getByRole('textbox', { name: /Introduction to Cybersecurity/i });
    this.templateStepHeading = page.getByRole('heading', { name: 'Select a Competition to Assign' });
    this.participantStepHeading = page.getByRole('heading', { name: /Assign users to .* Competitions/ });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.templateSearchInput = page.getByRole('textbox', { name: 'Search by competition name ...' });
    this.participantSearchInput = page.getByRole('textbox', { name: 'Search...' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
  }

  async goto(): Promise<void> {
    await this.page.goto(`${appConfig.enterpriseBaseUrl}/organization/competitions`, {
      waitUntil: 'domcontentloaded',
    });
    await this.page.getByRole('button', { name: 'Create a new Competitions' }).click();
  }

  async assertLoaded(): Promise<void> {
    await expect(this.createCompetitionTitle).toBeVisible();
    await expect(this.competitionNameInput).toBeVisible();
  }

  async fillCompetitionInfo(competitionName: string): Promise<void> {
    await this.competitionNameInput.fill(competitionName);
  }

  async continueFromCompetitionInfo(): Promise<void> {
    await Promise.all([
      this.page.waitForURL('**/organization/competitions/creation', { timeout: 30000 }),
      this.nextButton.click(),
    ]);
  }

  async assertTemplateSelectionLoaded(): Promise<void> {
    await expect(this.templateStepHeading).toBeVisible();
    await expect(this.templateSearchInput).toBeVisible();
  }

  async selectTemplate(templateTitle: string): Promise<void> {
    await this.templateSearchInput.fill(templateTitle);
    await this.page.getByText(templateTitle, { exact: true }).waitFor({ state: 'visible' });
    await this.page.getByRole('button', { name: 'Select' }).first().click();
  }

  async continueFromTemplateSelection(): Promise<void> {
    await Promise.all([
      this.page.waitForURL('**/organization/competitions/selection', { timeout: 30000 }),
      this.nextButton.click(),
    ]);
  }

  async assertParticipantSelectionLoaded(): Promise<void> {
    await expect(this.participantStepHeading).toBeVisible();
    await expect(this.participantSearchInput).toBeVisible();
  }

  participantOption(displayName: string): Locator {
    return this.page.getByText(displayName, { exact: true }).first();
  }

  async assignParticipant(user: string | NewUserData): Promise<void> {
    const searchTerm = typeof user === 'string' ? user : user.email;
    const optionText = typeof user === 'string' ? user : `${user.firstName} ${user.lastName}`;

    await this.participantSearchInput.fill(searchTerm);
    await this.participantOption(optionText).click();
  }

  async hasParticipant(user: string | NewUserData): Promise<boolean> {
    const searchTerm = typeof user === 'string' ? user : user.email;
    const optionText = typeof user === 'string' ? user : `${user.firstName} ${user.lastName}`;

    await this.participantSearchInput.fill(searchTerm);
    return this.participantOption(optionText).isVisible();
  }

  async confirmParticipantSelection(): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/\/organization\/competitions(?:\?|$)/, { timeout: 30000 }),
      this.confirmButton.click(),
    ]);
  }
}
