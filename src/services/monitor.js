"use strict";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { findOldAndNewFile } from "../utils/helper.js";

async function monitor() {
  const file = await findOldAndNewFile();

  const newFile = file.newFile.path;
  const oldFile = file.oldFile.path;

  const newFileRead = await fs.readFile(newFile);
  const oldFileRead = await fs.readFile(oldFile);

  const newFileData = JSON.parse(newFileRead);
  const oldFileData = JSON.parse(oldFileRead);

  function findChanges(newFile, oldFile) {
    let changes = [];

    const oldMap = new Map(oldFile.map((item) => [item.name, item]));

    newFile.forEach((newItem) => {
      const oldItem = oldMap.get(newItem.name);

      if (!oldItem) {
        changes.push({
          id: newItem.name,
          type: "added",
          data: newItem,
        });
      } else {
        const itemChanges = {};

        if (oldItem.name !== newItem.name)
          itemChanges.name = { from: oldItem.name, to: newItem.name };
        if (oldItem.price !== newItem.price)
          itemChanges.price = { from: oldItem.price, to: newItem.price };
        if (oldItem.rating !== newItem.rating)
          itemChanges.rating = { from: oldItem.rating, to: newItem.rating };
        if (oldItem.availability !== newItem.availability)
          itemChanges.availability = {
            from: oldItem.availability,
            to: newItem.availability,
          };
        if (oldItem.reviews !== newItem.reviews)
          itemChanges.reviews = {
            from: oldItem.reviews,
            to: newItem.reviews,
          };

        if (Object.keys(itemChanges).length > 0) {
          changes.push({
            id: newItem.name,
            type: "updated",
            changes: itemChanges,
          });
        }
      }
    });

    const newIds = new Set(newFile.map((item) => item.name));
    oldFile.forEach((itemOld) => {
      if (!newIds.has(itemOld.name)) {
        changes.push({
          id: itemOld.name,
          type: "deleted",
          data: itemOld,
        });
      }
    });

    return changes;
  }
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const resultPath = path.join(__dirname, "..", "/data/result.json");
  const data = findChanges(newFileData, oldFileData);
  await fs.writeFile(resultPath, JSON.stringify(data, null, 2));
}

export { monitor };