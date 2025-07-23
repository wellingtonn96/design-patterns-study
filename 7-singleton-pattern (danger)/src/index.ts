import { ConfigManager } from "./services/config-manager";
import { ConfigManagerInjected } from "./services/config-manager-injected";

function useSingleTon() {
  const config = ConfigManager.getInstance();
  console.log("Config:", config.getConfig());
  config.setConfig("new-api-key", 10000);
  console.log("update singleton config", config.getConfig());
}

function useInjectedConfig() {
  const config = new ConfigManagerInjected({
    apiKey: "injected-key",
    timeout: 10000,
  });
  console.log("Injected Config:", config.getConfig());
  config.setConfig("new-injected-key", 20000);
  console.log("update injected config", config.getConfig());
}

useSingleTon();
useInjectedConfig();
