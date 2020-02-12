'use strict';

const processNestedResults = ([table, results, foreignTable]) => {
  let processedResults = [];
  let processedIds = [];

  for (let i = 0, length = results.length; i < length; i++) {
    const row = results[i];
    let entry = row[table];

    const generatedColumns = Object.keys(results[0]).filter(key => key === '');

    if (generatedColumns.length > 0) {
      for (let i = 0, length = generatedColumns.length; i < length; i++) {
        const gendFields = row[generatedColumns[i]];
        const genFieldsMap = new Map(Object.entries(gendFields));

        for (const [field, value] of genFieldsMap) {
          entry[field] = value;
          delete row[generatedColumns[i]];
        }
      }
    }

    const idField = table.toLowerCase().slice(0, -1) + '_id';

    if (foreignTable !== undefined) {
      const foreignTableColumnKey = foreignTable.toLowerCase().slice(0, -1) + '_id';

      entry[foreignTable] = row[foreignTable];
      delete entry[foreignTableColumnKey];
    }

    if (!processedIds.includes(entry[idField])) {
      if (foreignTable !== undefined) entry[foreignTable] = [entry[foreignTable]];

      processedResults.push(entry);
      processedIds.push(entry[idField]);
    } else {
      processedResults.map(res => {
        if (res[idField] === entry[idField]) {
          if (foreignTable !== undefined) {
            const foreignTableColumnKey = foreignTable.toLowerCase().slice(0, -1) + '_id';

            if (
              !res[foreignTable].some(
                obj => obj[foreignTableColumnKey] === entry[foreignTable][foreignTableColumnKey]
              )
            )
              res[foreignTable].push(entry[foreignTable]);
          }
        }
      });
    }
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
