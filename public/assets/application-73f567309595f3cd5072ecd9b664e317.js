var App,__hasProp={}.hasOwnProperty,__extends=function(a,b){function d(){this.constructor=a}for(var c in b)__hasProp.call(b,c)&&(a[c]=b[c]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a};App=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return __extends(b,a),b.configure(function(){return this.use(Tower.Middleware.Agent),this.use(Tower.Middleware.Location),this.use(Tower.Middleware.Router)}),b.prototype.bootstrap=function(a){},b}(Tower.Application),window.App=(new App).initialize(),Tower.Route.draw(function(){return this.match("/",{to:"application#welcome"})})