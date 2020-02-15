'use strict';

const models = require('./models');

const { hasFileField } = require('./utils/helpers');

const auth = require('./middlware/auth');

const routesMap = new Map([
  [
    'post',
    [
      { call: 'login', route: '/staffs/login', private: [], ignore: [], onlyOn: 'Staff' },
      {
        call: 'saveEntry',
        route: '/__table__',
        private: ['Ban', 'Banner', 'Board', 'Rule', 'Staff'],
        ignore: [],
        onlyOn: ''
      }
    ]
  ],
  [
    'put',
    [
      {
        call: 'updateEntry',
        route: '/__table__',
        private: ['Board', 'Post', 'Report', 'Rule', 'Staff', 'Thread'],
        ignore: ['Ban', 'Banner', 'Thread'],
        model: ''
      }
    ]
  ],
  [
    'get',
    [
      { call: 'auth', route: '/staffs/auth', private: ['Staff'], ignore: [], onlyOn: 'Staff' },
      {
        call: 'getAllEntries',
        route: '/__table__',
        private: ['Report', 'Staff'],
        ignore: ['Thread', 'Post', 'Ban'],
        onlyOn: ''
      },
      {
        call: 'getEntry',
        route: '/__table__/:__entry___id',
        private: ['Report', 'Rule', 'Staff'],
        ignore: ['Thread', 'Post', 'Ban', 'Banner', 'Report', 'Rule'],
        onlyOn: ''
      }
    ]
  ],
  [
    'delete',
    [
      {
        call: 'deleteEntry',
        route: '/__table__/:__entry___id',
        private: ['Banner', 'Board', 'Post', 'Report', 'Rule', 'Staff', 'Thread'],
        ignore: ['Ban', 'Report'],
        onlyOn: ''
      }
    ]
  ]
]);

const routes = app => {
  for (let [modelName, Model] of Object.entries(models)) {
    const table = modelName.toLowerCase() + 's';
    const entry = modelName.toLowerCase();
    const entry_id = entry + '_id';

    for (let [method, endpoints] of routesMap)
      for (let i = 0, length = endpoints.length; i < length; i++) {
        if (endpoints[i].onlyOn !== modelName || endpoints[i].ignore.includes(modelName)) continue;

        let route = endpoints[i].route.replace('__table__', table);
        const call = endpoints[i].call;

        if (route.includes('__entry___id')) route = route.replace('__entry__', entry);

        const routeCallback = (req, res) => {
          const idParam = route.includes('_id') ? [{ [entry_id]: req.params[entry_id] }] : null;
          const object = !call.includes('getAll') ? req.body : null;
          const staff = call.includes('auth') ? req.staff : null;

          const modelCallback = (err, results) => {
            if (err) return logAndSendError(err, res);

            if (!results[0].banned && (call.includes('save') || call.includes('update')))
              getEntry([Model, results[0], entry_id, res]);
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

const getEntry = ([Model, results, entry_id, response]) => {
  Model.getEntry([{ [entry_id]: results.updatedId || results.insertId }], (err, results) => {
    if (err) logAndSendError(err, response);
    else response.json(results);
  });
};

const logAndSendError = (err, res) => {
  console.error(err);
  res.status(err.status).send(err.msg);
};

module.exports = routes;
