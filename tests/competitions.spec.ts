import * as fs from 'node:fs';
import * as path from 'node:path';

import { type Browser } from '@playwright/test';

import { expect, test } from '../fixtures/pomFixtures';
import LmsAdminLoginPage from '../pages/admin/LmsAdminLoginPage';
import LmsAdminOtpPage from '../pages/admin/LmsAdminOtpPage';
import LmsAdminUserEditPage from '../pages/admin/LmsAdminUserEditPage';
import LmsAdminUsersPage from '../pages/admin/LmsAdminUsersPage';
import {
  buildCompetitionScenario,
  getEnterpriseAdminCredentials,
  getLmsAdminCredentials,
} from '../test-data/competitions';

const VIEWPORT = { width: 1590, height: 1215 };
const LMS_ADMIN_STORAGE_STATE = path.resolve(process.cwd(), 'storage', 'lms-admin.json');

async function createLmsAdminSession(browser: Browser): Promise<{
  close: () => Promise<void>;
  userEditPage: LmsAdminUserEditPage;
  usersPage: LmsAdminUsersPage;
}> {
  const credentials = getLmsAdminCredentials();
  const context = await browser.newContext({
    storageState: fs.existsSync(LMS_ADMIN_STORAGE_STATE) ? LMS_ADMIN_STORAGE_STATE : undefined,
    viewport: VIEWPORT,
  });
  const page = await context.newPage();
  const loginPage = new LmsAdminLoginPage(page);
  const otpPage = new LmsAdminOtpPage(page);
  const usersPage = new LmsAdminUsersPage(page);
  const userEditPage = new LmsAdminUserEditPage(page);

  await usersPage.goto();

  const hasAuthenticatedSession = await usersPage.searchInput.isVisible().catch(() => false);

  if (!hasAuthenticatedSession) {
    await loginPage.goto();
    await loginPage.assertLoaded();
    await loginPage.login(credentials.email, credentials.password);
    await otpPage.assertLoaded();
    await otpPage.verify(credentials.otp);
    await context.storageState({ path: LMS_ADMIN_STORAGE_STATE });
    await usersPage.goto();
  }

  await usersPage.assertLoaded();

  return {
    close: async () => {
      await context.close();
    },
    userEditPage,
    usersPage,
  };
}

test.describe('Competitions', () => {
  test.setTimeout(480000);

  test('creates a competition and assigns it to a generated learner', async ({
    addUserPage,
    browser,
    competitionCreationPage,
    competitionsPage,
    learnerCompetitionsPage,
    learnerLoginPage,
    learnerOnboardingPage,
    userManagementPage,
  }) => {
    const adminCredentials = getEnterpriseAdminCredentials();
    const scenario = buildCompetitionScenario(adminCredentials.email);

    // Arrange
    await competitionsPage.goto();
    await competitionsPage.assertLoaded();

    // Act
    await competitionsPage.openCreateCompetition();
    await competitionCreationPage.assertLoaded();
    await competitionCreationPage.fillCompetitionInfo(scenario.competitionName);
    await competitionCreationPage.continueFromCompetitionInfo();
    await competitionCreationPage.assertTemplateSelectionLoaded();
    await competitionCreationPage.selectTemplate(scenario.templateTitle);
    await competitionCreationPage.continueFromTemplateSelection();
    await competitionCreationPage.assertParticipantSelectionLoaded();
    await competitionCreationPage.assignParticipant(scenario.existingParticipantEmail);
    await competitionCreationPage.confirmParticipantSelection();

    await competitionsPage.assertLoaded();
    await competitionsPage.searchCompetition(scenario.competitionName);
    await expect(competitionsPage.competitionTitle(scenario.competitionName)).toBeVisible();

    await userManagementPage.goto();
    await userManagementPage.assertLoaded();
    await userManagementPage.openAddUsersManually();
    await addUserPage.assertLoaded();
    await addUserPage.fillUserInfo(scenario.learnerUser);
    await addUserPage.selectRole('User');
    await addUserPage.enablePrivateCompetitionAssignment();
    await addUserPage.assignPrivateCompetition(scenario.competitionName);
    await addUserPage.submit();

    const lmsAdminSession = await createLmsAdminSession(browser);

    try {
      await expect
        .poll(
          async () => {
            await lmsAdminSession.usersPage.goto();
            await lmsAdminSession.usersPage.assertLoaded();
            await lmsAdminSession.usersPage.searchUser(scenario.learnerUser.email);

            return await lmsAdminSession.usersPage.userEmail(scenario.learnerUser.email).count();
          },
          {
            intervals: [1000, 2000, 5000],
            timeout: 60000,
          },
        )
        .toBeGreaterThan(0);

      await expect(lmsAdminSession.usersPage.userEmail(scenario.learnerUser.email)).toBeVisible();
      await lmsAdminSession.usersPage.openUserForEdit(scenario.learnerUser.email);
      await lmsAdminSession.userEditPage.assertLoaded();
      await expect(lmsAdminSession.userEditPage.emailInput).toHaveValue(
        scenario.learnerUser.email,
      );
      await lmsAdminSession.userEditPage.ensureStatusActive();
      await lmsAdminSession.userEditPage.updatePassword(scenario.learnerPassword);
    } finally {
      await lmsAdminSession.close();
    }

    await learnerLoginPage.goto();
    await learnerLoginPage.assertLoaded();
    await learnerLoginPage.login(scenario.learnerUser.email, scenario.learnerPassword);
    await learnerOnboardingPage.completeInitialSetup();
    await learnerCompetitionsPage.goto();
    await learnerCompetitionsPage.assertLoaded();
    await learnerCompetitionsPage.searchCompetition(scenario.competitionName);
    let learnerCanSeeCompetition = await learnerCompetitionsPage.hasCompetition(
      scenario.competitionName,
    );

    if (!learnerCanSeeCompetition) {
      await learnerCompetitionsPage.openCompetitionTab('Upcoming');
      await learnerCompetitionsPage.searchCompetition(scenario.competitionName);
      learnerCanSeeCompetition = await learnerCompetitionsPage.hasCompetition(
        scenario.competitionName,
      );
    }

    if (!learnerCanSeeCompetition) {
      await learnerCompetitionsPage.openCompetitionTab('Past');
      await learnerCompetitionsPage.searchCompetition(scenario.competitionName);
      learnerCanSeeCompetition = await learnerCompetitionsPage.hasCompetition(
        scenario.competitionName,
      );
    }

    // Assert
    expect(learnerCanSeeCompetition).toBeTruthy();
  });
});
