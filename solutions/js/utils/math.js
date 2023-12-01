Array.prototype.sum = function () {
    return this.reduce((previousValue, currentValue) => previousValue += currentValue, 0);
}