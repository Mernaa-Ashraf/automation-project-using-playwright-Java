import { requireEnv } from '../utils/env';

export interface Credentials {
  email: string;
  password: string;
}

export interface LmsAdminCredentials extends Credentials {
  otp: string;
}

export interface NewUserData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface CompetitionScenario {
  competitionName: string;
  existingParticipantEmail: string;
  learnerPassword: string;
  learnerUser: NewUserData;
  templateTitle: string;
}

export const appConfig = {
  enterpriseBaseUrl: process.env.ENTERPRISE_BASE_URL?.trim() || 'http://20.1.140.13',
  learnerBaseUrl: process.env.LEARNER_BASE_URL?.trim() || 'http://172.177.136.15',
  lmsAdminBaseUrl: process.env.LMS_ADMIN_BASE_URL?.trim() || 'http://172.177.136.15:8080',
};

export function getEnterpriseAdminCredentials(): Credentials {
  return {
    email: requireEnv('ENTERPRISE_ADMIN_EMAIL'),
    password: requireEnv('ENTERPRISE_ADMIN_PASSWORD'),
  };
}

export function getLmsAdminCredentials(): LmsAdminCredentials {
  return {
    email: requireEnv('LMS_ADMIN_EMAIL'),
    password: requireEnv('LMS_ADMIN_PASSWORD'),
    otp: requireEnv('LMS_ADMIN_OTP'),
  };
}

export function buildCompetitionScenario(adminEmail: string): CompetitionScenario {
  const runId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const learnerEmailDomain = process.env.LEARNER_EMAIL_DOMAIN?.trim() || 'mailinator.com';
  const learnerEmailPrefix = process.env.LEARNER_EMAIL_PREFIX?.trim() || 'codex.learner';
  const learnerLastNameBase = process.env.LEARNER_LAST_NAME?.trim() || 'newUser';
  const learnerLastNameSuffix = runId
    .slice(-6)
    .replace(/\d/g, (digit) => 'abcdefghij'[Number(digit)]);

  return {
    competitionName: `Codex Competition ${runId}`,
    existingParticipantEmail: adminEmail,
    learnerPassword: requireEnv('LEARNER_DEFAULT_PASSWORD'),
    learnerUser: {
      firstName: process.env.LEARNER_FIRST_NAME?.trim() || 'Ahmed',
      lastName: `${learnerLastNameBase}${learnerLastNameSuffix}`,
      email: `${learnerEmailPrefix}.${runId}@${learnerEmailDomain}`,
    },
    templateTitle: 'E-Commerce Exploitathon: Hunting Third-Party Threats',
  };
}
