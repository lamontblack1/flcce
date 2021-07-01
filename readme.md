# [FLCCE Condo Manager](https://flcce.com/)

## A Live Small Condo Management Website

This is my first fully deployed website. It is currently being used by our condominium association.

# Why this project was needed

This website has a homepage allowing for a monthly newsletter and display of a large amount of information, some necessary and some useful, for all unit owners. The website also allows unit owners to log in using guest credentials to view contact information for all owners. Board members can use other credentials to allow them to log basic transactions of monies coming in and going out. In response to a necessary class project, I opted for a real-world need to complete my assignment. Future updates will feature printable reports of queried information.

# Technologies Used

## Server-Side Libraries Used

- [npm express](https://www.npmjs.com/package/express) with [dotenv](https://www.npmjs.com/package/dotenv)
- [npm express-handlebars](https://www.npmjs.com/package/express-handlebars)
- [npm sequelize](https://www.npmjs.com/package/sequelize)
- [MySql Database](https://www.mysql.com/), initiated with [sequelize-cli](https://www.npmjs.com/package/sequelize-cli) and deployed with [JawsDB](https://devcenter.heroku.com/articles/jawsdb) for storage of owner contact and financial transaction information
- [router middleware exploited by express](https://expressjs.com/en/guide/routing.html)
- [JSON body parsing exploited by express](http://expressjs.com/en/resources/middleware/body-parser.html)
- [passport](https://www.npmjs.com/package/passport), [passport-local](https://www.npmjs.com/package/passport-local), [bcryptjs](https://www.npmjs.com/package/bcryptjs) and [express-session](https://www.npmjs.com/package/express-session) to enable authentication and session functionality
- [connect-flash](https://www.npmjs.com/package/connect-flash) for provisional messages in connection with failed authentication attempts
- [axios](https://www.npmjs.com/package/axios) and [cheerio](https://www.npmjs.com/package/cheerio) to scrape local grocery store website for buy-one-get-one free items.
- [prettier](https://www.npmjs.com/package/prettier) to keep the code looking nice

## For Rendering Client-Side

- JavaScript
- CSS
- HTML
- Bootstrap
- JQuery
- JQuery ajax requests to openweather API to display current local weather information on the homepage
- [Luxon](https://moment.github.io/luxon/) for date manipulation

# How users can get started with this project

Simply click the "FLCCE Condo Manager" link at the top of this readme page. See below for a sample of functionality that only authenticated users can make use of.

# Screen Shots of the Working App

### Here is a view of authentication using Flash:

![Authentication gif](https://github.com/lamontblack1/flcce/public/img/example1.gif)

### Here is a a view of data entry:

![Transaction Entry Gif](https://github.com/lamontblack1/flcce/public/img/example1.gif)

Note that the Sub Department dropdown populates based on the Department dropdown choice
