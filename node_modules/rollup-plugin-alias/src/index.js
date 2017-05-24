import { posix as path } from 'path';
import { platform } from 'os';
import fs from 'fs';

import slash from 'slash';

const VOLUME = /^([A-Z]:)/;
const IS_WINDOWS = platform() === 'win32';

// Helper functions
const noop = () => null;
const matches = (key, importee) => {
  if (importee.length < key.length) {
    return false;
  }
  if (importee === key) {
    return true;
  }
  const importeeStartsWithKey = (importee.indexOf(key) === 0);
  const importeeHasSlashAfterKey = (importee.substring(key.length)[0] === '/');
  return importeeStartsWithKey && importeeHasSlashAfterKey;
};
const endsWith = (needle, haystack) => haystack.slice(-needle.length) === needle;
const isFilePath = id => /^\.?\//.test(id);
const exists = uri => {
  try {
    return fs.statSync(uri).isFile();
  } catch (e) {
    return false;
  }
};

const normalizeId = id => {
  if (IS_WINDOWS && typeof id === 'string') {
    return slash(id.replace(VOLUME, ''));
  }

  return id;
};

export default function alias(options = {}) {
  const hasResolve = Array.isArray(options.resolve);
  const resolve = hasResolve ? options.resolve : ['.js'];
  const aliasKeys = hasResolve ?
                      Object.keys(options).filter(k => k !== 'resolve') : Object.keys(options);

  // No aliases?
  if (!aliasKeys.length) {
    return {
      resolveId: noop,
    };
  }

  return {
    resolveId(importee, importer) {
      const importeeId = normalizeId(importee);
      const importerId = normalizeId(importer);

      // First match is supposed to be the correct one
      const toReplace = aliasKeys.find(key => matches(key, importeeId));

      if (!toReplace) {
        return null;
      }

      const entry = options[toReplace];

      const updatedId = importeeId.replace(toReplace, entry);

      if (isFilePath(updatedId)) {
        const directory = path.dirname(importerId);

        // Resolve file names
        const filePath = path.resolve(directory, updatedId);
        const match = resolve.map(ext => `${filePath}${ext}`)
                            .find(exists);

        if (match) {
          return match;
        }

        // To keep the previous behaviour we simply return the file path
        // with extension
        if (endsWith('.js', filePath)) {
          return filePath;
        }

        return filePath + '.js';
      }

      return updatedId;
    },
  };
}
