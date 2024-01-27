import { CordXError } from '../clients/other/error.client';

export const KeyErrors: { [status: string]: (details?: any) => CordXError } = {
    'KEY_NOT_FOUND': (details) => new CordXError('KEY_NOT_FOUND', 404, CordXError.keyErrors(), details),
    'KEY_NOT_AUTHORIZED': (details) => new CordXError('KEY_NOT_AUTHORIZED', 401, CordXError.keyErrors(), details),
    'KEY_VALIDATION_FAILED': (details) => new CordXError('KEY_VALIDATION_FAILED', 400, CordXError.keyErrors(), details),
    'KEY_CREATION_FAILED': (details) => new CordXError('KEY_CREATION_FAILED', 500, CordXError.keyErrors(), details),
    'KEY_DELETION_FAILED': (details) => new CordXError('KEY_DELETION_FAILED', 500, CordXError.keyErrors(), details),
    'KEY_CHECK_FAILED': (details) => new CordXError('KEY_CHECK_FAILED', 500, CordXError.keyErrors(), details),
    'KEY_CLEANUP_FAILED': (details) => new CordXError('KEY_CLEANUP_FAILED', 500, CordXError.keyErrors(), details),
    'KEY_CLEANUP_SUCCESS': (details) => new CordXError('KEY_CLEANUP_SUCCESS', 200, CordXError.keyErrors(), details),
    'KEY_VERSION_MISMATCH': (details) => new CordXError('KEY_VERSION_MISMATCH', 500, CordXError.keyErrors(), details),
    'KEY_VERSION_UPDATE_FAILED': (details) => new CordXError('KEY_VERSION_UPDATE_FAILED', 500, CordXError.keyErrors(), details),
    'KEY_VERSION_UPDATE_SUCCESS': (details) => new CordXError('KEY_VERSION_UPDATE_SUCCESS', 200, CordXError.keyErrors(), details),
    'API_KEY_MISMATCH': (details) => new CordXError('API_KEY_MISMATCH', 418, CordXError.teaPotErrors(), details),
    'ENV_VALIDATION_FAILED': (details) => new CordXError('ENV_VALIDATION_FAILED', 500, CordXError.keyErrors(), details),
    'INVALID_KEY_TYPE': (details) => new CordXError('INVALID_KEY_TYPE', 500, CordXError.keyErrors(), details),
};

export const InstanceErrors: { [status: string]: (details?: any) => CordXError } = {
    'INSTANCE_MONITOR': (details) => new CordXError('INSTANCE_MONITOR', 200, CordXError.keyErrors(), details),
    'INSTANCE_CREATED': (details) => new CordXError('INSTANCE_CREATED', 200, CordXError.keyErrors(), details),
    'INSTANCE_DESTROYED': (details) => new CordXError('INSTANCE_DESTROYED', 200, CordXError.keyErrors(), details),
    'INSTANCE_NOT_FOUND': (details) => new CordXError('INSTANCE_NOT_FOUND', 418, CordXError.teaPotErrors(), details),
    'INSTANCE_VULNERABILITY': (details) => new CordXError('INSTANCE_VULNERABILITY', 418, CordXError.teaPotErrors(), details),
    'INSTANCE_NOT_AUTHORIZED': (details) => new CordXError('INSTANCE_NOT_AUTHORIZED', 401, CordXError.keyErrors(), details),
    'INSTANCE_CREATION_FAILED': (details) => new CordXError('INSTANCE_CREATION_FAILED', 500, CordXError.keyErrors(), details),
    'INSTANCE_DESTROY_FAILED': (details) => new CordXError('INSTANCE_DESTROY_FAILED', 500, CordXError.keyErrors(), details),
    'INSTANCE_CLEANUP_FAILED': (details) => new CordXError('INSTANCE_CLEANUP_FAILED', 500, CordXError.keyErrors(), details),
    'INSTANCE_CLEANUP_SUCCESS': (details) => new CordXError('INSTANCE_CLEANUP_SUCCESS', 200, CordXError.keyErrors(), details),
    'NO_DIRTY_INSTANCES': (details) => new CordXError('NO_DIRTY_INSTANCES', 200, CordXError.keyErrors(), details),
}

export const DatabaseErrors: { [status: string]: (details?: any) => CordXError } = {
    'DATABASE_CONNECTED': (details) => new CordXError('DATABASE_CONNECTED', 200, CordXError.keyErrors(), details),
    'DATABASE_DISCONNECTED': (details) => new CordXError('DATABASE_DISCONNECTED', 200, CordXError.keyErrors(), details),
    'DATABASE_CONNECTION_FAILED': (details) => new CordXError('DATABASE_CONNECTION_FAILED', 500, CordXError.keyErrors(), details),
    'DATABASE_CONNECTION_LOST': (details) => new CordXError('DATABASE_CONNECTION_LOST', 500, CordXError.keyErrors(), details),
    'DATABASE_CONNECTION_ERROR': (details) => new CordXError('DATABASE_CONNECTION_ERROR', 500, CordXError.keyErrors(), details),
    'DATABASE_CONNECTION_TIMEOUT': (details) => new CordXError('DATABASE_CONNECTION_TIMEOUT', 500, CordXError.keyErrors(), details),
    'DATABASE_CONNECTION_CLOSED': (details) => new CordXError('DATABASE_CONNECTION_CLOSED', 500, CordXError.keyErrors(), details),
}

export const RandomCreateKeyErrors = [
    `Error 404: Sanity not found.`,
    'Our code is having a mid-life crisis.',
    'Oops! The squirrels in our server room are causing trouble again.',
    'Seems like you missed that left turn at Albuquerque.',
    'What are you doing step bro?',
    'Ever sick we might be cousins',
    'You done fucked up chief!',
    'Help me im stuck ;)',
    'LOL, you look like a noob.'
]

export const RandomRateLimitMessages = [
    'Hang on there chief, you are doing things too fast.',
    'Whoa, slow down! Even the fastest cheetah needs to rest.',
    'You’re moving faster than light. Slow down, Einstein would be confused.',
    'Easy there, Speedy Gonzales. Take a breather.',
    'You’re clicking faster than Usain Bolt runs. Take a break.',
    'Hold your horses! You’re hitting our servers like a stampede.',
    'You’re faster than a caffeinated squirrel. Slow down a bit.',
    'You’re moving so fast, you might just go back in time. Slow down, Marty!',
    'You’re hitting us harder than a drummer in a rock band. Take a break, Ringo.',
    'You’re faster than a New York minute. Take a breather.'
];

export const ImATeaPot = [
    'Im a little tea pot!',
    'Short and stout, here is my handle, here is my spout!',
    'I may be a teapot, but I can’t brew the solution to this problem.',
    'Error 418: I’m a teapot, not a coffee machine.',
    'I’d pour you some tea to help you think, but it seems I’m in a bit of a steep situation myself.',
    'I’m a teapot, but I can’t handle this request.',
    'I’m spouting off errors like a boiling teapot.',
    'I’m a teapot, and I’ve just boiled over with errors.',
    'This teapot is under pressure, just like our servers.',
    'I’m a teapot, and I’ve run out of tea. And by tea, I mean answers.'
];