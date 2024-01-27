import * as ErrorTypes from "../types/err.types";

export function createTeaPotError() {
    return ErrorTypes.ImATeaPot[Math.floor(Math.random() * ErrorTypes.ImATeaPot.length)];
}

export function createRateLimitError() {
    return ErrorTypes.RandomRateLimitMessages[Math.floor(Math.random() * ErrorTypes.RandomRateLimitMessages.length)];
}

export function createKeyError() {
    return ErrorTypes.RandomCreateKeyErrors[Math.floor(Math.random() * ErrorTypes.RandomCreateKeyErrors.length)];
}