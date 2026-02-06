import { config } from "../lib/config";

/**
 * Client for communicating with the Vibe Kanban backend.
 *
 * Stub — will be fleshed out when proxy logic is implemented.
 */
export class VkClient {
  private baseUrl: string;

  constructor(baseUrl = config.vk.backendUrl) {
    this.baseUrl = baseUrl;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
}
