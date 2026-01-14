const { test, expect, chromium } = require('@playwright/test');
const fs = require('fs');
const { login } = require('./login');

const EMAIL = "teeeeet@intcore.com";
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
    'http://172.177.136.15/your-portal/home?logged=true',
    { waitUntil: 'networkidle' }
  );

  // 4️⃣ My Courses API (Bearer token)
  const coursesResponse = await page.request.get(
    'http://172.177.136.15:8080/api/v2/open-api/user/actions/my-courses?model=purchased&page=1',
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json'
      }
    }
  );

  const coursesData = await coursesResponse.json();
  const firstCourse = coursesData.data.courses.data[0];

  const courseId = firstCourse.id;
  const courseSlug = firstCourse.slug_url;

  // 5️⃣ Enroll API
  await page.request.post(
    `http://172.177.136.15:8080/api/v2/course/${courseId}/actions/enroll`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json'
      }
    }
  );

  // 6️⃣ Internal API
  const internalResponse = await page.request.get(
    `http://172.177.136.15:8080/api/v2/course/${courseSlug}/internal`,
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

  // 7️⃣ FINAL UI navigation
  // 🔥 Uses codered from session (NO Bearer token)
  await page.goto(
    `http://172.177.136.15/courseVideo/${courseSlug}?lessonId=${lessonId}&finalAssessment=false`,
    { waitUntil: 'networkidle' }
  );

  await page.pause();
});
