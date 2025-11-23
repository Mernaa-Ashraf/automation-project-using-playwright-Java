import{test,expect} from '@playwright/test' ;
test('Register page has titles and links', async({page})=>{
 
await page.goto("https://uat-learn.eccouncil.org/?logged=false")
const form=await page.getByText('Create Your Free Account Get')
await expect(form).toBeVisible();

const create_title=await page.locator('body > app-root > div > main > div > app-home > app-home-header > section > div > div.cpt-20.row.justify-content-center.cgap-12 > div.col-lg-8.offset-lg-2.offset-xl-0.col-xl-4.col-12.my-xl-0.my-5.position-relative > app-register-card > div > h4')
await expect(create_title).toBeVisible();

const create_text=await page.locator('body > app-root > div > main > div > app-home > app-home-header > section > div > div.cpt-20.row.justify-content-center.cgap-12 > div.col-lg-8.offset-lg-2.offset-xl-0.col-xl-4.col-12.my-xl-0.my-5.position-relative > app-register-card > div > p')
await expect(create_text).toBeVisible();

const firstname= await page.locator('body > app-root > div > main > div > app-home > app-home-header > section > div > div.cpt-20.row.justify-content-center.cgap-12 > div.col-lg-8.offset-lg-2.offset-xl-0.col-xl-4.col-12.my-xl-0.my-5.position-relative > app-register-card > div > form > app-input:nth-child(1) > div > div > input')
await expect(firstname).toBeVisible();
const lastname= await page.locator('body > app-root > div > main > div > app-home > app-home-header > section > div > div.cpt-20.row.justify-content-center.cgap-12 > div.col-lg-8.offset-lg-2.offset-xl-0.col-xl-4.col-12.my-xl-0.my-5.position-relative > app-register-card > div > form > app-input:nth-child(2) > div > div > input')
await expect(lastname).toBeVisible();
const email=await page.locator('body > app-root > div > main > div > app-home > app-home-header > section > div > div.cpt-20.row.justify-content-center.cgap-12 > div.col-lg-8.offset-lg-2.offset-xl-0.col-xl-4.col-12.my-xl-0.my-5.position-relative > app-register-card > div > form > app-input-email > div > div > input')
await expect(email).toBeVisible();
const password=await page.locator('body > app-root > div > main > div > app-home > app-home-header > section > div > div.cpt-20.row.justify-content-center.cgap-12 > div.col-lg-8.offset-lg-2.offset-xl-0.col-xl-4.col-12.my-xl-0.my-5.position-relative > app-register-card > div > form > app-input.register-input-style.remove-validation-error-icon.custom-input-placeholder-color.radius-8 > div > div > input')
await expect(password).toBeVisible();

const checkbox=await page.locator('body > app-root > div > main > div > app-home > app-home-header > section > div > div.cpt-20.row.justify-content-center.cgap-12 > div.col-lg-8.offset-lg-2.offset-xl-0.col-xl-4.col-12.my-xl-0.my-5.position-relative > app-register-card > div > form > app-checkbox > div > div > label > input')
await expect(checkbox).toBeVisible();
await expect(checkbox).toBeEnabled();
const checkboxTEXT= await page.locator('body > app-root > div > main > div > app-home > app-home-header > section > div > div.cpt-20.row.justify-content-center.cgap-12 > div.col-lg-8.offset-lg-2.offset-xl-0.col-xl-4.col-12.my-xl-0.my-5.position-relative > app-register-card > div > form > app-checkbox > div > div > p > label')
await expect(checkboxTEXT).toHaveText("I agree to the Terms & Conditions and Privacy Policy");
const TermsLINK=await page.locator('body > app-root > div > main > div > app-home > app-home-header > section > div > div.cpt-20.row.justify-content-center.cgap-12 > div.col-lg-8.offset-lg-2.offset-xl-0.col-xl-4.col-12.my-xl-0.my-5.position-relative > app-register-card > div > form > app-checkbox > div > div > p > label > a:nth-child(1)')

await expect(TermsLINK).toBeVisible();
await expect(TermsLINK).toBeEnabled();
/*await Promise.all([
    page.waitForURL('http://172.177.136.15/?logged=false'),
    TermsLINK.click(),
])*/
//check children with that parent
const heading = page.getByRole('heading', { name: 'Build Cybersecurity Skills' })
await expect(heading).toBeVisible();
await expect(heading).toHaveText(" Build Cybersecurity Skills Online ");

const subtitle_of_page=await page.getByText('Get started with a free')
await expect(subtitle_of_page).toHaveText("Get started with a free account and gain immediate access to 20+ complete cybersecurity courses from the creators of the Certified Ethical Hacker (CEH) program.")
const sub2title_of_page=await page.getByText('Join over 1 million students')
await expect(sub2title_of_page).toHaveText("Join over 1 million students from the most renowned companies in the world")
const image=await page.locator('img').nth(4)
await expect(image).toBeVisible()
const header =await page.getByRole('heading', { name: 'The World’s Largest Online' })
await expect(header).toHaveText("The World’s Largest Online Cybersecurity Library.")
const content2=await page.getByText('Learn the cybersecurity')
await expect(content2).toHaveText("Learn the cybersecurity skills that will make you stand out from your peers—from ethical hacking essentials and fundamentals of programming to advanced penetration testing and digital forensics. Get immediate access to 20+ complete cybersecurity courses for free.")
const box=page.locator('.py-2.slide.slick-slide.slick-current').first()
await expect(box).toBeVisible()
const coursetag=page.getByRole('paragraph').filter({ hasText: 'Short Course' }).first()
await expect(coursetag).toBeVisible()
const coursetitle=page.getByRole('paragraph').filter({ hasText: 'Agile Product Management: A' })
await expect(coursetitle).toHaveText("Agile Product Management: A Concise Introduction")
const subtitles=page.getByText('Software Development').nth(4)
await expect(subtitles).toHaveText("Software Development")
const tags=page.getByText('Beginner30 mins4.8').first()
await expect(tags).toBeVisible()
const image_tag_course=await page.locator('.py-2.slide.slick-slide.slick-current > app-course-card > .pointer > .d-flex.flex-column > .mt-auto > div > div > .mr-1').first()
await expect(image_tag_course).toBeVisible()
const level=page.getByText('Beginner').nth(2)
await expect(level).toHaveText("Beginner")
const course_Tag= await page.getByRole('img').nth(3)
await expect(course_Tag).toBeVisible()
const rate=page.getByText('4.8').nth(2)
await expect(rate).toBeVisible()
const backbutton=page.locator('.fas.arrow-left').first()
await expect(backbutton).toBeVisible()
await expect(backbutton).toBeEnabled()
const time=page.getByRole('img').nth(2)
await expect(time).toBeVisible()
const timevalue=page.getByText('mins').nth(1)
await expect(timevalue).toBeVisible
const nextbutton=page.locator('.fas.arrow-left').first()
await expect(nextbutton).toBeVisible()
await expect(nextbutton).toBeEnabled()


page.pause();
});