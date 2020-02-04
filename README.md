## Visitors Book

Open source web app for visitors control in a recreational center.

## How can you use this app?
- As learning  Test Driven Development
- As learning Express/Mongoose/MongoDB stack
- As starting point for your own project.

## Run locally
- Clone the project and run `npm i` to install packages.
- Install MongoDB or use MongoDB Atlas
- Configure environment for your OS or just set it with `.env` file:

`.env` :
```
#  Used for generation JWT
visitorsBook_jwtSecret=xxx

# Used as a path for log files
visitorsBook_logPath=xxx

# Used as an address for MongoDB
visitorsBook_db=xxx
```

For more information about environment you can look `config/custom-environment-variables.json` and `config/test.json`

## Documentation

Nowadays, you can use tests for examine how the project actually works. Just run `npm test` after the installation procedure.

## Todo list

- [ ] Frontend application
- [ ] MQTT broker
- [ ] Visits pagination
- [ ] Documentation
- [ ] Docker
- [ ] Roles: pupil, teacher

## Project structure

```
├── config          # Environment settings
├── middleware      # Route-level middlewares
├── models          # Mongoose models
├── routes          # Express routes
├── startup         # Modules for starting app
└── tests           # App tests
    ├── integration # tests for app integration
    └── unit        # Tests for separate units
```

## Tests coverage

```
--------------------------|---------|
File                      |  %      |
--------------------------|---------|
All files                 |     100 | 
 visitors-book            |     100 | 
  index.js                |     100 | 
 visitors-book/middleware |     100 | 
  allowed-for.js          |     100 | 
  auth.js                 |     100 | 
  error.js                |     100 | 
  index.js                |     100 | 
  third-party-app-auth.js |     100 | 
  validate-object-id.js   |     100 | 
  validate.js             |     100 | 
 visitors-book/models     |     100 | 
  third-party-access.js   |     100 | 
  user.js                 |     100 | 
  user.utils.js           |     100 | 
  visit.js                |     100 | 
 visitors-book/routes     |     100 | 
  access.js               |     100 | 
  index.js                |     100 | 
  sign-in.js              |     100 | 
  tokens.js               |     100 | 
  users.js                |     100 | 
  visits.js               |     100 | 
 visitors-book/startup    |     100 | 
  config.js               |     100 | 
  db.js                   |     100 | 
  error-catcher.js        |     100 | 
  index.js                |     100 | 
  logging.js              |     100 | 
  routes.js               |     100 | 
--------------------------|---------|
```

