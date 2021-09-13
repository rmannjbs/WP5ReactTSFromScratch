import path from 'path'; //path library from node.js

function paths() {
    this.root = path.resolve(path.join(__dirname), '../../');
    this.src = path.join(this.root, 'src');
    this.srcIndexEntry = path.join(this.src, 'index.tsx');
    this.srcScss = path.join(this.src, 'assets', 'scss');
    this.srcScssEntry = path.join(this.srcScss, 'app.scss');
    this.srcScssVendorEntry = path.join(this.srcScss, 'vendor.scss');
    
    this.dst = path.join(this.root, 'dist');
    
    this.build = path.join(this.root, 'build');
    this.buildHtmlTemplates = path.join(this.build, 'htmlTemplates');
    this.buildHtmlTemplatesLocalIndex = path.join(this.buildHtmlTemplates, 'local.index.html');

    this.nodemodules = path.join(this.root, 'node_modules');    
}

export default new paths();


