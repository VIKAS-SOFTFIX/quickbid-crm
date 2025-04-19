import crypto from "crypto";

class EncryptionConfigManager {
  static instance: EncryptionConfigManager;
  config: { key: string } = { key: '' };

  constructor() {
    if (EncryptionConfigManager.instance) {
      return EncryptionConfigManager.instance;
    }

    const configKey =
      process.env.ENCRYPTION_KEY || "B3y0ndTheC0d3_EncrypT10nKey_99";

    this.config = {
      key: this.ensureValidKey(configKey),
    };

    EncryptionConfigManager.instance = this;
  }

  ensureValidKey(key: string): string {
    if (!this.isBase64(key)) {
      const buffer = Buffer.from(key, "utf8");
      const paddedBuffer = Buffer.alloc(32, 0);
      buffer.copy(paddedBuffer);
      key = paddedBuffer.toString("base64");
    }

    return key;
  }

  isBase64(str: string): boolean {
    try {
      return Buffer.from(str, "base64").toString("base64") === str;
    } catch {
      return false;
    }
  }

  getKey(): Buffer {
    return Buffer.from(this.config.key, "base64");
  }
}

export default EncryptionConfigManager; 