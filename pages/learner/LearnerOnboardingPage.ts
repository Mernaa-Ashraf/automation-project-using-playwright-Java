import { expect, type Locator, type Page } from '@playwright/test';

import { appConfig } from '../../test-data/competitions';

export default class LearnerOnboardingPage {
  readonly page: Page;
  readonly closeModalButton: Locator;
  readonly experienceHeading: Locator;
  readonly finishButton: Locator;
  readonly getStartedButton: Locator;
  readonly goalsHeading: Locator;
  readonly nextButton: Locator;
  readonly skillsHeading: Locator;
  readonly stepOneHeading: Locator;
  readonly termsCheckbox: Locator;
  readonly termsHeading: Locator;
  readonly thanksHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.closeModalButton = page.getByRole('button', { name: 'Close' });
    this.experienceHeading = page.getByRole('heading', {
      name: 'What is your level of experience at the previously selected categories',
    });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.getStartedButton = page.getByRole('button', { name: 'Get Started' });
    this.goalsHeading = page.getByRole('heading', {
      name: 'What is the next career goal you want to achieve with EC-Council?',
    });
    this.nextButton = page.getByRole('button', { name: 'Next' }).first();
    this.skillsHeading = page.getByRole('heading', {
      name: 'Select some of the skills you want to learn next with EC-Council',
    });
    this.stepOneHeading = page.getByRole('heading', {
      name: 'Select up to four of the following categories that most interest you',
    });
    this.termsCheckbox = page.getByRole('checkbox', { name: 'check-box' });
    this.termsHeading = page.getByRole('heading', { name: 'Welcome to EC-Council Learning' });
    this.thanksHeading = page.getByRole('heading', { name: /Thank You,/ });
  }

  async goto(): Promise<void> {
    await this.page.goto(`${appConfig.learnerBaseUrl}/on-boarding/accept-terms?logged=true`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async assertLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/on-boarding\//);
  }

  async completeInitialSetup(): Promise<void> {
    if (!this.page.url().includes('/on-boarding/')) {
      return;
    }

    await this.dismissModalIfVisible();

    if (this.page.url().includes('/on-boarding/accept-terms')) {
      await this.acceptTerms();
    }

    if (this.page.url().includes('/on-boarding/category')) {
      await this.selectCategories(['Cybersecurity', 'Vulnerability Assessment and Pentesting']);
    }

    if (this.page.url().includes('/on-boarding/level')) {
      await this.selectExperienceLevel('Beginner');
    }

    if (this.page.url().includes('/on-boarding/goals')) {
      await this.selectCareerGoal('Making a career shift into a tech field');
    }

    if (this.page.url().includes('/on-boarding/tags')) {
      await this.selectSkills(['Forensics Investigation', 'ICS']);
    }

    if (this.page.url().includes('/on-boarding/thanks')) {
      await expect(this.thanksHeading).toBeVisible({ timeout: 30000 });
    }
  }

  async acceptTerms(): Promise<void> {
    await expect(this.termsHeading).toBeVisible({ timeout: 30000 });
    await this.termsCheckbox.focus();
    await this.page.keyboard.press('Space');
    await expect(this.termsCheckbox).toBeChecked();

    await Promise.all([
      this.page.waitForURL(/\/on-boarding\/category/, { timeout: 60000 }),
      this.getStartedButton.click(),
    ]);
  }

  async selectCategories(categories: string[]): Promise<void> {
    await expect(this.stepOneHeading).toBeVisible({ timeout: 30000 });
    await this.dismissModalIfVisible();

    for (const category of categories) {
      await this.page.getByText(category, { exact: true }).click();
    }

    await Promise.all([
      this.page.waitForURL(/\/on-boarding\/level/, { timeout: 60000 }),
      this.nextButton.click(),
    ]);
  }

  async selectExperienceLevel(level: 'Beginner' | 'Intermediate' | 'Advanced'): Promise<void> {
    await expect(this.experienceHeading).toBeVisible({ timeout: 30000 });
    await this.page.getByText(level, { exact: true }).click();

    await Promise.all([
      this.page.waitForURL(/\/on-boarding\/goals/, { timeout: 60000 }),
      this.nextButton.click(),
    ]);
  }

  async selectCareerGoal(goal: string): Promise<void> {
    await expect(this.goalsHeading).toBeVisible({ timeout: 30000 });
    await this.page.getByText(goal, { exact: true }).click();

    await Promise.all([
      this.page.waitForURL(/\/on-boarding\/tags/, { timeout: 60000 }),
      this.nextButton.click(),
    ]);
  }

  async selectSkills(skills: string[]): Promise<void> {
    await expect(this.skillsHeading).toBeVisible({ timeout: 30000 });

    for (const skill of skills) {
      await this.page.getByText(skill, { exact: true }).click();
    }

    await Promise.all([
      this.page.waitForURL(/\/on-boarding\/thanks/, { timeout: 60000 }),
      this.finishButton.click(),
    ]);
  }

  private async dismissModalIfVisible(): Promise<void> {
    const isVisible = await this.closeModalButton.isVisible().catch(() => false);

    if (!isVisible) {
      return;
    }

    await this.closeModalButton.click();
    await expect(this.closeModalButton).toBeHidden({ timeout: 10000 });
  }
}
