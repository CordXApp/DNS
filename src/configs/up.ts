export const UnderPressureConfig = {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 1000000000,
    maxRssBytes: 1000000000,
    maxEventLoopUtilization: 0.98,
    message: 'Server is under pressure!',
    retryAfter: 50,
    healthCheck: async () => true,
    healthCheckInterval: 5000,
    exposeStatusRoute: true,
}