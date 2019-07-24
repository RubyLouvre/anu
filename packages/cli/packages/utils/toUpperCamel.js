const firstLetter = /^[a-z]/;
const middleLetter = /-([a-z])/g;
module.exports = function toUpperCamel(str) {
    return str
        .replace(middleLetter, function (match, first) {
        return first.toUpperCase();
    })
        .replace(firstLetter, function (match) {
        return match.toUpperCase();
    });
};
