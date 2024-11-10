import { useState, useCallback } from 'react';
import { Snackbar } from 'react-native-paper';

interface ValidationRules {
	email?: boolean;
	minLength?: number;
	maxLength?: number;
	minAge?: number;
	maxAge?: number;
	futureDate?: boolean;
	required?: boolean;
}

interface FieldValidation {
	value: string | number | Date;
	rules: ValidationRules;
}

export const useFormValidation = () => {
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateField = useCallback((fieldName: string, validation: FieldValidation) => {
		const { value, rules } = validation;
		let error = '';

		if (rules.required && (!value || value.toString().trim() === '')) {
			error = 'This field is required';
		}

		if (rules.email && typeof value === 'string') {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(value)) {
				error = 'Invalid email format';
			}
		}

		if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
			error = `Minimum ${rules.minLength} characters required`;
		}

		if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
			error = `Maximum ${rules.maxLength} characters allowed`;
		}

		if (rules.minAge && typeof value === 'number' && value < rules.minAge) {
			error = `Age must be at least ${rules.minAge}`;
		}

		if (rules.maxAge && typeof value === 'number' && value > rules.maxAge) {
			error = `Age cannot be more than ${rules.maxAge}`;
		}

		if (rules.futureDate && value instanceof Date) {
			if (value <= new Date()) {
				error = 'Date must be in the future';
			}
		}

		setErrors((prev) => ({
			...prev,
			[fieldName]: error,
		}));

		return error === '';
	}, []);

	const validateForm = useCallback(
		(validations: Record<string, FieldValidation>) => {
			let isValid = true;
			Object.entries(validations).forEach(([fieldName, validation]) => {
				const fieldIsValid = validateField(fieldName, validation);
				if (!fieldIsValid) {
					isValid = false;
				}
			});
			return isValid;
		},
		[validateField],
	);

	const showSuccessMessage = useCallback((message: string) => {
		setSnackbarMessage(message);
		setSnackbarVisible(true);
	}, []);

	const hideSnackbar = useCallback(() => {
		setSnackbarVisible(false);
	}, []);

	const SnackbarComponent = useCallback(
		() => (
			<Snackbar visible={snackbarVisible} onDismiss={hideSnackbar} duration={3000} style={{ backgroundColor: '#4CAF50' }}>
				{snackbarMessage}
			</Snackbar>
		),
		[snackbarVisible, snackbarMessage, hideSnackbar],
	);

	return {
		validateField,
		validateForm,
		showSuccessMessage,
		errors,
		SnackbarComponent,
	};
};
