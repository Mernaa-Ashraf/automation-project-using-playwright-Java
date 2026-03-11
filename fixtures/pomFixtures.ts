import { expect, test as base, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

import AddUserPage from '../pages/admin/AddUserPage';
import CompetitionCreationPage from '../pages/admin/CompetitionCreationPage';
import CompetitionsPage from '../pages/admin/CompetitionsPage';
import EnterpriseLoginPage from '../pages/admin/EnterpriseLoginPage';
import LmsAdminLoginPage from '../pages/admin/LmsAdminLoginPage';
import LmsAdminOtpPage from '../pages/admin/LmsAdminOtpPage';
import LmsAdminUserEditPage from '../pages/admin/LmsAdminUserEditPage';
import LmsAdminUsersPage from '../pages/admin/LmsAdminUsersPage';
import ProfileSelectionPage from '../pages/admin/ProfileSelectionPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import LearnerCompetitionsPage from '../pages/learner/LearnerCompetitionsPage';
import LearnerLoginPage from '../pages/learner/LearnerLoginPage';
import LearnerOnboardingPage from '../pages/learner/LearnerOnboardingPage';
import {
  appConfig,
  getEnterpriseAdminCredentials,
  getLmsAdminCredentials,
} from '../test-data/competitions';

const VIEWPORT = { width: 1590, height: 1215 };
const ENTERPRISE_STORAGE_STATE = path.resolve(process.cwd(), 'storage', 'enterprise-admin.json');
const LMS_ADMIN_STORAGE_STATE = path.resolve(process.cwd(), 'storage', 'lms-admin.json');

type PomFixtures = {
  addUserPage: AddUserPage;
  adminPage: Page;
  competitionCreationPage: CompetitionCreationPage;
  competitionsPage: CompetitionsPage;
  enterpriseLoginPage: EnterpriseLoginPage;
  learnerCompetitionsPage: LearnerCompetitionsPage;
  learnerLoginPage: LearnerLoginPage;
  learnerOnboardingPage: LearnerOnboardingPage;
  learnerPage: Page;
  lmsAdminLoginPage: LmsAdminLoginPage;
  lmsAdminOtpPage: LmsAdminOtpPage;
  lmsAdminPage: Page;
  lmsAdminUserEditPage: LmsAdminUserEditPage;
  lmsAdminUsersPage: LmsAdminUsersPage;
  profileSelectionPage: ProfileSelectionPage;
  userManagementPage: UserManagementPage;
};

export const test = base.extend<PomFixtures>({
  adminPage: async ({ browser }, use) => {
    const createAdminContext = (storageState?: string) =>
      browser.newContext({
        storageState,
        viewport: VIEWPORT,
      });

    const credentials = getEnterpriseAdminCredentials();
    const hasStorageState = fs.existsSync(ENTERPRISE_STORAGE_STATE);
    let needsFreshLogin = !hasStorageState;
    let context = await createAdminContext(hasStorageState ? ENTERPRISE_STORAGE_STATE : undefined);
    let page = await context.newPage();

    if (hasStorageState) {
      await page.goto(`${appConfig.enterpriseBaseUrl}/organization/dashboard`, {
        waitUntil: 'networkidle',
      });

      const hasAuthenticatedSidebar = await page
        .getByRole('link', { name: 'Competitions' })
        .isVisible();

      if (!hasAuthenticatedSidebar) {
        await context.close();
        context = await createAdminContext();
        page = await context.newPage();
        needsFreshLogin = true;
      }
    }

    const requiresLogin = needsFreshLogin || page.url().includes('/auth/login');

    if (requiresLogin) {
      const enterpriseLoginPage = new EnterpriseLoginPage(page);
      const profileSelectionPage = new ProfileSelectionPage(page);

      await enterpriseLoginPage.goto();
      await enterpriseLoginPage.assertLoaded();
      await enterpriseLoginPage.login(credentials.email, credentials.password);
      await profileSelectionPage.assertLoaded();
      await profileSelectionPage.selectFirstOrganization();
      await context.storageState({ path: ENTERPRISE_STORAGE_STATE });
    }

    await use(page);
    await context.close();
  },
  lmsAdminPage: async ({ browser }, use) => {
    const createLmsAdminContext = (storageState?: string) =>
      browser.newContext({
        storageState,
        viewport: VIEWPORT,
      });

    const credentials = getLmsAdminCredentials();
    const hasStorageState = fs.existsSync(LMS_ADMIN_STORAGE_STATE);
    let needsFreshLogin = !hasStorageState;
    let context = await createLmsAdminContext(hasStorageState ? LMS_ADMIN_STORAGE_STATE : undefined);
    let page = await context.newPage();

    if (hasStorageState) {
      await page.goto(`${appConfig.lmsAdminBaseUrl}/admin/user`, {
        waitUntil: 'networkidle',
      });

      const hasAuthenticatedSearch = await page
        .getByRole('textbox', { name: 'First Name, Last Name, Email, Phone' })
        .isVisible();

      if (!hasAuthenticatedSearch) {
        await context.close();
        context = await createLmsAdminContext();
        page = await context.newPage();
        needsFreshLogin = true;
      }
    }

    const requiresLogin = needsFreshLogin || page.url().includes('/admin/login');

    if (requiresLogin) {
      const lmsAdminLoginPage = new LmsAdminLoginPage(page);
      const lmsAdminOtpPage = new LmsAdminOtpPage(page);

      await lmsAdminLoginPage.goto();
      await lmsAdminLoginPage.assertLoaded();
      await lmsAdminLoginPage.login(credentials.email, credentials.password);
      await lmsAdminOtpPage.assertLoaded();
      await lmsAdminOtpPage.verify(credentials.otp);
      await context.storageState({ path: LMS_ADMIN_STORAGE_STATE });
    }

    await use(page);
    await context.close();
  },
  learnerPage: async ({ browser }, use) => {
    const context = await browser.newContext({ viewport: VIEWPORT });
    const page = await context.newPage();

    await use(page);
    await context.close();
  },
  enterpriseLoginPage: async ({ adminPage }, use) => {
    await use(new EnterpriseLoginPage(adminPage));
  },
  profileSelectionPage: async ({ adminPage }, use) => {
    await use(new ProfileSelectionPage(adminPage));
  },
  competitionsPage: async ({ adminPage }, use) => {
    await use(new CompetitionsPage(adminPage));
  },
  competitionCreationPage: async ({ adminPage }, use) => {
    await use(new CompetitionCreationPage(adminPage));
  },
  userManagementPage: async ({ adminPage }, use) => {
    await use(new UserManagementPage(adminPage));
  },
  addUserPage: async ({ adminPage }, use) => {
    await use(new AddUserPage(adminPage));
  },
  learnerLoginPage: async ({ learnerPage }, use) => {
    await use(new LearnerLoginPage(learnerPage));
  },
  learnerOnboardingPage: async ({ learnerPage }, use) => {
    await use(new LearnerOnboardingPage(learnerPage));
  },
  learnerCompetitionsPage: async ({ learnerPage }, use) => {
    await use(new LearnerCompetitionsPage(learnerPage));
  },
  lmsAdminLoginPage: async ({ lmsAdminPage }, use) => {
    await use(new LmsAdminLoginPage(lmsAdminPage));
  },
  lmsAdminOtpPage: async ({ lmsAdminPage }, use) => {
    await use(new LmsAdminOtpPage(lmsAdminPage));
  },
  lmsAdminUsersPage: async ({ lmsAdminPage }, use) => {
    await use(new LmsAdminUsersPage(lmsAdminPage));
  },
  lmsAdminUserEditPage: async ({ lmsAdminPage }, use) => {
    await use(new LmsAdminUserEditPage(lmsAdminPage));
  },
});

export { expect };
