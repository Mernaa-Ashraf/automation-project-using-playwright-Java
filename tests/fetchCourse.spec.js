const { test, expect, chromium } = require('@playwright/test');
const fs = require('fs');
const { login } = require('./login');

const EMAIL = "Enid.Murray@yahoo.com";
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
 // await page.goto(
   // 'https://uat-learn.eccouncil.org/your-portal/home?logged=true',
    //{ waitUntil: 'networkidle' }
 // );

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
  const firstCourse = coursesData.data.courses.data[0]

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
  const lessonId =internalData.data.course.chapters[0].lessons[0].id;
    

//for brightcove - cert
    /*await page.goto("https://uat-learn.eccouncil.org/courseVideo/certified-chief-information-security-officer-cciso?lessonId=af45a59a-add3-4e9b-8dd0-3b5941ab36af&finalAssessment=false",{waitUntil:'networkidle'})
   const ok = page.locator(
  'xpath=/html/body/app-root/div/main/div/app-lesson/div[2]/div/div[3]/div[2]/app-video-lesson/div[1]/app-internal-viedo-player/div/app-interanl-brightcove-player/div/div/div/video-js/div[7]/div/div/div[2]/button'
);

await ok.click();

     await page.locator("#vjs_video_3 > button").click()
    const play=await page.locator("#vjs_video_3_html5_api").click() */

  await page.goto(
    `https://uat-learn.eccouncil.org/courseVideo/${courseSlug}?lessonId=${lessonId}&finalAssessment=false`,
    { waitUntil: 'networkidle' }
  );
  //task to go to ch2 and choose lesson from it
  //page.locator('div').filter({ hasText: /^Benefits of SAN and NAS Storage$/ }).first().click();
   const vimeoFrame = page.frameLocator('iframe[src*="player.vimeo.com"]');
   
// locate & play video 
   const play = vimeoFrame.getByRole('button', { name: 'play' });
   await play.click()


   // make sure it is playing (Pause becomes visible/enabled)
const pauseBtn = vimeoFrame.getByRole('button', { name: 'Pause' });
await expect(pauseBtn).toBeVisible();

// wait 10 seconds real time
await page.waitForTimeout(10_000);

await pauseBtn.click();

await page.pause()


  
  //const settings=vimeoFrame.getByRole('button', { name: 'Settings' })
  //await settings.click()

});
