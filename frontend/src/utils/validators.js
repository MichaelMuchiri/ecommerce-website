export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.length >= 2 && name.length <= 50;
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return !phone || re.test(phone);
};

export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];

    if (fieldRules.required && !value) {
      errors[field] = `${field} is required`;
    } else if (value) {
      if (fieldRules.minLength && value.length < fieldRules.minLength) {
        errors[field] = `${field} must be at least ${fieldRules.minLength} characters`;
      }
      if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        errors[field] = `${field} must be less than ${fieldRules.maxLength} characters`;
      }
      if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
        errors[field] = fieldRules.message || `${field} is invalid`;
      }
      if (fieldRules.match && value !== values[fieldRules.match]) {
        errors[field] = `${field} does not match`;
      }
    }
  });

  return errors;
};