'use strict';

const models = require('./models');

const { hasFileField } = require('./utils/helpers');

const routesMap = new Map([
  ['post', [{ call: 'saveEntry', route: '/__table__' }]],
  ['put', [{ call: 'updateEntry', route: '/__table__' }]],
  [
    'get',
    [
      { call: 'getAllEntries', route: '/__table__' },
      { call: 'getEntry', route: '/__table__/:__entry___id' }
    ]
  ],
  ['delete', [{ call: 'deleteEntry', route: '/__table__/:__entry___id' }]]
]);

const logAndSendError = (err, res) => {
  console.error(err);
  res.status(err.status).send(err.msg);
};

const getEntry = (model, results, response) => {
  model.getEntry(results.updatedId || results.insertId, (err, results) => {
    if (err) logAndSendError(err, response);
    else response.json(results);
  });
};

module.exports = app => {
  for (let [modelName, Model] of Object.entries(models)) {
    const table = modelName.toLowerCase() + 's';
    const entry = modelName.toLowerCase();
    const entry_id = entry + '_id';

    for (let [method, endpoints] of routesMap)
      for (let i = 0, length = endpoints.length; i < length; i++) {
        let route = endpoints[i].route.replace('__table__', table);
        const call = endpoints[i].call;

        if (route.includes('__entry___id')) route = route.replace('__entry__', entry);

        app[method](route, (req, res) => {
          const idParam = route.includes('_id') ? req.params[entry_id] : null;
          const object = !call.includes('getAll') ? req.body : null;

          const callback = (err, results) => {
            if (err) logAndSendError(err, res);
            else {
              if (call.includes('save') || call.includes('update')) getEntry(Model, results, res);
              else res.json(results);
            }
          };

          if (object && hasFileField(Model._schema)) object.files = req.files;

          let args = [callback];
          if (idParam || object) args.unshift(idParam || object);

          Model[call](...args);
        });
      }
  }
};
