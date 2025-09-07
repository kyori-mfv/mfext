import express from "express";

export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
}

export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: Record<string, unknown>;
    error?: Error;
}

export class Logger {
    private static instance: Logger;
    private logLevel: LogLevel = LogLevel.INFO;

    private constructor() {}

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    private shouldLog(level: LogLevel): boolean {
        return level <= this.logLevel;
    }

    private formatMessage(entry: LogEntry): string {
        const levelNames = ["ERROR", "WARN", "INFO", "DEBUG"];
        const levelName = levelNames[entry.level];
        const timestamp = entry.timestamp;

        let message = `[${timestamp}] ${levelName}: ${entry.message}`;

        if (entry.context && Object.keys(entry.context).length > 0) {
            message += ` | Context: ${JSON.stringify(entry.context)}`;
        }

        if (entry.error) {
            message += `\n  Error: ${entry.error.message}`;
            if (entry.error.stack) {
                message += `\n  Stack: ${entry.error.stack}`;
            }
        }

        return message;
    }

    private log(
        level: LogLevel,
        message: string,
        context?: Record<string, unknown>,
        error?: Error,
    ): void {
        if (!this.shouldLog(level)) return;

        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            context,
            error,
        };

        const formattedMessage = this.formatMessage(entry);

        switch (level) {
            case LogLevel.ERROR:
                console.error(formattedMessage);
                break;
            case LogLevel.WARN:
                console.warn(formattedMessage);
                break;
            case LogLevel.INFO:
                console.info(formattedMessage);
                break;
            case LogLevel.DEBUG:
                console.debug(formattedMessage);
                break;
        }
    }

    error(
        message: string,
        context?: Record<string, unknown>,
        error?: Error,
    ): void {
        this.log(LogLevel.ERROR, message, context, error);
    }

    warn(message: string, context?: Record<string, unknown>): void {
        this.log(LogLevel.WARN, message, context);
    }

    info(message: string, context?: Record<string, unknown>): void {
        this.log(LogLevel.INFO, message, context);
    }

    debug(message: string, context?: Record<string, unknown>): void {
        this.log(LogLevel.DEBUG, message, context);
    }

    // Request/Response logging middleware
    createRequestLogger(serverType: "RSC" | "SSR" | "Unified") {
        return (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction,
        ) => {
            const start = Date.now();
            const { method, url, headers } = req;

            this.info(`${serverType} Request Started`, {
                method,
                url,
                userAgent: headers["user-agent"],
                ip: req.ip || req.socket.remoteAddress,
            });

            const originalEnd = res.end;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            res.end = function (chunk?: any, encoding?: any, cb?: any) {
                const duration = Date.now() - start;
                const { statusCode } = res;

                Logger.getInstance().info(`${serverType} Request Completed`, {
                    method,
                    url,
                    statusCode,
                    duration: `${duration}ms`,
                });

                return originalEnd.call(this, chunk, encoding, cb);
            };

            next();
        };
    }

    // Performance monitoring
    createPerformanceMonitor(serverType: "RSC" | "SSR" | "Unified") {
        const logMemoryUsage = () => {
            const usage = process.memoryUsage();
            this.info(`${serverType} Memory Usage`, {
                heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
                heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
                external: `${Math.round(usage.external / 1024 / 1024)}MB`,
                rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
            });
        };

        return {
            logMemoryUsage,

            startInterval: () => {
                // Log memory usage every 5 minutes
                return setInterval(
                    () => {
                        logMemoryUsage();
                    },
                    5 * 60 * 1000,
                );
            },
        };
    }
}
