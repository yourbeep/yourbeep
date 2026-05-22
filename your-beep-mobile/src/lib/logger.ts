/**
 * App-wide logger.
 *
 * Every log line is prefixed with a tag so you can filter in Metro / Logcat / Xcode:
 *   [API]    – HTTP requests & responses
 *   [VIDEO]  – video stream fetching & playback
 *   [AUTH]   – auth token / bearer token state
 *   [ERROR]  – unexpected errors anywhere
 *
 * All logs are always printed in __DEV__ builds.
 * In production builds React Native strips console.* automatically via Hermes,
 * so there is no performance cost.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const COLORS: Record<LogLevel, string> = {
  debug: '\x1b[36m', // cyan
  info: '\x1b[32m',  // green
  warn: '\x1b[33m',  // yellow
  error: '\x1b[31m', // red
};
const RESET = '\x1b[0m';

function print(level: LogLevel, tag: string, message: string, data?: unknown) {
  if (!__DEV__) return;

  const prefix = `${COLORS[level]}[${tag}]${RESET}`;
  const timestamp = new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm

  if (data !== undefined) {
    console[level === 'debug' ? 'log' : level](`${prefix} ${timestamp} ${message}`, data);
  } else {
    console[level === 'debug' ? 'log' : level](`${prefix} ${timestamp} ${message}`);
  }
}

export const logger = {
  debug: (tag: string, message: string, data?: unknown) => print('debug', tag, message, data),
  info:  (tag: string, message: string, data?: unknown) => print('info',  tag, message, data),
  warn:  (tag: string, message: string, data?: unknown) => print('warn',  tag, message, data),
  error: (tag: string, message: string, data?: unknown) => print('error', tag, message, data),
};
