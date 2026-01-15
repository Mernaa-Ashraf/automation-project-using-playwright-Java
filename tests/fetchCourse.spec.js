const { test, expect, chromium } = require('@playwright/test');
const fs = require('fs');
const { login } = require('./login');

const EMAIL = "lancelot.larue@dropmeon.com";
const PASSWORD = "Fadysaber1!";
const STORAGE_FILE = './user-session.json';
const API_TOKEN_FILE = './api-token.json';

test('UI session (codered) + API token → course video', async () => {

  const browser = await chromium.launch({ headless: false });
  let context;
  let page;

  // 1️⃣ Load UI session or login once
  if (fs.existsSync(STORAGE_FILE)) {
    context = await browser.newContext({ storageState: STORAGE_FILE });
  } else {
    context = await browser.newContext();
    page = await context.newPage();
    await login(page, EMAIL, PASSWORD);
  }

  if (!page) page = await context.newPage();

  // 2️⃣ Read API token (ONLY for APIs)
  const { apiToken } = JSON.parse(
    fs.readFileSync(API_TOKEN_FILE, 'utf-8')
  );

  expect(apiToken).toBeTruthy();

  // 3️⃣ UI navigation → uses codered from session automatically
  await page.goto(
    'https://uat-learn.eccouncil.org/your-portal/home?logged=true',
    { waitUntil: 'networkidle' }
  );

  // 4️⃣ My Courses API (Bearer token)
  const coursesResponse = await page.request.get(
    'https://uat-eccladmin.eccouncil.org/api/v2/open-api/user/actions/my-courses?model=free&page=1&search=&preventLoading=false&skill_level%5B%5D=&category%5B%5D=&job_role%5B%5D=&tags%5B%5D=&competencies%5B%5D=&jobRoles_Page=1&competencies_page=1&tags_page=1',
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json'
      }
    }
  );

  const coursesData = await coursesResponse.json();
  const firstCourse = coursesData.data.courses.data[3]

  const courseId = firstCourse.id;
  const courseSlug = firstCourse.slug_url;

  // 5️⃣ Enroll API
  await page.request.post(
    `https://uat-eccladmin.eccouncil.org/api/v2/course/${courseId}/actions/enroll`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json'
      }
    }
  );

  // 6️⃣ Internal API
  const internalResponse = await page.request.get(
    `https://uat-eccladmin.eccouncil.org/api/v2/course/${courseSlug}/internal`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json'
      }
    }
  );

  const internalData = await internalResponse.json();
  const lessonId =
    internalData.data.course.chapters[0].lessons[0].id;

  await page.goto(
    `https://uat-learn.eccouncil.org/courseVideo/${courseSlug}?lessonId=${lessonId}&finalAssessment=false`,
    { waitUntil: 'networkidle' }
  );
   const vimeoFrame = page.frameLocator('iframe[src*="player.vimeo.com"]');

  // Play video
  //await vimeoFrame.locator('button[aria-label="Play"]').click();

  // Open subtitles menu
  /*const ccButton = vimeoFrame.locator('button[aria-label*="Subtitles"]');
  await expect(ccButton).toBeVisible();
  await ccButton.click();

  // Select subtitle
  await vimeoFrame.locator('[role="menuitem"]').first().click();

  // Validate subtitles appear
  const subtitles = vimeoFrame.locator('.vjs-text-track-display');
  await expect(subtitles).toBeVisible();

  const text1 = await subtitles.innerText();
  expect(text1.trim().length).toBeGreaterThan(0);

  // Validate subtitles update
  await page.waitForTimeout(3000);
  const text2 = await subtitles.innerText();
  expect(text2).not.toEqual(text1);  */
  await page.pause();
});
