var async,
  _this = this;

async = require('async');

async.series([], function(error) {
  if (error) {
    console.log("Something went wrong creating seed data... Try changing something and running again.");
  } else {
    console.log("Successfully created seed data!");
  }
  return process.exit();
});
