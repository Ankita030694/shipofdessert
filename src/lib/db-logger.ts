// Utility for high-precision database query timing and debug logging (Server Terminal & Browser Console)

interface TimingStep {
  line: number;
  code: string;
  durationMs: number;
  details?: Record<string, unknown>;
}

// ANSI colors for clean server terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  bgBlue: '\x1b[44m',
};

/**
 * Log an individual DB execution step to the Server Terminal / Vercel Runtime Logs
 */
export function logServerDbTiming(
  file: string,
  line: number,
  code: string,
  durationMs: number,
  details?: Record<string, unknown>
) {
  const timestamp = new Date().toISOString().substring(11, 23);
  const durColor = durationMs > 200 ? colors.red : durationMs > 50 ? colors.yellow : colors.green;
  
  let detailsStr = '';
  if (details && Object.keys(details).length > 0) {
    const parts = Object.entries(details).map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`);
    detailsStr = ` ${colors.dim}(${parts.join(', ')})${colors.reset}`;
  }

  console.log(
    `${colors.dim}[${timestamp}]${colors.reset} ` +
    `${colors.bright}${colors.cyan}[DB TIMING]${colors.reset} ` +
    `${colors.yellow}${file}:${line}${colors.reset} ` +
    `${colors.bright}${code}${colors.reset} ` +
    `→ ${durColor}${colors.bright}${durationMs.toFixed(2)} ms${colors.reset}` +
    detailsStr
  );
}

/**
 * Class to track and format multiple timing steps across a route handler
 */
export class RouteTimingTracker {
  private file: string;
  private endpoint: string;
  private reqStart: number;
  private steps: TimingStep[] = [];

  constructor(file: string, endpoint: string) {
    this.file = file;
    this.endpoint = endpoint;
    this.reqStart = performance.now();
  }

  /**
   * Measure an async code block, log to terminal, and record step
   */
  async measure<T>(
    line: number,
    code: string,
    fn: () => Promise<T>,
    getDetails?: (result: T) => Record<string, unknown>
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const durationMs = parseFloat((performance.now() - start).toFixed(2));
      const details = getDetails ? getDetails(result) : undefined;
      
      this.steps.push({ line, code, durationMs, details });
      logServerDbTiming(this.file, line, code, durationMs, details);
      return result;
    } catch (err) {
      const durationMs = parseFloat((performance.now() - start).toFixed(2));
      logServerDbTiming(this.file, line, `${code} [FAILED]`, durationMs, {
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  /**
   * Record a synchronous step
   */
  record(line: number, code: string, durationMs: number, details?: Record<string, unknown>) {
    const formattedDur = parseFloat(durationMs.toFixed(2));
    this.steps.push({ line, code, durationMs: formattedDur, details });
    logServerDbTiming(this.file, line, code, formattedDur, details);
  }

  /**
   * Finish and return total duration
   */
  finish(endLine: number, summaryDetails?: Record<string, unknown>): number {
    const totalDurationMs = parseFloat((performance.now() - this.reqStart).toFixed(2));
    this.record(endLine, `Total Execution: ${this.endpoint}`, totalDurationMs, summaryDetails);
    return totalDurationMs;
  }

  /**
   * Generate W3C Server-Timing header value
   */
  getServerTimingHeader(): string {
    return this.steps
      .map((s, idx) => {
        const slug = s.code.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
        return `step_${idx}_L${s.line};dur=${s.durationMs};desc="${s.code.replace(/"/g, "'")}"`;
      })
      .join(', ');
  }

  /**
   * Return debug payload object to embed in response JSON
   */
  getDebugPayload(queryInfo?: Record<string, unknown>) {
    return {
      file: this.file,
      endpoint: this.endpoint,
      query: queryInfo,
      totalDurationMs: parseFloat((performance.now() - this.reqStart).toFixed(2)),
      steps: this.steps,
    };
  }
}
