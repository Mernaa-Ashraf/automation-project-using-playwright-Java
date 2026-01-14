const { test, expect, chromium } = require('@playwright/test');
const fs = require('fs');

const EMAIL = 'teeeeet@intcore.com';
const PASSWORD = 'Fadysaber1!';
const STORAGE_FILE = './user-session.json';

const payload = { Email: EMAIL, password: PASSWORD };

test('Session-based route + API enrollment → course video', async () => {
  const browser = await chromium.launch({ headless: false });
  let context;
  let page;

  if (fs.existsSync(STORAGE_FILE)) {
    context = await browser.newContext({ storageState: STORAGE_FILE });
  } else {
    throw new Error('Session file missing. UI login must be done once manually.');
  }

  page = await context.newPage();

  // (NO login again)
  await page.goto('http://172.177.136.15/your-portal/home?logged=true', {
    waitUntil: 'networkidle',
  });

  //  check → user is logged in
  await expect(page.locator('text=Upgrade To Pro')).toBeVisible();

  // login API → get fresh Bearer token (API ONLY)
  const loginResponse = await page.request.post(
    'http://172.177.136.15:8080/api/v2/user/auth/regular/login',
    {
      data: payload,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  expect(loginResponse.ok()).toBeTruthy();
  const loginData = await loginResponse.json();
  const authToken = loginData.data.access_token;
  expect(authToken).toBeTruthy();

  console.log('✅ API token acquired');

  //  Get purchased courses (API auth)
  const coursesResponse = await page.request.get(
    'http://172.177.136.15:8080/api/v2/open-api/user/actions/my-courses?model=purchased&page=1',
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
    }
  );

  expect(coursesResponse.ok()).toBeTruthy();
  const coursesData = await coursesResponse.json();

  const course = coursesData.data.courses.data[0];
  const courseId = course.id;
  const courseSlug = course.slug_url;

  console.log('✅ Course:', courseSlug);

  // Enroll user (API)
  const enrollResponse = await page.request.post(
    `http://172.177.136.15:8080/api/v2/course/${courseId}/actions/enroll`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
    }
  );

  expect(enrollResponse.ok()).toBeTruthy();
  console.log('✅ Enrolled via API');

  
  await page.reload({ waitUntil: 'networkidle' });

  //  Get internal course structure
  const internalResponse = await page.request.get(
    `http://172.177.136.15:8080/api/v2/course/${courseSlug}/internal`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
    }
  );

  expect(internalResponse.ok()).toBeTruthy();
  const internalData = await internalResponse.json();

  const lessonId =
    internalData.data.course.chapters[0].lessons[0].id;

  console.log('✅ Lesson ID:', lessonId);

  // Navigate to VIDEO ROUTE (SESSION-BASED)
  await page.goto(
    `http://172.177.136.15/courseVideo/${courseSlug}?lessonId=${lessonId}&finalAssessment=false`,
    { waitUntil: 'networkidle' }
  );

  //  last require > video 

  await page.pause(); 
});
