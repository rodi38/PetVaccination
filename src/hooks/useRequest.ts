import { useState, useCallback } from 'react';

interface RequestOptions {
	showFullScreenLoading?: boolean;
	loadingText?: string;
}

export const useRequest = (defaultOptions: RequestOptions = {}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const execute = useCallback(
		async <T>(asyncFunction: () => Promise<T>, options: RequestOptions = {}): Promise<T | null> => {
			const finalOptions = { ...defaultOptions, ...options };

			try {
				setIsLoading(true);
				setError(null);
				const result = await asyncFunction();
				return result;
			} catch (err) {
				console.log({ err });

				const errorMessage = err instanceof Error ? err.message : 'An error occurred';
				setError(errorMessage);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[defaultOptions],
	);

	return {
		isLoading,
		error,
		execute,
		setError,
	};
};
