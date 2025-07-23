// src/services/config-manager.ts
export class ConfigManager {
  private static instance: ConfigManager;
  private config: { apiKey: string; timeout: number } = {
    apiKey: "",
    timeout: 0,
  };

  private constructor() {
    // Simula inicialização
    this.config = { apiKey: "default-key", timeout: 3000 };
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getConfig(): { apiKey: string; timeout: number } {
    return { ...this.config };
  }

  public setConfig(apiKey: string, timeout: number): void {
    this.config.apiKey = apiKey;
    this.config.timeout = timeout;
  }
}
