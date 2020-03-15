'use strict';

const models = require('./models');

const { hasFileField } = require('./utils/helpers');

const auth = require('./middlware/auth');

const routesMap = new Map([
  [
    'post',
    [
      { call: 'login', route: '/staffs/login', applyOn: ['Staff'], private: [] },
      {
        call: 'saveEntry',
        route: '/__table__',
        applyOn: ['Ban', 'Banner', 'Board', 'Post', 'Report', 'Rule', 'Staff', 'Thread'],
        private: ['Ban', 'Banner', 'Board', 'Rule', 'Staff']
      }
    ]
  ],
  [
    'put',
    [
      {
        call: 'updateEntry',
        route: '/__table__',
        applyOn: ['Board', 'Post', 'Report', 'Rule', 'Staff', 'Thread'],
        private: ['Board', 'Post', 'Report', 'Rule', 'Staff', 'Thread']
      }
    ]
  ],
  [
    'get',
    [
      { call: 'getAllLatests', route: '/posts/latests', applyOn: ['Post'], private: [] },
      { call: 'auth', route: '/staffs/auth', applyOn: ['Staff'], private: ['Staff'] },
      {
        call: 'getAllForBoard',
        route: '/banners/:board_id',
        argModel: 'Board',
        applyOn: ['Banner'],
        private: []
      },
      {
        call: 'getAllEntries',
        route: '/__table__',
        applyOn: ['Banner', 'Board', 'Report', 'Rule', 'Staff'],
        private: ['Report', 'Staff']
      },
      {
        call: 'getEntry',
        route: '/boards/:uri',
        applyOn: ['Board'],
        private: []
      },
      {
        call: 'getEntry',
        route: '/__table__/:__entry___id',
        applyOn: ['Staff'],
        private: ['Staff']
      }
    ]
  ],
  [
    'delete',
    [
      {
        call: 'deleteEntry',
        route: '/__table__/:__entry___id',
        applyOn: ['Ban', 'Board', 'Banner', 'Post', 'Rule', 'Staff', 'Thread'],
        private: ['Banner', 'Board', 'Post', 'Rule', 'Staff', 'Thread']
      }
    ]
  ]
]);

const routes = app => {
  for (let [method, endpoints] of routesMap)
    endpoints.forEach(ep => ep.applyOn.forEach(modelName => app[method](...routeArgs(ep, modelName))));
};

const routeArgs = (endpoint, modelName) => {
  const entry = endpoint.argModel ? endpoint.argModel.toLowerCase() : modelName.toLowerCase();
  const table = entry + 's';

  let route = endpoint.route.replace('__table__', table);

  if (route.includes('__entry___id')) route = route.replace('__entry__', entry);

  const routeCallback = (req, res) => {
    const Model = models[modelName];
    const call = endpoint.call;

    let paramValue = null;
    let paramField = null;
    if (route.includes(':')) {
      paramField = route.includes('_id') ? entry + '_id' : 'uri';
      paramValue = [{ [paramField]: req.params[paramField] }];
    }

    const object = !call.includes('getAll') ? req.body : null;
    const staff = call.includes('auth') ? req.staff : null;

    const modelCallback = (err, results) => {
      if (err) return logAndSendError(err, res);

      if (results[0] && !results[0].banned && (call.includes('save') || call.includes('update')))
        getEntry([Model, results[0], entry + '_id', res]);
      else res.json(results);
    };

    if (object && hasFileField(Model._schema)) object.files = req.files;
    if (object && (modelName === 'Thread' || modelName === 'Post')) object.user = req.ip;

    let modelArgs = [modelCallback];
    if (paramValue || staff || object)
      if (!call.includes('getAll')) modelArgs.unshift(paramValue || staff || object);
      else modelArgs.push(paramValue || staff || object);

    Model[call](...modelArgs);
  };

  let routeArgs = [route];

  if (endpoint.private.includes(modelName)) routeArgs.push(auth);

  routeArgs.push(routeCallback);

  return routeArgs;
};

const getEntry = ([Model, results, entry_id, response]) => {
  Model.getEntry([{ [entry_id]: results.updatedId || results.insertId }, true], (err, results) => {
    if (err) logAndSendError(err, response);
    else response.json(results);
  });
};

const logAndSendError = (err, res) => {
  console.error(err);
  res.status(err.status).send(err.msg);
};

module.exports = routes;
