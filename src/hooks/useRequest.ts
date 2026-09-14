import { useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { APIError } from '../types/errors';

interface RequestOptions {
	showFullScreenLoading?: boolean;
	loadingText?: string;
	successMessage?: string;
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

				if (finalOptions.successMessage) {
					Toast.show({ type: 'success', text1: finalOptions.successMessage });
				}

				return result;
			} catch (err) {
				const apiError = err as APIError;
				const error = apiError.response?.data?.error;

				if (error?.details) {
					const newErrors: ValidationErrors = {};

					error.details.forEach((detail) => {
						newErrors[detail.field] = detail.message;
					});

					setErrors(newErrors);
					Toast.show({ type: 'error', text1: 'Verifique os campos do formulário' });
				} else {
					const message = error?.message || 'Ocorreu um erro';
					setGeneralError(message);
					Toast.show({ type: 'error', text1: message });
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
