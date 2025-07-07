import { BaseLogger } from './BaseLogger';
type LogData = Record<string, any>;
export declare class ConsoleLogger extends BaseLogger {
    private consoleLogMap;
    private log;
    test(message: string, data?: LogData): void;
    trace(message: string, data?: LogData): void;
    debug(message: string, data?: LogData): void;
    info(message: string, data?: LogData): void;
    warn(message: string, data?: LogData): void;
    error(message: string, data?: LogData): void;
    fatal(message: string, data?: LogData): void;
}
export {};
