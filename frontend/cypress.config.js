import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:5173',
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx}',
        supportFile: 'cypress/support/e2e.js',
        video: true,
        screenshotOnRunFailure: true,
        defaultCommandTimeout: 20000,
        env: {
            apiUrl: 'http://localhost:9090',
            adminApiUrl: 'http://localhost:9091',
            adminUsername: process.env.CYPRESS_adminUsername || process.env.CYPRESS_ADMIN_USERNAME || '',
            adminPassword: process.env.CYPRESS_adminPassword || process.env.CYPRESS_ADMIN_PASSWORD || ''
        }
    }
});
