import { getBaseWebPackConfig } from './baseWebPackConfig';

function getLocalWebPackConfig(env, argv) {    
    const webPackConfig = getBaseWebPackConfig(env, argv);
    //here you can make changes to or override things in the config object passed 
    //back from getBaseWebPackConfig before returning it.  We've simply wrapped the base function
    //i.e you could change the webPackDev Server, or change paths config, etc w/e you need to 
    //be different.
    return webPackConfig;
}

module.exports = getLocalWebPackConfig


