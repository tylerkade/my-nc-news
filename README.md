# My NC NEWS

## Project Summary

The purpose of this repo is to access application data programmatically, mimicking a real world backend service.

### Installation Instructions

1. Either clone the repo via your preferred method (e.g. `git clone [URL]`) or Fork it then clone
2. In order to run the project, you must first create **two** .env files in the route directory, as shown in the table below:

<center>

| .env file        | Containing              |
| ---------------- | ----------------------- |
| .env.test        | PGDATABASE=nc_news_test |
| .env.development | PGDATABASE=nc_news      |

</center>

3. Install dependancies by running `npm install`
4. Run `npm setup-dbs` to initialise the databases
5. Run `npm run seed` to seed the databases

\
To run the tests, simply run `npm test app`

### Server Hosted version

Link: https://my-nc-news-t13l.onrender.com

## Versions

| Package name | Version |
| ------------ | ------- |
| Node.js      | v22.9.0 |
| PostgreSQL   | v16.4   |
