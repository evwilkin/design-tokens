const JSZip = require('jszip');
const zip = new JSZip();

console.clear();

/* MAIN function */

figma.ui.onmessage = (e) => {
  console.log('code received message', e);
  if (e.type === 'IMPORT') {
    const { selectedCollection, selectedMode, body } = e;
    importJSONFile({ selectedCollection, selectedMode, body });
    getExistingCollectionsAndModes();
  } else if (e.type === 'EXPORT') {
    exportToJSON();
  }
};
if (figma.command === 'export') {
  figma.showUI(__uiFiles__['export'], {
    width: 820,
    height: 600,
    themeColors: true
  });
}

/* EXPORT Functionality */

/* EXPORT - main function */

function exportToJSON() {
  const collections = figma.variables.getLocalVariableCollections();

  const files = [];
  collections.forEach((collection) => files.push(...processCollection(collection)));

  debugger;
  console.log('files: ', files, collections);

  figma.ui.postMessage({ type: 'EXPORT_RESULT', files });
}

/* EXPORT - helper functions */

function processCollection({ name, modes, variableIds }) {
  const files = [];
  modes.forEach((mode) => {
    let file = {
      fileName: `${name}.${mode.name}.tokens.json`,
      downloadName: getDownloadName(name, mode),
      body: {}
    };

    variableIds.forEach((variableId) => {
      const { name, resolvedType, valuesByMode } = figma.variables.getVariableById(variableId);
      const value = valuesByMode[mode.modeId];

      if (value !== undefined && ['COLOR', 'FLOAT', 'STRING'].includes(resolvedType)) {
        let obj = file.body;
        name.split('/').forEach((groupName) => {
          obj[groupName] = obj[groupName] || {};
          obj = obj[groupName];
        });

        if (value.type === 'VARIABLE_ALIAS') {
          obj.$type = resolvedType === 'COLOR' ? 'color' : 'number';
          obj.$value = `{${figma.variables.getVariableById(value.id).name.replace(/\//g, '.')}}`;
        } else if (resolvedType === 'COLOR') {
          obj.$type = 'color';
          obj.$value = rgbToHex(value);
        } else if (resolvedType === 'FLOAT') {
          obj.$type = 'number';
          obj.$value = value;
        } else if (resolvedType === 'STRING') {
          obj.$type = 'string';
          obj.$value = value;
        }
      }
    });
    files.push(file);
  });
  return files;
}

function rgbToHex({ r, g, b, a }) {
  if (a !== 1) {
    return `rgba(${[r, g, b].map((n) => Math.round(n * 255)).join(', ')}, ${a.toFixed(4)})`;
  }
  const toHex = (value) => {
    const hex = Math.round(value * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const hex = [toHex(r), toHex(g), toHex(b)].join('');
  return `#${hex}`;
}

//
// from export.html
//

if (pluginMessage.type === 'EXPORT_RESULT') {
  let saveFileName = '';
  let textOutput = pluginMessage.files
    .map(({ fileName, body }) => `/* ${fileName} */\n\n${JSON.stringify(body, null, 2)}`)
    .join('\n\n\n');
  textOutput = textOutput.replaceAll('$type', 'type').replaceAll('$value', 'value');
  // document.querySelector("textarea").innerHTML = textOutput;

  saveVars(textOutput, saveFileName);
}

function saveVars(text) {
  var splitFiles = text.split('\n\n\n');

  for (var i = 0; i < splitFiles.length; i++) {
    var splitFileName = splitFiles[i].split('\n', 1)[0];
    var saveFileName = '';

    switch (splitFileName) {
      case '/* Base Dimension Tokens.Mode 1.tokens.json */':
        saveFileName = 'base.dimension.json';
        break;
      case '/* Base Color Tokens - Light.Value.tokens.json */':
        saveFileName = 'base.json';
        break;
      case '/* Color Palette.Mode 1.tokens.json */':
        saveFileName = 'palette.color.json';
        break;
      case '/* Semantic Dimension Tokens.Mode 1.tokens.json */':
        saveFileName = 'semantic.dimension.json';
        break;
      case '/* Semantic Color Tokens.Light.tokens.json */':
        saveFileName = 'semantic.json';
        break;
      case '/* Base Color Tokens - Dark.Mode 1.tokens.json */':
        saveFileName = 'base.dark.json';
        break;
      case '/* Semantic Color Tokens.Dark.tokens.json */':
        saveFileName = 'semantic.dark.json';
        break;
      case '/* Charts.Light.tokens.json */':
        saveFileName = 'charts.json';
        break;
      case '/* Charts.Dark.tokens.json */':
        saveFileName = 'charts.dark.json';
        break;
      case '/* Base Motion Tokens.Mode 1.tokens.json */':
        saveFileName = 'base.motion.json';
        break;
      case '/* Semantic Motion Tokens.Mode 1.tokens.json */':
        saveFileName = 'semantic.motion.json';
        break;
      default:
        saveFileName = splitFiles[i].split('\n', 1)[0];
    }

    const fileToExport = splitFiles[i].substring(splitFiles[i].indexOf('\n') + 1);
    var textToSaveAsBlob = new Blob([fileToExport], { type: 'text/plain' });

    // createLink(textToSaveAsBlob, saveFileName);
  }
}

// function createLink(text, file) {
//   var textToSaveAsURL = window.URL.createObjectURL(text);
//   var downloadLink = document.createElement("a");

//   downloadLink.download = file;
//   downloadLink.innerHTML = file;
//   downloadLink.href = textToSaveAsURL;
//   document.body.appendChild(downloadLink);
// }

// New extracted funcs

const getDownloadName = (name, mode) => {
  let downloadName = '';
  switch (splitFileName) {
    case name === 'Base Dimension Tokens' || mode === 'Mode 1':
      downloadName = 'base.dimension.json';
      break;
    case name === 'Base Color Tokens - Light' && mode === 'Value':
      downloadName = 'base.json';
      break;
    case name === 'Color Palette' && mode === 'Mode 1':
      downloadName = 'palette.color.json';
      break;
    case name === 'Semantic Dimension Tokens' && mode === 'Mode 1':
      downloadName = 'semantic.dimension.json';
      break;
    case name === 'Semantic Color Tokens' && mode === 'Light':
      downloadName = 'semantic.json';
      break;
    case name === 'Base Color Tokens - Dark' && mode === 'Mode 1':
      downloadName = 'base.dark.json';
      break;
    case name === 'Semantic Color Tokens' && mode === 'Dark':
      downloadName = 'semantic.dark.json';
      break;
    case name === 'Charts' && mode === 'Light':
      downloadName = 'charts.json';
      break;
    case name === 'Charts' && mode === 'Dark':
      downloadName = 'charts.dark.json';
      break;
    case name === 'Base Motion Tokens' && mode === 'Mode 1':
      downloadName = 'base.motion.json';
      break;
    case name === 'Semantic Motion Tokens' && mode === 'Mode 1':
      downloadName = 'semantic.motion.json';
      break;
    default:
      downloadName = `${name}.json`;
  }
  return downloadName;
};
