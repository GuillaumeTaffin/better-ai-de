import type { Subprocess } from "bun";
import type { WireObserver } from "./wire-observer";

export interface ClaudeCallbacks {
  onDelta: (text: string) => void;
  onDone: (sessionId: string) => void;
  onError: (message: string) => void;
}

/**
 * Manages spawning `claude` CLI in stream-json mode and parsing its NDJSON output.
 *
 * Each call to `send()` spawns a new process. Multi-turn is achieved via `--resume`.
 */
export class ClaudeProcess {
  private _sessionId: string | null = null;
  private _isRunning = false;
  private _proc: Subprocess | null = null;
  private _wireObserver: WireObserver | undefined;

  constructor(wireObserver?: WireObserver) {
    this._wireObserver = wireObserver;
  }

  get sessionId() {
    return this._sessionId;
  }

  get isRunning() {
    return this._isRunning;
  }

  async send(text: string, callbacks: ClaudeCallbacks): Promise<void> {
    if (this._isRunning) {
      callbacks.onError("Already streaming");
      return;
    }

    this._isRunning = true;

    const args = [
      "claude",
      "-p",
      text,
      "--output-format",
      "stream-json",
      "--verbose",
      "--dangerously-skip-permissions",
    ];

    if (this._sessionId) {
      args.push("--resume", this._sessionId);
    }

    this._wireObserver?.emitOutgoing(args[0], args.slice(1));

    try {
      this._proc = Bun.spawn(args, {
        stdout: "pipe",
        stderr: "pipe",
      });

      const stdout = this._proc.stdout as ReadableStream<Uint8Array>;
      const reader = stdout.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep incomplete last line in buffer
        buffer = lines.pop()!;

        for (const line of lines) {
          if (!line.trim()) continue;
          this.parseLine(line, callbacks);
        }
      }

      // Process remaining buffer
      if (buffer.trim()) {
        this.parseLine(buffer, callbacks);
      }

      // Wait for process to exit
      await this._proc.exited;
    } catch (err) {
      callbacks.onError(
        err instanceof Error ? err.message : "Unknown error spawning claude"
      );
    } finally {
      this._isRunning = false;
      this._proc = null;
    }
  }

  kill() {
    if (this._proc) {
      this._proc.kill();
      this._proc = null;
      this._isRunning = false;
    }
  }

  private parseLine(line: string, callbacks: ClaudeCallbacks) {
    try {
      const event = JSON.parse(line);
      this._wireObserver?.emitIncoming(event);

      switch (event.type) {
        case "assistant": {
          // Extract text from content blocks
          const content = event.message?.content;
          if (Array.isArray(content)) {
            for (const block of content) {
              if (block.type === "text" && block.text) {
                callbacks.onDelta(block.text);
              }
            }
          }
          break;
        }

        case "result": {
          if (event.session_id) {
            this._sessionId = event.session_id;
          }
          callbacks.onDone(this._sessionId ?? "");
          break;
        }

        // "system" and other types are ignored
      }
    } catch {
      // Non-JSON line, ignore
    }
  }
}
