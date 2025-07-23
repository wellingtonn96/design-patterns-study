export interface ConfigService {
  getConfig(): { apiKey: string; timeout: number };
  setConfig(apiKey: string, timeout: number): void;
}

export class ConfigManagerInjected implements ConfigService {
  private config: { apiKey: string; timeout: number };

  constructor(config: { apiKey: string; timeout: number }) {
    this.config = config || {
      apiKey: "default-key",
      timeout: 0,
    };
  }

  public getConfig(): { apiKey: string; timeout: number } {
    return { ...this.config };
  }

  public setConfig(apiKey: string, timeout: number): void {
    this.config.apiKey = apiKey;
    this.config.timeout = timeout;
  }
}
