export const required = (val) => val !== undefined && val !== null && String(val).trim() !== "";
export const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
export const minLength = (val, len) => String(val).length >= len;
export const isNumber = (val) => !isNaN(val) && val !== "";
export const passwordsMatch = (password, confirm) => password === confirm;

export const validateForm = (fields, rules) => {
    const errors = {};
    for (const key in rules) {
        for (const rule of rules[key]) {
        const result = rule(fields[key]);
        if (!result) {
            errors[key] = errors[key] || `Invalid ${key}`;
        }
        }
    }
    return errors;
};