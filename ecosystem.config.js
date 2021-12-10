module.exports = {
  apps: [
    {
      name: "API",
      script: "src/app.js",
      instances: "max",
      autorestart: true,
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
