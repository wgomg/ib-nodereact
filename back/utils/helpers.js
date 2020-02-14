'use strict';

const ip = require('../utils/ip');

const processNestedResults = ([table, results, foreignTables]) => {
  let processedResults = [];

  for (let i = 0, length = results.length; i < length; i++) {
    const row = results[i];
    let entry = row[table];

    const generatedColumns = Object.keys(row).filter(key => key === '');

    if (generatedColumns.length > 0)
      for (let i = 0, length = generatedColumns.length; i < length; i++) {
        const gendFields = Object.entries(row[generatedColumns[i]])[0];

        delete row[generatedColumns[i]];

        for (let model in row) {
          if (row[model][gendFields[0]]) {
            if (ip.isV4(gendFields[1])) row[model][gendFields[0]] = ip.hashV4(gendFields[1]);
            else if (ip.isV6(gendFields[1])) row[model][gendFields[0]] = ip.hashV6(gendFields[1]);
            else row[model][gendFields[0]];
          }

          if (row[model].password) delete row[model].password;
        }
      }

    if (foreignTables && foreignTables.length > 0)
      for (const { tableIdField, tableName } of foreignTables) {
        entry[tableName] = row[tableName];
        delete entry[tableIdField];
      }

    processedResults.push(entry);
  }

  return processedResults;
};

const hasFileField = modelSchema => {
  for (const field in modelSchema)
    if (!modelSchema[field].pk && modelSchema[field].type.includes('file')) return true;

  return false;
};

module.exports = {
  processNestedResults,
  hasFileField
};

/**************************************************************************************/
/**************************************************************************************/
/**************************************************************************************/
/**************************************************************************************/
// if (!processedIds.includes(entry[idField])) {
//   if (foreignTable !== undefined) entry[foreignTable] = [entry[foreignTable]];

//   processedResults.push(entry);
//   processedIds.push(entry[idField]);
// } else
//   processedResults.map(res => {
//     if (res[idField] === entry[idField] && foreignTable !== undefined) {
//       const foreignTableColumnKey = foreignTable.toLowerCase().slice(0, -1) + '_id';

//       if (
//         !res[foreignTable].some(
//           obj => obj[foreignTableColumnKey] === entry[foreignTable][foreignTableColumnKey]
//         )
//       )
//         res[foreignTable].push(entry[foreignTable]);
//     }
//   });
