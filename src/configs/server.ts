export const config = {
    api: {
        key: process.env.API_KEY as string,
        length: 12
    },
    database: {
        uri: process.env.MONGO_URI as string
    }
}