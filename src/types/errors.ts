export interface ValidationErrorDetail {
	field: string;
	message: string;
}

export interface ValidationError {
	error: string;
	details: ValidationErrorDetail[];
}

export interface APIError {
	response?: {
		data?: ValidationError;
		status?: number;
	};
}
