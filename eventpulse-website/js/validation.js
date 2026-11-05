/**
 * EventPulse - Robust JavaScript Form Validation Engine
 * Validates inputs in real-time, displays contextual feedback, and ensures strict data integrity.
 */

const FormValidator = {
    // Regex Patterns
    patterns: {
        name: /^[a-zA-Z\s\.\-']{3,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^\+?[0-9\s\-\(\)]{10,18}$/
    },

    /**
     * Rules definition with custom messages
     */
    rules: {
        participantName: {
            required: true,
            validate: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Full Name is required.";
                if (trimmed.length < 3) return "Name must be at least 3 characters.";
                if (!FormValidator.patterns.name.test(trimmed)) {
                    return "Name can only contain letters, spaces, hyphens, and dots.";
                }
                return null;
            }
        },
        participantEmail: {
            required: true,
            validate: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Email address is required.";
                if (!FormValidator.patterns.email.test(trimmed)) {
                    return "Please enter a valid email address (e.g. alex@example.com).";
                }
                return null;
            }
        },
        participantPhone: {
            required: true,
            validate: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Phone number is required.";
                // Extract only digits to check length
                const digits = trimmed.replace(/\D/g, "");
                if (digits.length < 10) {
                    return "Please enter a valid phone number (minimum 10 digits).";
                }
                if (!FormValidator.patterns.phone.test(trimmed)) {
                    return "Invalid phone number format.";
                }
                return null;
            }
        },
        selectedEventId: {
            required: true,
            validate: (value) => {
                if (!value || value === "") return "Please select an event to register for.";
                return null;
            }
        },
        ticketQuantity: {
            required: true,
            validate: (value) => {
                const val = parseInt(value, 10);
                if (isNaN(val) || val < 1 || val > 10) {
                    return "Ticket quantity must be between 1 and 10.";
                }
                return null;
            }
        },
        agreeTerms: {
            required: true,
            validateCheckbox: (checked) => {
                if (!checked) return "You must agree to the event registration guidelines.";
                return null;
            }
        }
    },

    /**
     * Validate a single input field and apply UI feedback
     */
    validateField(fieldElement) {
        const fieldName = fieldElement.name || fieldElement.id;
        const rule = this.rules[fieldName];
        if (!rule) return true;

        let error = null;
        if (fieldElement.type === "checkbox") {
            if (rule.validateCheckbox) {
                error = rule.validateCheckbox(fieldElement.checked);
            }
        } else {
            error = rule.validate(fieldElement.value);
        }

        this.applyFieldFeedback(fieldElement, error);
        return error === null;
    },

    /**
     * Update DOM classes and error helper text for the field
     */
    applyFieldFeedback(fieldElement, error) {
        const container = fieldElement.closest(".form-group") || fieldElement.parentElement;
        const errorMsgEl = container.querySelector(".field-error-msg");
        const successIconEl = container.querySelector(".field-success-icon");

        if (error) {
            // Apply error styles
            fieldElement.classList.add("input-error");
            fieldElement.classList.remove("input-success");
            fieldElement.setAttribute("aria-invalid", "true");

            if (errorMsgEl) {
                errorMsgEl.textContent = error;
                errorMsgEl.classList.remove("hidden");
            }
            if (successIconEl) {
                successIconEl.classList.add("hidden");
            }
        } else {
            // Apply success styles
            fieldElement.classList.remove("input-error");
            fieldElement.classList.add("input-success");
            fieldElement.removeAttribute("aria-invalid");

            if (errorMsgEl) {
                errorMsgEl.textContent = "";
                errorMsgEl.classList.add("hidden");
            }
            if (successIconEl) {
                successIconEl.classList.remove("hidden");
            }
        }
    },

    /**
     * Clear validation visual states on a field
     */
    resetField(fieldElement) {
        fieldElement.classList.remove("input-error", "input-success");
        fieldElement.removeAttribute("aria-invalid");
        const container = fieldElement.closest(".form-group") || fieldElement.parentElement;
        const errorMsgEl = container.querySelector(".field-error-msg");
        const successIconEl = container.querySelector(".field-success-icon");

        if (errorMsgEl) {
            errorMsgEl.textContent = "";
            errorMsgEl.classList.add("hidden");
        }
        if (successIconEl) {
            successIconEl.classList.add("hidden");
        }
    },

    /**
     * Validate entire form. Returns boolean isFormValid and sanitized formData object.
     */
    validateForm(formElement) {
        let isValid = true;
        const data = {};

        // Find all form controls
        const elements = formElement.querySelectorAll("input, select, textarea");
        elements.forEach(element => {
            const name = element.name || element.id;
            if (this.rules[name]) {
                const fieldValid = this.validateField(element);
                if (!fieldValid) {
                    isValid = false;
                }
            }

            if (name) {
                if (element.type === "checkbox") {
                    data[name] = element.checked;
                } else {
                    data[name] = element.value.trim();
                }
            }
        });

        return { isValid, data };
    },

    /**
     * Attach real-time validation listeners to a form
     */
    initFormValidation(formElement, onSubmitCallback) {
        if (!formElement) return;

        const inputs = formElement.querySelectorAll("input, select, textarea");
        inputs.forEach(input => {
            // Real-time blur validation
            input.addEventListener("blur", () => {
                this.validateField(input);
            });

            // Live validation on typing once user touched
            input.addEventListener("input", () => {
                if (input.classList.contains("input-error") || input.classList.contains("input-success")) {
                    this.validateField(input);
                }
            });

            if (input.type === "checkbox") {
                input.addEventListener("change", () => {
                    this.validateField(input);
                });
            }
        });

        // Form submission handler
        formElement.addEventListener("submit", (e) => {
            e.preventDefault();
            const { isValid, data } = this.validateForm(formElement);
            if (isValid && typeof onSubmitCallback === "function") {
                onSubmitCallback(data);
            } else {
                // Focus first invalid element
                const firstInvalid = formElement.querySelector(".input-error");
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    }
};
