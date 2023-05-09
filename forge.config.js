module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [

    {
      name: '@electron-forge/maker-deb',
      config: {
        platfrom: 'linux',
        arch: 'all'
      },
    },  
    
  ],
};
