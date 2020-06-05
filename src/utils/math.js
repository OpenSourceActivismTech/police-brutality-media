export const clip = function(number, min, max) {
    return Math.max(min, Math.min(number, max));
};