import { Logger } from "../other/log.client";

export class CordXSnowflake {
    private static usedIds: Set<string> = new Set();
    private sequence: bigint = 0n;
    private lastTimestamp: bigint = -1n;
    private logs: Logger = Logger.getInstance('CordX_Snowflake', false);

    constructor(
        private readonly workerId: bigint = BigInt(CordXSnowflake.id()),
        private readonly datacenterId: bigint = BigInt(CordXSnowflake.id()),
        private readonly epoch: bigint = 1288834974657n
    ) {
        if (workerId < 0 || workerId > 31) {
            throw new Error('Worker ID must be between 0 and 31');
        }
        if (datacenterId < 0 || datacenterId > 31) {
            throw new Error('Datacenter ID must be between 0 and 31');
        }
        this.sequence = 0n;
        this.lastTimestamp = -1n;
    }

    /**
     * @function generateId
     * @description Generate a unused Worker or DataCenter ID.
     * @returns {number} Between 0 and 31
     */
    private static id(): number {
        let id;
        do {
            id = Math.floor(Math.random() * 32);
        } while (CordXSnowflake.usedIds.has(id.toString()));
        CordXSnowflake.usedIds.add(id.toString());
        return id;
    }

    public generate(): string {
        let timestamp = BigInt(this.timeGen());
        if (BigInt(this.lastTimestamp) === timestamp) {
            this.sequence = (this.sequence + 1n) & 0xfffn;
            if (this.sequence === 0n) {
                timestamp = BigInt(this.tilNextMillis(Number(this.lastTimestamp)));
            }
        } else {
            this.sequence = 0n;
        }

        if (timestamp < this.lastTimestamp) {
            throw new Error(`Clock moved backwards. Refusing to generate id for ${Number(this.lastTimestamp - timestamp)} milliseconds`);
        }

        this.lastTimestamp = timestamp;

        const id = ((timestamp - this.epoch) << 22n) | (this.datacenterId << 17n) | (this.workerId << 12n) | this.sequence;
        return id.toString();
    }

    /**
     * @function timeGen
     * @description Returns the current time in milliseconds
     * @returns {number} Current time in milliseconds
     */
    private timeGen(): number {
        return Date.now();
    }

    /**
     * @function tilNextMillis
     * @description Returns the next time in milliseconds
     * @param {number} lastTimestamp Last timestamp
     * @returns {number} Next time in milliseconds
     */
    private tilNextMillis(lastTimestamp: number): number {
        let timestamp = this.timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = this.timeGen();
        }
        return timestamp;
    }

    /**
     * @function decompose
     * @description Decomposes a Snowflake ID
     * @param {string} id Snowflake ID
     * @returns {object} Decomposed Snowflake ID
     */
    public decompose(id: string): { timestamp: number, workerId: number, datacenterId: number, sequence: number } {
        const idNumber = BigInt(id);
        const timestamp = Number((idNumber >> 22n) + BigInt(this.epoch));
        const datacenterId = Number((idNumber & 0x3E0000n) >> 17n);
        const workerId = Number((idNumber & 0x1F000n) >> 12n);
        const sequence = Number(idNumber & 0xFFFn);
        return { timestamp, workerId, datacenterId, sequence };
    }
}