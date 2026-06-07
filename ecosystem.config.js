module.exports = {
  apps: [
    {
      name: 'syncline-client',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 8001',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
