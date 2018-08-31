import * as yeoman from 'yeoman-environment';
import * as _ from 'lodash';
import { ScaffoldingOptions } from '../common/scaffolding-protocol';
// import * as SmartHomeAppGenerator from 'generator-smart-home-app';


export const createSmartAppProject = (opts: ScaffoldingOptions) => {
  const env = yeoman.createEnv();
  
  // Get provided options and use default options were none were provided
  const options = _.assign({}, defaultOptions, opts);

  // Run the smart-home-app generator and hand in the options
  env.lookup(() => {
    env.run(['smart-home-app', options.appName, options.appNameSpace, options.appDescription, options.authorName, options.destinationPath], options, err => {
      console.log('smart-home-app generator done.');
    })
  });
}

const defaultOptions: ScaffoldingOptions = {
  appName: 'AppName',
  appDescription: 'App Description',
  appNameSpace: 'smarthome.example.apps',
  authorName: 'Anonymous'
}