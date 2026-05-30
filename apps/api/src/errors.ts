export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export class NotFoundError extends HttpError {
  constructor(resource = "Resource") {
    super(404, `${resource} not found`);
  }
}

export class ForbiddenError extends HttpError {
  constructor() {
    super(403, "Forbidden");
  }
}

export class UnauthorizedError extends HttpError {
  constructor() {
    super(401, "Unauthorized");
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(400, message);
  }
}
