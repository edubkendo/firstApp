var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

App.ApplicationController = (function(_super) {

  __extends(ApplicationController, _super);

  function ApplicationController() {
    return ApplicationController.__super__.constructor.apply(this, arguments);
  }

  return ApplicationController;

})(Tower.Controller);
