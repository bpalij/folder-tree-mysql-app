const express = require('express');
const cors = require('cors');
// const tree = require('./exampleTree.js');
const { saveTree, readTree } = require('./treeDatabase.js');
const readTreeFromFs = require('./readTreeFromFs.js');
const pathConfig = require('./pathConfig.js');

const app = express();

app.use(cors());

readTreeFromFs(pathConfig.path).then((tree) => {
  saveTree(tree, pathConfig.nameInDb).then(() => { 
    // console.log('saved in db');
    app.get('/', (req, res) => {
      readTree(pathConfig.nameInDb).then((t) => { 
        res.json(t)
      });
    });
    app.listen(5000, () => {
      console.log('listening 5000');
      // saveTree(tree, pathConfig.nameInDb).then(() => { console.log('saved in db') });
      // readTreeFromFs(pathConfig.path).then((t) => { console.log(JSON.stringify(t, undefined ,2)) });
      // readTree(pathConfig.nameInDb).then((t) => { console.log(JSON.stringify(t, undefined ,2)) });
    })
  });
});

// app.get('/', (req, res) => {
//   res.json(tree);
// })

// app.listen(5000, () => {
//   console.log('listening 5000');
//   // saveTree(tree, pathConfig.nameInDb).then(() => { console.log('saved in db') });
//   // readTreeFromFs(pathConfig.path).then((t) => { console.log(t) });
// })


