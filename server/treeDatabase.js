const db = require('./models/index.js');
const readTreeFromFs = require('./readTreeFromFs.js');

async function saveTree(tree, treeName) {
  async function saveFileOrFolder(fileOrFolder) {
    if (fileOrFolder.type === 'folder') {
      const folder = fileOrFolder;
      return await saveFolder(folder)
    }
    if (fileOrFolder.type === 'file') {
      const file = fileOrFolder;
      return await saveFile(file)
    }
    throw new Error('Incorrect item type');
  }
  async function saveFolder({ name, children }) {
    const folderChildrenIds = await Promise.all(children.map(async (folderChild) => {
      return await saveFileOrFolder(folderChild)
    }));

    const created = await db.Folder.create({ name, children: folderChildrenIds.join(';')});
    return `fo${created.id}`
  }
  async function saveFile({ name }) {
    const created = await db.File.create({ name });
    return `fi${created.id}`;
  }

  const treeChildrenIds = await Promise.all(tree.map(async (treeItem) => {
    return await saveFileOrFolder(treeItem);
  }));

  await db.Root.create({ name: treeName, children: treeChildrenIds.join(';')});
}

async function readTree (treeName) {
  function getIdFromStr(idStr) {
    let id = '';
    for(let i = 2; i < idStr.length; i++) {
      id+=idStr[i];
    }
    return +id;
  }

  async function readFileOrFolder(fileOrFolderStrWithId) {
    if(/^fo[0-9]+$/.test(fileOrFolderStrWithId)){
      return await readFolder(getIdFromStr(fileOrFolderStrWithId));
    }
    if(/^fi[0-9]+$/.test(fileOrFolderStrWithId)){
      return await readFile(getIdFromStr(fileOrFolderStrWithId));
    }
    throw new Error('Incorrect string with id!');
  }
  
  async function readFolder(folderId) {
    const folder = await db.Folder.findOne({
      where: {
        id: folderId
      }
    })

    const childrenIds = folder.children.split(';');
    const children = await Promise.all(childrenIds.map(async (childId) => {
      return await readFileOrFolder(childId)
    }))

    return {
      type: 'folder',
      name: folder.name,
      children
    }
  }

  async function readFile(fileId) {
    const file = await db.File.findOne({
      where: {
        id: fileId
      }
    })

    return {
      type: 'file',
      name: file.name
    }
  }

  const gotRoot = await db.Root.findOne({
    where: {
      name: treeName
    }
  })

  const childrenIdStrings = gotRoot.children.split(';');

  return await Promise.all(childrenIdStrings.map(async (childIdStr) => {
    return await readFileOrFolder(childIdStr)
  }))
}

module.exports = {
  saveTree,
  readTree
}