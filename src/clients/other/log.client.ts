import moment from 'moment';
import { CordXError } from './error.client';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const MAGENTA = '\x1b[35m';
const RESET = '\x1b[0m';

export class Logger {
  private static instances: { [prefix: string]: Logger } = {};
  public prefix: string;
  public silent: boolean;

  private constructor(prefix: string, silent: boolean) {
    this.silent = silent
    this.prefix = prefix
  }

  public static getInstance(prefix: string, silent: boolean): Logger {
    if (!this.instances[prefix]) {
      this.instances[prefix] = new Logger(prefix, silent);
    }

    return this.instances[prefix];
  }

  public static cleanupInstance(prefix: string): void {
    if (!this.instances[prefix]) {
      return console.error(`Failed to find logger instance: ${prefix}`);
    }

    this.instances[prefix].info(`Destroying logger instance: ${prefix}`);
    delete this.instances[prefix];
  }

  public info(message: string | object): void {
    if (this.silent) return;
    console.info(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${MAGENTA}${this.prefix} | Info${RESET} - ${message}`);
  }

  public success(message: string | object): void {
    if (this.silent) return;
    console.info(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${GREEN}${this.prefix} | Ready${RESET} - ${message}`);
  }

  public error(message: string | object): void {
    if (this.silent) return;
    console.error(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${RED}${this.prefix} | Error${RESET} - ${message}`);
  }

  public debug(message: string | object): void {
    if (this.silent) return;
    console.debug(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${this.prefix} | Debug${RESET} - ${message}`);
  }

  public fatal(message: string | object): void {
    if (this.silent) return;
    console.error(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${this.prefix} | Fatal${RESET} - ${message}`);
  }

  public warn(message: string | object): void {
    if (this.silent) return;
    console.warn(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${this.prefix} | Warn - ${message}`);
  }

  public trace(error: CordXError): void {
    if (this.silent) return;
    if (error.details) {
      console.trace(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${this.prefix} | Trace${RESET}: ${error.code} - ${error.message}`)
      console.trace(`Additional Error Details: ${JSON.stringify(error.details)}`)
    } else {
      console.trace(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${this.prefix} | Trace${RESET}: ${error.code} - ${error.message}`);
    }
  }
}