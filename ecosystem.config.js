module.exports = {
  apps: [
    {
      name: "frs-gmr",
      script: "npm",
      args: "start",
      env: {
        PORT: 8000,
        NODE_ENV: "production",
      },
    },
  ],
};
