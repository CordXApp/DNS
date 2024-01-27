export const RateLimitConfig = {
    max: 10,
    timeWindow: '1 minute',
    global: false,
    hook: 'preHandler',
    continueExceeding: false,
    skipOnError: true,
    addHeadersOnExceeding: {
        'x-ratelimit-limit': true,
        'x-ratelimit-remaining': true,
        'x-ratelimit-reset': true,
        'retry-after': true
    },
    addHeaders: {
        'x-ratelimit-limit': true,
        'x-ratelimit-remaining': true,
        'x-ratelimit-reset': true,
        'retry-after': true
    },
}