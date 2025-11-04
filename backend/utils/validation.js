/**
 * Utility functions for input validation
 * This file can be replaced with Zod or another validator library in the future
 */

/**
 * Validates an email address using regex
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
    // RFC 5322 compliant email regex
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {object} - Validation result with isValid and message
 */
function validatePassword(password) {
    if (!password) {
        return { isValid: false, message: "Password is required" };
    }
    
    if (password.length < 6) {
        return { isValid: false, message: "Password must be at least 6 characters long" };
    }
    
    // Add more password requirements as needed
    // Example: require at least one number
    // if (!/\d/.test(password)) {
    //     return { isValid: false, message: "Password must contain at least one number" };
    // }
    
    return { isValid: true, message: "" };
}

/**
 * Validates a username
 * @param {string} username - The username to validate
 * @returns {object} - Validation result with isValid and message
 */
function validateUsername(username) {
    if (!username) {
        return { isValid: false, message: "Username is required" };
    }
    
    if (username.length < 3) {
        return { isValid: false, message: "Username must be at least 3 characters long" };
    }
    
    // Only allow alphanumeric characters and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { isValid: false, message: "Username can only contain letters, numbers, and underscores" };
    }
    
    return { isValid: true, message: "" };
}

/**
 * Validates user signup data
 * @param {object} userData - User data to validate
 * @returns {object} - Validation result with isValid and message
 */
function validateSignupData(userData) {
    const { email, password, username } = userData;
    
    // Check required fields
    if (!email || !password || !username) {
        return { isValid: false, message: "Missing required fields" };
    }
    
    // Validate email
    if (!validateEmail(email)) {
        return { isValid: false, message: "Invalid email format" };
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return passwordValidation;
    }
    
    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
        return usernameValidation;
    }
    
    return { isValid: true, message: "" };
}

/**
 * Validates user login data
 * @param {object} userData - User data to validate
 * @returns {object} - Validation result with isValid and message
 */
function validateLoginData(userData) {
    const { email, password } = userData;
    
    // Check required fields
    if (!email || !password) {
        return { isValid: false, message: "Missing required fields" };
    }
    
    // Validate email
    if (!validateEmail(email)) {
        return { isValid: false, message: "Invalid email format" };
    }
    
    return { isValid: true, message: "" };
}

module.exports = {
    validateEmail,
    validatePassword,
    validateUsername,
    validateSignupData,
    validateLoginData
};
