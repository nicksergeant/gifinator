'use strict';

var exec = require('child_process').exec;
var five = require('johnny-five');
var Spark = require('spark-io');
var request = require('request');

var board = new five.Board({
  io: new Spark({
    token: process.env.SPARK_TOKEN,
    deviceId: process.env.SPARK_DEVICE_ID
  })
});

console.log('Using SPARK_TOKEN ' + process.env.SPARK_TOKEN + '.');
console.log('Using SPARK_DEVICE_ID ' + process.env.SPARK_DEVICE_ID + '.');

board.on('ready', function() {

  console.log('Spark ready. Standby for GIFs...');

  var button = new five.Button('D5');
  var gifs;
  var led = new five.Led('D7');

  board.repl.inject({
    button: button
  });

  request('http://gifs.is/api/items', function (err, response, body) {
    gifs = JSON.parse(body.replace(')]}\',\n', ''));
    console.log(' - GIFs ready.');
  });

  button.on('down', function() {
    led.on();
    if (gifs.length) {
      var randGif = gifs[Math.floor(Math.random() * gifs.length) + 0].url;
      exec('open ' + randGif);
    }
  });

  button.on('up', function() {
    led.off();
  });

});
