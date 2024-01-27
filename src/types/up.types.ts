export interface UnderPressureStats {
    /**
     * The current event loop delay in milliseconds
     */
    eventLoopDelay: number;
    /**
     * The current memory usage in bytes
     */
    rss: number;
    /**
     * The current heap total in bytes
     */
    heapTotal: number;
    /**
     * The current heap used in bytes
     */
    heapUsed: number;
    /**
     * The current number of active handles
     */
    activeHandles: number;
    /**
     * The current number of active requests
     */
    activeRequests: number;
}