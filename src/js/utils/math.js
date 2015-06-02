var Constants = require('../constants');

var width = Stage.width;
var height = Stage.height;
var scale = width / 100;   // Multiplicative factor for determining absolute value

var calcAbsoluteScalar = function(scalar) {
    return scalar * scale;
};

var calcRelativeScalar = function(scalar) {
    return scalar / scale;
};

/* Convert a relative vector to an absolute vector using scale */
var calcAbsoluteVector = function(vector) {
    vector.x = calcAbsoluteScalar(vector.x);
    vector.y = calcAbsoluteScalar(vector.y);

    if (vector.x > width) {
        vector.x -= width;
    }
    if (vector.x < 0) {
        vector.x += width;
    }
    if (vector.y > height) {
        vector.y -= height;
    }
    if (vector.y < 0) {
        vector.y += height;
    }

    return vector;
};

/* Convert an absolute vector to a relative vector using scale */
var calcRelativeVector = function(vector) {
    vector.x = calcRelativeScalar(vector.x);
    vector.y = calcRelativeScalar(vector.y);

    if (vector.x > Constants.RELATIVE_X_MAX) {
        vector.x -= Constants.RELATIVE_X_MAX;
    }
    if (vector.x < 0) {
        vector.x += Constants.RELATIVE_X_MAX;
    }
    if (vector.y > Constants.RELATIVE_Y_MAX) {
        vector.y -= Constants.RELATIVE_Y_MAX;
    }
    if (vector.y < 0) {
        vector.y += Constants.RELATIVE_Y_MAX;
    }

    return vector;
};

module.exports = {
    calcAbsoluteScalar: calcAbsoluteScalar,
    calcAbsoluteVector: calcAbsoluteVector,
    calcRelativeScalar: calcRelativeScalar,
    calcRelativeVector: calcRelativeVector
};
