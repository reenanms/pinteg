#!/usr/bin/env node

const fs = require('fs');

const DEFINE_LIST_START = "begin";
const DEFINE_LIST_SEPARATOR = ":";
const DEFINE_LIST_END = "end";
const DEFINE_VAR_START = "${";
const DEFINE_VAR_END = "}";
const PROPERTY_SEPARATOR = ".";

function readData(dataPath) {
  const data = fs.readFileSync(dataPath);
  const dataObject = JSON.parse(data);
  return dataObject;
}

function readTemplate(templatePath) {
  const data = fs.readFileSync(templatePath);
  const templateText = data.toString();
  return templateText;
}

function findVariablesInText(text) {
  const variables = new Set();

  let currentIndex = 0;
  while (currentIndex < text.length) {
    let variable = findNextVariable(text, currentIndex);
    if (variable == null)
      break;

    let listVariable = findNextListVariable(text, variable);
    if (listVariable != null)
      variable = listVariable;
    
      variables.add(variable);
      currentIndex = variable.endIndex;
  }
  
  return Array.from(variables);
}

function findNextVariable(text, startIndex) {
  const varStartIndex = text.indexOf(DEFINE_VAR_START, startIndex);
  if (varStartIndex == -1)
    return null;

  const endIndex = text.indexOf(DEFINE_VAR_END, varStartIndex + DEFINE_VAR_START.length);
  if (endIndex == -1)
    throw new Error(`Variable end not found ${DEFINE_VAR_END}`);

  const varEndIndex = endIndex + DEFINE_VAR_END.length;
  const varName = text.substring(varStartIndex + DEFINE_VAR_START.length, endIndex);
  const fullVarText = text.substring(varStartIndex, varEndIndex);

  return {
    startIndex: varStartIndex,
    endIndex: varEndIndex,
    internalText: varName,
    fullText: fullVarText,
    propertyPath: varName,
    isList: false
  }
}

function findNextListVariable(text, variable) {
  const listVarStartName = `${DEFINE_LIST_START}${DEFINE_LIST_SEPARATOR}`;
  if (!variable.internalText.startsWith(listVarStartName))
    return null;
  
  const listVarName = variable.internalText.substring(listVarStartName.length)
  const listVarEndName = `${DEFINE_VAR_START}${DEFINE_LIST_END}${DEFINE_LIST_SEPARATOR}${listVarName}${DEFINE_VAR_END}`
  const listVarEndIndex = text.indexOf(listVarEndName, variable.endIndex);
  if (listVarEndIndex == -1)
    throw new Error(`List variable end not found ${listVarEndName}`);

  const startIndex = variable.startIndex;
  const endIndex = listVarEndIndex + listVarEndName.length;
  const internalText = text.substring(variable.endIndex, listVarEndIndex);
  const fullText = text.substring(startIndex, endIndex);
  const propertyPath = listVarName;

  return {
    startIndex,
    endIndex,
    internalText,
    fullText,
    propertyPath,
    isList: true
  }
}

function findVariableValues(variables, dataObject, objectPrefix) {
  const variablesAndValues = [];
  for (const variable of variables) {
    if (objectPrefix == `${variable.propertyPath}${PROPERTY_SEPARATOR}`) {
      variablesAndValues.push({
        variable,
        value: dataObject
      });
      
      continue;
    }

    const path = variable.propertyPath.substring(objectPrefix.length)
    console.log("path", path, objectPrefix);
    if (variable.isList) {
      const subValues = findPropertyValue(path, dataObject);
      const subVariables = findVariablesInText(variable.internalText);
      const values = [];
      for (const subValue of subValues) {
        //const subObjectPrefix = `${objectPrefix}${variable.propertyPath}`;
        const subObjectPrefix = variable.propertyPath;
        const subVariablesWithPrefix = subVariables.filter(v => v.propertyPath.startsWith(subObjectPrefix));

        console.log("variable:", variable);
        console.log("subVariables:", subVariables);
        console.log("objectPrefix:", objectPrefix);
        
        console.log("findVariableValues:", subVariablesWithPrefix, subValue, `${subObjectPrefix}${PROPERTY_SEPARATOR}`);
        const subVariablesAndValues = findVariableValues(subVariablesWithPrefix, subValue, `${subObjectPrefix}${PROPERTY_SEPARATOR}`);
        console.log("subVariablesAndValues:", subVariablesAndValues);
        // to add external variables, add here the call to findVariableValues:
        // param1: subVariables filtered without starting with the prefix
        // param2: dataObject
        // param3: ""
        values.push(subVariablesAndValues)
      }
      variablesAndValues.push({
        variable,
        value: values
      });
    }
    else {
      const value = findPropertyValue(path, dataObject);
      variablesAndValues.push({
        variable,
        value
      });
    }
  }

  return variablesAndValues;
}

function findPropertyValue(propertyPath, dataObject) {
  let value = dataObject;
  const properties = propertyPath.split(PROPERTY_SEPARATOR);
  for (const property of properties) {
    if (value == null)
      break;

    value = value[property];
  }

  return value;
}

function replaceVariables(templateText, variablesAndValues) {
  let finalText = templateText;
  for (const variableAndValue of variablesAndValues) {
    if (variableAndValue.variable.isList) {
      let subFinalText = "";
      for (const subVariableAndValue of variableAndValue.value) {
        subFinalText += replaceVariables(variableAndValue.variable.internalText, subVariableAndValue);
      }
      
      finalText = finalText.replace(variableAndValue.variable.fullText, subFinalText);
    }
    else {
      finalText = finalText.replace(variableAndValue.variable.fullText, variableAndValue.value);
    }
  }

  return finalText;
}

function writeOutputFile(text, filePath) {
  fs.writeFileSync(filePath, text);
}

function buildResume(dataPath, templatePath) {
  const dataObject = readData(dataPath);
  const templateText = readTemplate(templatePath);
  const variables = findVariablesInText(templateText);
  const variablesAndValues = findVariableValues(variables, dataObject, "");
  const finalText = replaceVariables(templateText, variablesAndValues);
  return finalText;
}

async function convertHtmlToPdf(htmlContent, pdfPath) {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    await page.pdf({
      path: pdfPath,
      format: 'letter',
      printBackground: true,
      scale: 0.78,
      margin: {
        top: '12mm',
        right: '12mm',
        bottom: '12mm',
        left: '12mm'
      }
    });
  } finally {
    await browser.close();
  }
}

const { program } = require('commander');

program
  .option("-j, --json <char>", "JSON file name", "data")
  .option("-t, --template <char>", "Template folder name", "template")
  .option("-r, --resultado <char>", "Result file name", "result")
  .option("-o, --output <format>", "Output format: html or pdf", "html");

program.parse();
const options = program.opts();

const dataFile = options.json;
const templateFolder = options.template;
const resultFile = options.resultado;
const outputFormat = options.output.toLowerCase();

if (outputFormat !== 'html' && outputFormat !== 'pdf') {
  console.error("Error: output format must be 'html' or 'pdf'");
  process.exit(1);
}

const outputPath = `${resultFile}.${outputFormat}`;

async function run() {
  console.log("Building resume...", `${dataFile}.json`, `${templateFolder}/index.html`, outputPath);
  const htmlContent = buildResume(`${dataFile}.json`, `${templateFolder}/index.html`);

  switch (outputFormat) {
    case 'html':
      writeOutputFile(htmlContent, outputPath);
      break;
    case 'pdf':
      await convertHtmlToPdf(htmlContent, outputPath);
      break;
    default:
      throw new Error(`Invalid format: ${outputFormat}`);
  }

  console.log("Completed!");
}

run().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
