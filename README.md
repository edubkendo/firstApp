# (Tower) on Rails Tutorial: first application

This is the first application for 
[*Ruby on Rails Tutorial: Learn Rails by Example*](http://railstutorial.org/)
by [Michael Hartl](http://michaelhartl.com/). 

However, instead of using Ruby on Rails, I am following along but using Coffeescript, Node,
and particularly, the [*Tower.js*](http://towerjs.org/) framework, which was modeled quite closely on rails. It is my plan to not only learn Tower by doing so, but also to document the differences for those following in my footsteps. So far:

## Chapter 1

npm install -g tower

tower new firstApp
(follow js/node convention of using camelCase filenames)

cd firstApp

npm install .
(instead of running Bundle Install)

tower server -e development

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

cake assets:bundle

install [*Heroku Toolbelt*](https://toolbelt.herokuapp.com) 

On Ubuntu Linux that command is:

```
wget -qO- https://toolbelt.heroku.com/install.sh | sh
```

Verify app will run with: foreman start

Check http://localhost:5000/

## Chapter 2

tower new demoApp
(follow js/node convention of using camelCase filenames)

cd demoApp

npm install .
(follow js/node convention of using camelCase filenames)

tower generate scaffold User name: string email: string hasMany:posts
(notice we specify the relationship within the scaffolding command)

cake db:seed

tower server -e development
(starts server, app is viewable at http://localhost:3000/)
*Note that while most of the url's match up with those in Hartl's tutorial, users/1 and users/index produce an error. The unique id's for the users do not begin with '1', but rather with a very large seemingly random number. In this particular case, the first user is at: http://localhost:3000/users/4f98efc613959d942f000001 .
Later we need to look into why this is so. Is this number predictable so that we can use it programatically?
