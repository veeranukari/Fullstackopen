const { test, expect, beforeEach, describe } = require('@playwright/test')

const apiUrl = 'http://localhost:3004/api'

const loginWith = async (page, username, password) => {
  await page.goto('/login')
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'create new' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    const resetResponse = await request.post(`${apiUrl}/testing/reset`)
    expect(resetResponse.status()).toBe(204)

    const userResponse = await request.post(`${apiUrl}/users`, {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    expect(userResponse.status()).toBe(201)

    await page.goto('/')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong-password')

      await expect(page.getByText('wrong username/password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      const title = `End to end testing with Playwright ${Date.now()}`

      await createBlog(
        page,
        title,
        'Matti Luukkainen',
        'https://fullstackopen.com/'
      )

      await expect(page.locator('.blog').filter({
        hasText: `${title} Matti Luukkainen`
      }).first()).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      const title = `Likeable blog ${Date.now()}`

      await createBlog(page, title, 'Matti Luukkainen', 'https://example.com/likeable')

      await page.getByRole('link', { name: `${title} Matti Luukkainen` }).click()
      await expect(page.locator('.blog')).toContainText('likes 0')
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.locator('.blog')).toContainText('likes 1')
    })

    test('the user who created a blog can delete it', async ({ page }) => {
      const title = `Disposable blog ${Date.now()}`

      await createBlog(page, title, 'Matti Luukkainen', 'https://example.com/disposable')

      await page.getByRole('link', { name: `${title} Matti Luukkainen` }).click()
      page.once('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete' }).click()

      await expect(page.locator('.blog').filter({ hasText: `${title} Matti Luukkainen` })).not.toBeVisible()
    })
  })
})
