// Typed error hierarchy for the future HTTP layer. Mock repositories can
// throw these too, so UI error handling never has to change when the
// real API client is swapped in.
export class ApiException extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
    this.name = "ApiException";
  }
}

export class NetworkException extends ApiException {
  constructor(message = "Unable to reach the server. Check your connection.") {
    super(message, 0);
    this.name = "NetworkException";
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message = "Session expired. Please log in again.") {
    super(message, 401);
    this.name = "UnauthorizedException";
  }
}

export class NotFoundException extends ApiException {
  constructor(message = "The requested resource was not found.") {
    super(message, 404);
    this.name = "NotFoundException";
  }
}

export class ValidationException extends ApiException {
  constructor(message: string, public readonly fieldErrors: Record<string, string> = {}) {
    super(message, 422);
    this.name = "ValidationException";
  }
}
