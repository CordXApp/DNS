import moment from "moment";
import { CordXError } from "./error.client";

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const MAGENTA = "\x1b[35m";
const RESET = "\x1b[0m";

export class Logger {
  public prefix: string;
  public silent: boolean;

  constructor(prefix: string, silent: boolean) {
    this.silent = silent;
    this.prefix = prefix;
  }

  public info(message: string | object): void {
    if (this.silent) return;
    console.info(
      `[${moment().format("DD/MM/YYYY HH:mm:ss")}] ${MAGENTA}${this.prefix} | Info${RESET} - ${message}`,
    );
  }

  public success(message: string | object): void {
    if (this.silent) return;
    console.info(
      `[${moment().format("DD/MM/YYYY HH:mm:ss")}] ${GREEN}${this.prefix} | Ready${RESET} - ${message}`,
    );
  }

  public error(message: string | object): void {
    if (this.silent) return;
    console.error(
      `[${moment().format("DD/MM/YYYY HH:mm:ss")}] ${RED}${this.prefix} | Error${RESET} - ${message}`,
    );
  }

  public debug(message: string | object): void {
    if (this.silent) return;
    console.debug(
      `[${moment().format("DD/MM/YYYY HH:mm:ss")}] ${this.prefix} | Debug${RESET} - ${message}`,
    );
  }

  public fatal(message: string | object): void {
    if (this.silent) return;
    console.error(
      `[${moment().format("DD/MM/YYYY HH:mm:ss")}] ${this.prefix} | Fatal${RESET} - ${message}`,
    );
  }

  public warn(message: string | object): void {
    if (this.silent) return;
    console.warn(
      `[${moment().format("DD/MM/YYYY HH:mm:ss")}] ${this.prefix} | Warn - ${message}`,
    );
  }

  public trace(error: CordXError): void {
    if (this.silent) return;
    if (error.details) {
      console.trace(
        `[${moment().format("DD/MM/YYYY HH:mm:ss")}] ${this.prefix} | Trace${RESET}: ${error.code} - ${error.message}`,
      );
      console.trace(
        `Additional Error Details: ${JSON.stringify(error.details)}`,
      );
    } else {
      console.trace(
        `[${moment().format("DD/MM/YYYY HH:mm:ss")}] ${this.prefix} | Trace${RESET}: ${error.code} - ${error.message}`,
      );
    }
  }
}
