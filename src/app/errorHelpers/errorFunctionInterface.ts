/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  stack?: string | null;
  error?: any;
}

// Function type for error handling functions (replaced interface to fix ESLint prefer-function-type)
export type ErrorHandler = (err?: any) => {
  statusCode: number;
  message: string;
  errors: Record<string, string>;
};
