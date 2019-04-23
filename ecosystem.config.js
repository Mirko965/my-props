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
      user: 'ec2-user',
      host: 'ec2-18-204-252-64.compute-1.amazonaws.com',
      key: '~/.ssh/mirkoKey.pem',
      ref: 'origin/aws',
      repo: 'git@github.com:Mirko965/my-props.git',
      path: '/home/ec2-user/my-props',
      'post-deploy': 'npm install && cd ./client && npm install && npm run build && cd ../ && pm2 startOrRestart ecosystem.config.js'
    }
  }
}

