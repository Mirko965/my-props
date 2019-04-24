module.exports = {

  apps : [
    {
      name: "my-props",
      script: "./server.js",
      watch: true,
    }
  ],
  deploy: {
    production: {
      user: 'centos',
      host: 'ec2-34-195-199-8.compute-1.amazonaws.com',
      key: '~/.ssh/centos7.pem',
      ref: 'origin/aws',
      repo: 'https://github.com/Mirko965/my-props.git',
      path: '/home/centos/my-props',
      'post-deploy': 'npm install && cd ./client && npm install && npm run build && cd ../ && pm2 startOrRestart ecosystem.config.js'
    }
  }
}

