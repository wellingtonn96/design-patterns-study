import { ConfigManager } from "../services/config-manager";
import { ConfigManagerInjected } from "../services/config-manager-injected";

describe("ConfigManager", () => {
  beforeEach(() => {
    // Limpa a instância global (difícil de resetar)
    // @ts-ignore
    ConfigManager["instance"] = null;
  });

  test("deve retornar configuração padrão com Singleton", () => {
    const config = ConfigManager.getInstance();
    expect(config.getConfig()).toEqual({
      apiKey: "default-key",
      timeout: 3000,
    });
  });

  test("deve compartilhar instância Singleton", () => {
    const config1 = ConfigManager.getInstance();
    const config2 = ConfigManager.getInstance();
    config1.setConfig("test-key", 1000);
    expect(config2.getConfig()).toEqual({ apiKey: "test-key", timeout: 1000 });
  });
});

describe("ConfigManagerInjected", () => {
  test("Deve inicializar com a configuração injetada", () => {
    const config = new ConfigManagerInjected({
      apiKey: "injected-key",
      timeout: 5000,
    });

    expect(config.getConfig()).toEqual({
      apiKey: "injected-key",
      timeout: 5000,
    });
  });
  test("deve permitir instancias independentes", () => {
    const config1 = new ConfigManagerInjected({
      apiKey: "key1",
      timeout: 1000,
    });

    const config2 = new ConfigManagerInjected({
      apiKey: "key2",
      timeout: 5000,
    });

    config1.setConfig("new-key1", 2000);
    expect(config2.getConfig()).toEqual({ apiKey: "key2", timeout: 5000 });
  });
});
