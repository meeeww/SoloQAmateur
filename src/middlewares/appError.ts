class ValidationError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class UnauthorizedError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

class DuplicateEntryError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateEntryError';
    this.statusCode = 409;
  }
}

class PrimaryKeyEntryError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'PrimaryKeyEntryError';
    this.statusCode = 409;
  }
}

class ForeignKeyEntryError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'ForeignKeyEntryError';
    this.statusCode = 422;
  }
}

class BadRequestError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

class MethodNotAllowedError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'MethodNotAllowedError';
    this.statusCode = 405;
  }
}

class UnsupportedMediaTypeError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedMediaTypeError';
    this.statusCode = 415;
  }
}

class RateLimitExceededError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitExceededError';
    this.statusCode = 429;
  }
}

class InternalServerError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
  }
}

class BadGatewayError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'BadGatewayError';
    this.statusCode = 502;
  }
}

class ServiceUnavailableError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'ServiceUnavailableError';
    this.statusCode = 503;
  }
}

class GatewayTimeoutError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'GatewayTimeoutError';
    this.statusCode = 504;
  }
}

export {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  DuplicateEntryError,
  PrimaryKeyEntryError,
  ForeignKeyEntryError,
  BadRequestError,
  MethodNotAllowedError,
  UnsupportedMediaTypeError,
  RateLimitExceededError,
  InternalServerError,
  BadGatewayError,
  ServiceUnavailableError,
  GatewayTimeoutError,
};
