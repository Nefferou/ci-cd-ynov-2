require('dotenv').config();
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env.TEST_ADMIN_EMAIL = process.env.CYPRESS_TEST_ADMIN_EMAIL;
      config.env.TEST_ADMIN_PASSWORD = process.env.CYPRESS_TEST_ADMIN_PASSWORD;
      return config;
    },
  },
});
