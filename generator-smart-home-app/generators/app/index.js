var path = require('path');
var fs = require('fs');

'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    this.argument('appName', { type: String, required: true });
    this.argument('appNameSpace', { type: String, required: true });
    this.argument('appDescription', { type: String, required: true });
    this.argument('authorName', { type: String, required: true });
    this.argument('destinationPath', { type: String, required: false });
    console.log('handed in destination path', this.options.destinationPath);

    if (this.options.destinationPath !== undefined && this.options.destinationPath !== null) {
      this.destinationRoot(this.options.destinationPath);
    }
    this.log('Destination root:', this.destinationRoot());
  }

  // prompting() {
  //   // Have Yeoman greet the user.
  //   this.log(
  //     yosay(`Welcome to the ${chalk.red('Smart Home App')} generator!`)
  //   );

  //   const prompts = [
  //     {
  //       type: 'input',
  //       name: 'appNameSpace',
  //       message: 'App Name Space defines as a valid Java package name',
  //       default: 'myapp'
  //     },
  //     {
  //       type: 'input',
  //       name: 'appName',
  //       message: 'App Name',
  //       default: 'MyApp'
  //     },
  //     {
  //       type: 'input',
  //       name: 'appDescription',
  //       message: 'App Description',
  //       default: 'App Description'
  //     },
  //     {
  //       type: 'input',
  //       name: 'authorName',
  //       message: 'Author\'s Name',
  //       default: 'Anonymous'
  //     }
  //   ];

  //   return this.prompt(prompts).then(props => {
  //     // To access props later use this.options.someAnswer;
  //     this.options = props;
  //   });
  // }

  writing() {
    this.log('Recorded user input:');
    this.log('appNameSpace', this.options.appNameSpace);
    this.log('appName', this.options.appName);
    this.log('appDescription', this.options.appDescription);
    this.log('authorName', this.options.authorName);

    this.fs.copy(
      this.templatePath('.classpath'),
      this.destinationPath('.classpath'),
    );
    this.fs.copy(
      this.templatePath('build.properties'),
      this.destinationPath('build.properties'),
    );
    this.fs.copy(
      this.templatePath('.settings/org.eclipse.jdt.core.prefs'),
      this.destinationPath('.settings/org.eclipse.jdt.core.prefs'),
    );
    this.fs.copyTpl(
      this.templatePath('pom.xml'),
      this.destinationPath('essh-pom.xml'),
      {
        artifactId: this.options.appName.toLowerCase(),
        groupId: this.options.appNameSpace
      }
    )

    const bundleSymbolicName = `${this.options.appNameSpace}.${this.options.appName.toLowerCase().replace(/\s+/g, '')}`
    // Manifest
    this.fs.copyTpl(
      this.templatePath('META-INF/MANIFEST.MF'),
      this.destinationPath('META-INF/MANIFEST.MF'),
      {
        bundleName: this.options.appName + "\n",
        bundleSymbolicName: bundleSymbolicName + "\n"
      }
    )

    // .project
    this.fs.copyTpl(
      this.templatePath('.project'),
      this.destinationPath('.project'),
      {
        projectName: bundleSymbolicName
      }
    )

    // icons
    this.fs.copy(
      this.templatePath('icons/home.png'),
      this.destinationPath('icons/home.png'),
    )

    // Libs
    const libPaths = fs.readdirSync(this.templatePath('lib'))
    console.log('libPaths', libPaths);
    libPaths.forEach(libPath => {
      this.fs.copy(
        this.templatePath(path.join('lib', libPath)),
        this.destinationPath(path.join('lib', libPath)))
    });

    const packagePath = path.join(...this.options.appNameSpace.split('.'));
    // App Class
    this.fs.copyTpl(
      this.templatePath('App.java'),
      this.destinationPath(path.join('src', packagePath, 'App.java')),
      { packageName: this.options.appNameSpace }
    )

    // App Description
    this.fs.copyTpl(
      this.templatePath('AD-INF/APP.ad'),
      this.destinationPath('AD-INF/APP.ad'),
      {
        id: bundleSymbolicName,
        bundle: bundleSymbolicName,
        classname: this.options.appNameSpace + '.App',
        description: this.options.appDescription,
        name: this.options.appName,
        author: this.options.authorName
      }
    )

    // Unit Test Class
    const appClassPath = this.options.appNameSpace.split('.').join('/');
    this.fs.copyTpl(
      this.templatePath('AppTest.java'),
      this.destinationPath(path.join('test', packagePath, 'AppTest.java')),
      { packageName: this.options.appNameSpace }
    )
  }

};
