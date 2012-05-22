# (Tower) on Rails Tutorial: first application

This is the first application for 
[*Ruby on Rails Tutorial: Learn Rails by Example*](http://railstutorial.org/)
by [Michael Hartl](http://michaelhartl.com/). 

However, instead of using Ruby on Rails, I am following along but using Coffeescript, Node,
and particularly, the [*Tower.js*](http://towerjs.org/) framework, which was modeled quite closely on rails. It is my plan to not only learn Tower by doing so, but also to document the differences for those following in my footsteps. So far:

## Chapter 1

```
npm install -g tower

tower new firstApp
```
(follow js/node convention of using camelCase filenames)

```
cd firstApp

npm install .
```

(instead of running Bundle Install)

```
tower server -e development
```

### To Get App on Heroku

removed the following lines from the .gitignore file:

public/assets/*.css

public/assets/*.js

public/javascripts/

public/stylesheets/

First, copy 

./node_modules/tower/test/example/public/javascripts/vendor/javascripts/chai.js 

to 'public/javascripts/vendor/javascripts/chai.js' . 

**If there is already a copy of chai.js there, this may have already been fixed.

```
cake assets:bundle
```

install [*Heroku Toolbelt*](https://toolbelt.herokuapp.com) 

On Ubuntu Linux that command is:

```
wget -qO- https://toolbelt.heroku.com/install.sh | sh
```

Verify app will run with: 

```
foreman start
```

Check http://localhost:5000/

```
git add .

git commit -m "init"

heroku create --stack cedar

git push heroku master

heroku ps:scale web=1

heroku addons:add mongohq:free
```

* To use heroku addons like mongohq:free, you are required to "verify" your account by providing a credit * 

* card number.  I used an old Visa Gift Card I had, which may or may not have had a dollar or two left on it *

* (literally, there would have been less than three dollars.) They claim they do not charge the card at all- *

* unless you add paid services. I believe this is likely true, because I doubt this card would have *

* worked otherwise. *

### To finish setting up on heroku:

Login to heroku website, go to myApps, pick app, click on "Add ons", click on MongoHQ. On MongoHQ 

website, click Database Users tab. Click "Add a user". Add username and password. Go to "Database 

Info" tab.  Now, in /config/databases.coffee set it as follows: Under production, name is set to 

Database from the MongoHQ site. If your Mongo URI is:

mongodb://<user>:<password>@vinegar.mongohq.com:12123/app1231231

Then "name" would be "app1231231", port would be 12123, host: vinegar.mongohq.com, and the username 

and password strings would be for the database user you just set up on the mongohq website,

*NOT your heroku username and password.*

Example:

```
module.exports =
  mongodb:
    development:
      name: "first-app-development"
      port: 27017
      host: "127.0.0.1"
    test:
      name: "first-app-test"
      port: 27017
      host: "127.0.0.1"
    staging:
      name: "first-app-staging"
      port: 27017
      host: "127.0.0.1"
    production:
      name: "app1231231"
      port: 12123
      host: "vinegar.mongohq.com"
      username: "user"
      password: "mymongohqpass"
```
now:

```
git add .

git commit -am "message"

git push heroku master

heroku ps:scale web=1

heroku ps
```

If it's running, go check out your site!

Mine is at http://empty-fog-4813.herokuapp.com though it doesn't do anything.

*If at any point the push to heroku hangs or fails because of the forever*

*module, just ctrl-c after waiting a reasonable amount of time and try again. It may take a few tries.*

