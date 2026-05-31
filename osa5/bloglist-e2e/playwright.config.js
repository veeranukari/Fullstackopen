const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: [
    {
      command: 'set NODE_ENV=test&& set PORT=3004&& npm.cmd start',
      cwd: '../../osa4/blogilista',
      url: 'http://localhost:3004/api/blogs',
      reuseExistingServer: !process.env.CI,
      timeout: 120000
    },
    {
      command: 'set BACKEND_URL=http://127.0.0.1:3004&& npm.cmd run dev -- --host 127.0.0.1 --port 5174',
      cwd: '../bloglist-frontend',
      url: 'http://localhost:5174',
      reuseExistingServer: !process.env.CI,
      timeout: 120000
    }
  ]
})
