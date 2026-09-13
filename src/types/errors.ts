export interface ValidationErrorDetail {
	field: string;
	message: string;
}

export interface ApiErrorPayload {
	message: string;
	code?: string;
	details?: ValidationErrorDetail[];
}

export interface APIError {
	response?: {
		data?: {
			success: false;
			data: null;
			error: ApiErrorPayload;
		};
		status?: number;
	};
}
