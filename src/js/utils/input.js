'use strict';

var Projectile = require('../entities/projectile');

var playerList = [];

document.onkeydown = function(e) {
    for (var i = 0; i < playerList.length; i++) {
        var currPlayer = playerList[i];
        if (e.keyCode === 38) {
            currPlayer.setJet(true);
        }
        if (e.keyCode === 39 && currPlayer.rotation !== 'left') {
            currPlayer.setRotation('right');
        }
        if (e.keyCode === 37 && currPlayer.rotation !== 'right') {
            currPlayer.setRotation('left');
        }
    }
};

document.onkeyup = function(e) {
    for (var i = 0; i < playerList.length; i++) {
        var currPlayer = playerList[i];
        if (e.keyCode === 38) {
            currPlayer.setJet(false);
        }
        if (e.keyCode === 39 && currPlayer.rotation !== 'left') {
            currPlayer.setRotation('none');
        }
        if (e.keyCode === 37 && currPlayer.rotation !== 'right') {
            currPlayer.setRotation('none');
        }
        if (e.keyCode === 32) {
            var projectile = new Projectile(currPlayer);
            Stage.addProjectile(projectile);
        }    
    }
};

var setupPlayerInput = function(player) {
    playerList.push(player);
};

var clearPlayerInput = function() {
    playerList = [];
};

module.exports = {
    setupPlayerInput: setupPlayerInput,
    clearPlayerInput: clearPlayerInput
};
