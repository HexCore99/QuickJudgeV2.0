from playwright.sync_api import sync_playwright,expect

def test_student_login():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False,
                                    executable_path=r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe")
        page = browser.new_page()
        page.goto("http://localhost:5173/login")
        page.wait_for_timeout(2000)

        page.locator('xpath=/html/body/div/div/section/div/div[2]/form/div[1]/label/div/input').fill("slur@gmail.com")

        page.wait_for_timeout(2000)
        page.locator('xpath=/html/body/div/div/section/div/div[2]/form/div[2]/label/div/input').fill("123456")
        page.wait_for_timeout(2000)

        page.locator('xpath=/html/body/div/div/section/div/div[2]/form/button').click()
        page.wait_for_timeout(2000)

        expect(page).to_have_url("http://localhost:5173/student/contests") 
        page.wait_for_timeout(2000)

test_student_login()