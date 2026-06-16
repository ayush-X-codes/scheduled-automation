import path, { join } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const direPath = path.join(__dirname, "..", "/data");

async function findOldAndNewFile() {

  try {
    const files = await fs.readdir(direPath);

    if (files.length === 0) {
      console.error("Directory is completely empty");
      return;
    }

    const fileState = await Promise.all(
      files.map(async (file) => {
        const filePath = join(direPath, file);
        const fileStat = await fs.stat(filePath);

        return {
          name: file,
          path: filePath,
          isFile: fileStat.isFile(),
          mtime: fileStat.mtimeMs,
        };
      }),
    );

    const onlyFile = fileState.filter((item) => item.isFile);

    if (onlyFile.length === 0) {
      console.error("There are no files in folder");
      return;
    }

    const sortedFiles = onlyFile.sort((a, b) => a.mtime - b.mtime);

    const oldFile = onlyFile[onlyFile.length - 2];
    const newFile = onlyFile[onlyFile.length - 1];

    console.log("sorted files  are: ", sortedFiles)

    return {
      oldFile,
      newFile,
    };
  } catch (error) {
    console.error("An error occurred while processing files: ", error);
  }
}

export { findOldAndNewFile };