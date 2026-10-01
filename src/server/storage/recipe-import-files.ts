import { mkdir } from "node:fs/promises";
import path from "node:path";

const defaultUploadRoot = path.join(process.cwd(), "data", "uploads");

export class RecipeImportFileStorage {
  readonly root: string;

  constructor(uploadRoot = process.env.YES_CHEF_UPLOAD_DIR || defaultUploadRoot) {
    this.root = path.resolve(uploadRoot);
  }

  async write(storageKey: string, file: Blob) {
    const filePath = this.resolve(storageKey);
    await mkdir(path.dirname(filePath), { recursive: true });
    await Bun.write(filePath, file);
  }

  async delete(storageKey: string) {
    await Bun.file(this.resolve(storageKey)).delete();
  }

  resolve(storageKey: string) {
    const filePath = path.resolve(this.root, storageKey);
    const relativePath = path.relative(this.root, filePath);
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      throw new Error("Upload path escapes the configured storage directory.");
    }
    return filePath;
  }
}
