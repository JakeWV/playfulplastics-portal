module.exports = {
  apps: [{
    name: 'portal',
    script: 'node_modules/.bin/next',
    args: 'dev --port 3000 --no-turbopack',
    cwd: '/var/www/playfulplastics-portal',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'development',
      PORT: '3000'
    }
  }]
};