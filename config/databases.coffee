module.exports =
  mongodb:
    development:
      name: "demo-app-development"
      port: 27017
      host: "127.0.0.1"
    test:
      name: "demo-app-test"
      port: 27017
      host: "127.0.0.1"
    staging:
      name: "demo-app-staging"
      port: 27017
      host: "127.0.0.1"
    production:
      name: "app1231231"
      port: 12123
      host: "vinegar.mongohq.com"
      username: "user"
      password: "mymongohqpass"
    
  redis:
    development:
      name: "demo-app-development"
      port: 6397
      host: "127.0.0.1"
    test:
      name: "demo-app-test"
      port: 6397
      host: "127.0.0.1"
    staging:
      name: "demo-app-staging"
      port: 6397
      host: "127.0.0.1"
    production:
      name: "demo-app-production"
      port: 6397
      host: "127.0.0.1"
