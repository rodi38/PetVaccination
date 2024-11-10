import { useState, useCallback } from 'react';
import { ValidationError, APIError } from '../types/errors';

interface RequestOptions {
	showFullScreenLoading?: boolean;
	loadingText?: string;
}

interface ValidationErrors {
	[key: string]: string;
}

export const useRequest = (defaultOptions: RequestOptions = {}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [generalError, setGeneralError] = useState<string | null>(null);

	const execute = useCallback(
		async <T>(asyncFunction: () => Promise<T>, options: RequestOptions = {}): Promise<T | null> => {
			const finalOptions = { ...defaultOptions, ...options };

			try {
				setIsLoading(true);
				setErrors({});
				setGeneralError(null);
				const result = await asyncFunction();
				return result;
			} catch (err) {
				const apiError = err as APIError;

				if (apiError.response?.data?.error === 'Validation error') {
					const validationError = apiError.response.data as ValidationError;
					const newErrors: ValidationErrors = {};

					validationError.details.forEach((detail) => {
						newErrors[detail.field] = detail.message;
					});

					setErrors(newErrors);
				} else {
					setGeneralError(apiError.response?.data?.error || 'An error occurred');
				}

				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[defaultOptions],
	);

	return {
		isLoading,
		errors,
		generalError,
		execute,
		setErrors,
		setGeneralError,
	};
};
