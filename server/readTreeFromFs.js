const fs = require('fs');
const path = require('path');

module.exports = async function readTreeFromFs (inputPath) {
  async function readSubDirTreeItemFromFs (subDirPath, subFileOrDirDirent) {
    subFileOrDirPath = path.resolve(subDirPath, subFileOrDirDirent.name);
    if (subFileOrDirDirent.isDirectory()) {
      const subFilesAndDirs = await fs.promises.readdir(subFileOrDirPath, { withFileTypes: true });
      return {
          type: 'folder',
          name: subFileOrDirDirent.name,
          children : await Promise.all(
            subFilesAndDirs.map(async (fileOrDirName) => await readSubDirTreeItemFromFs(subDirPath, fileOrDirName))
            )
        }
    } else {
      return {
          type: 'file',
          name: subFileOrDirDirent.name
        }
    }
  }

  const pathDivider = /^[a-zA-Z]:\\/.test(inputPath) /* if windows */ ? '\\' : '/';
  const dividedPath = inputPath.split(pathDivider);
  const fileOrFolderName = dividedPath[dividedPath.length - 1];
  if ((await fs.promises.stat(inputPath)).isDirectory()) {
    const subFilesAndDirs = await fs.promises.readdir(inputPath, { withFileTypes: true });
    return [
      {
        type: 'folder',
        name: fileOrFolderName,
        children : await Promise.all(
          subFilesAndDirs.map(async (fileOrDirName) => await readSubDirTreeItemFromFs(inputPath, fileOrDirName))
          )
      }
    ]
  } else {
    return [
      {
        type: 'file',
        name: fileOrFolderName
      }
    ]
  }
}