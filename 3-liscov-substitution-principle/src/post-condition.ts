// incorrect way
export interface IFileSaver {
  saveFile(content: string): string; // Deve retornar caminho local
}

export class LocalFileSaver implements IFileSaver {
  saveFile(content: string): string {
    console.log(`✅ Salvando arquivo local: ${content}`);
    return "/tmp/file.txt";
  }
}

export class CloudFileSaver implements IFileSaver {
  saveFile(content: string): string {
    console.log(`❌ Salvando arquivo na nuvem: ${content}`);
    return "https://cloud.com/file.txt"; // ❌ Retorna URL!
  }
}

// correct way
export interface ILocalFileSaver {
  saveFileLocal(content: string): string; // Retorna caminho local
}

export interface ICloudFileSaver {
  saveFileCloud(content: string): string; // Retorna URL
}

export class SafeLocalFileSaver implements ILocalFileSaver {
  saveFileLocal(content: string): string {
    console.log(`✅ Salvando arquivo local: ${content}`);
    return "/tmp/file.txt";
  }
}

export class SafeCloudFileSaver implements ICloudFileSaver {
  saveFileCloud(content: string): string {
    console.log(`✅ Salvando arquivo na nuvem: ${content}`);
    return "https://cloud.com/file.txt";
  }
}