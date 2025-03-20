const mongoose = require('mongoose');

const generateUniqueFourDigitCode = async function () {
    let code;
    let exists = true;
    while (exists) {
        code = Math.floor(1000 + Math.random() * 9000).toString();
        exists = await mongoose.model('Clipboard').exists({ code });
    }
    return code;
};

const clipboardSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{4}$/.test(v);
            },
            message: props => `${props.value} is not a valid 4-digit code!`
        }
    },
    data: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d'
    }
});

module.exports = mongoose.model('Clipboard', clipboardSchema);
