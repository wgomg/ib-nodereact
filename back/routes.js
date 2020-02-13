'use strict';

const models = require('./models');

const { hasFileField } = require('./utils/helpers');

const auth = require('./middlware/auth');

const routesMap = new Map([
  [
    'post',
    [
      { call: 'login', route: '/staffs/login', private: [], model: 'Staff' },
      {
        call: 'saveEntry',
        route: '/__table__',
        private: ['Ban', 'Banner', 'Board', 'Complaint', 'Rule', 'Staff']
      }
    ]
  ],
  [
    'put',
    [
      {
        call: 'updateEntry',
        route: '/__table__',
        private: ['Ban', 'Banner', 'Board', 'Complaint', 'Post', 'Report', 'Rule', 'Staff', 'Thread']
      }
    ]
  ],
  [
    'get',
    [
      { call: 'auth', route: '/staffs/auth', model: 'Staff', private: ['Staff'] },
      { call: 'getAllEntries', route: '/__table__', private: ['Ban', 'Complaint', 'Report', 'Staff'] },
      {
        call: 'getEntry',
        route: '/__table__/:__entry___id',
        private: ['Ban', 'Complaint', 'Report', 'Rule', 'Staff']
      }
    ]
  ],
  [
    'delete',
    [
      {
        call: 'deleteEntry',
        route: '/__table__/:__entry___id',
        private: ['Ban', 'Banner', 'Board', 'Complaint', 'Post', 'Report', 'Rule', 'Staff', 'Thread']
      }
    ]
  ]
]);

const logAndSendError = (err, res) => {
  console.error(err);
  res.status(err.status).send(err.msg);
};

const getEntry = ([model, results, entry_id, response]) => {
  model.getEntry([{ [entry_id]: results.updatedId || results.insertId }], (err, results) => {
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
        if (endpoints[i].model && endpoints[i].model !== modelName) continue;

        let route = endpoints[i].route.replace('__table__', table);
        const call = endpoints[i].call;

        if (route.includes('__entry___id')) route = route.replace('__entry__', entry);

        const routeCallback = (req, res) => {
          const idParam = route.includes('_id') ? [{ [entry_id]: req.params[entry_id] }] : null;
          const object = !call.includes('getAll') ? req.body : null;
          const staff = call.includes('auth') ? req.staff : null;

          const modelCallback = (err, results) => {
            if (err) return logAndSendError(err, res);

            if (call.includes('save') || call.includes('update'))
              getEntry([Model, results, entry_id, res]);
            else res.json(results);
          };

          if (object && hasFileField(Model._schema)) object.files = req.files;

          let modelArgs = [modelCallback];
          if (idParam || object || staff) modelArgs.unshift(idParam || object || staff);

          Model[call](...modelArgs);
        };

        let routeArgs = [route];

        if (endpoints[i].private.includes(modelName)) routeArgs.push(auth);

        routeArgs.push(routeCallback);

        app[method](...routeArgs);
      }
  }
};
