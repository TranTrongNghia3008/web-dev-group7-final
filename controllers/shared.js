// shared.js

function sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    // Loại bỏ các ký tự nguy hiểm
    const sanitizedInput = input.replace(/[=\\'"/<>]/g, '');

    return sanitizedInput;
}

module.exports = {
    sanitizeInput
};
