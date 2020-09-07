module.exports = [
  {
    type: 'file',
    name: '1.txt'
  },
  {
    type: 'folder',
    name: 'fol1',
    children: [
      {
        type: 'file',
        name: '11.txt'
      },
      {
        type: 'folder',
        name: 'fol11',
        children: [
          {
            type: 'file',
            name: '111.txt'
          }
        ]
      }
    ]
  }
]