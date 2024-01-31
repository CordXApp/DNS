export const ListConfig = {
    rateLimit: {
        max: 100,
        timeWindow: 60000,
        errorResponseBuilder: function () {
            return {
                code: '429',
                error: 'Too many requests, please try again later.',
                message: `Rate limited, please wait ${this.timeWindow / 1000} seconds.`,
                date: Date.now(),
                expiresIn: this.timeWindow
            }
        },
        onExceeding: function () {
            return {
                code: '420',
                error: 'Enhance your calm!',
                message: `Please chill out for ${this.timeWindow / 1000} seconds.`,
                date: Date.now(),
                expiresIn: this.timeWindow
            }
        },
        onExceeded: function () {
            return {
                code: '420',
                error: 'Enhance your calm!',
                message: `Rate limit exceeded, please chill out for ${this.timeWindow / 1000} seconds.`,
                date: Date.now(),
                expiresIn: this.timeWindow
            }
        }
    }
}