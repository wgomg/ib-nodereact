'use strict';

const models = require('./models');

const auth = require('./middlware/auth');

const logger = require('./libraries/logger');

const httpMethods = { s: 'post', u: 'put', g: 'get', d: 'delete' };
const privateMethods = new Map([
  ['Ban', ['save']],
  ['Banner', ['save', 'delete']],
  ['Board', ['save', 'update', 'delete']],
  ['Post', ['update', 'delete']],
  ['Report', ['getAll', 'updateSolved']],
  ['Rule', ['save', 'update', 'delete']],
  ['Staff', ['save', 'get', 'getAuth', 'getAll', 'update', 'delete', 'updatePassword']],
  ['Tag', ['save', 'delete']],
  ['Theme', ['save', 'update', 'delete']],
  ['Thread', ['delete']],
]);

let privateRoutes = new Map([]);

/**
 * Ejemplo: 
Map(n) {
  'Board' => [
    { httpMethod: 'post', fn: 'save', route: '/boards', access: 'priv' },
    { httpMethod: 'get', fn: 'getByURI', route: '/boards/:uri', access: 'pub' },
    ...
  ],
  'n' => [{...}]
}
***/
const routesMap = new Map(
  Object.values(models).map((Model) => [
    Model.name,
    Model.getFunctions().map((fn) => {
      const fnName = fn.name;
      const fnArgs = fn.args;
      const fnHttpMethod = httpMethods[fnName.charAt(0)];

      let route = `/${Model.table.toLowerCase()}`;
      const fnNameArray = fnName
        .split(/(?=[A-Z])/)
        .slice(1)
        .filter((s) => s !== 'All');

      if (fnNameArray.length > 0) route += '/' + fnNameArray.map((p) => p.toLowerCase()).join('/');

      if (
        fnName !== 'getAuth' &&
        fnArgs !== null &&
        (fnHttpMethod === 'get' || fnHttpMethod === 'delete')
      )
        route += `/:${fnArgs[0]}`;

      let access = 'pub';
      if (privateMethods.get(Model.name).includes(fnName)) {
        access = 'priv';
        privateRoutes.set(fnHttpMethod.toUpperCase() + route, Model.name + '.' + fn.name);
      }

      return { httpMethod: fnHttpMethod, fn: fnName, fnArgs, route, access };
    }),
  ])
);

const routes = (app) => {
  for (let [modelName, endpoints] of routesMap)
    endpoints.forEach((ep) => app[ep.httpMethod](...appMethodArgs(modelName, ep)));

  app.all('*', (req, res) => {
    req.procId = genProcId();

    logger.info(`Request ${req.method} ${req.route.path}`, req.procId);
    res.status(404).send('Page Not Found');
  });
};

const appMethodArgs = (modelName, ep) => {
  let args = [ep.route];

  if (ep.access === 'priv') args.push(auth(privateRoutes));

  const appMethodCallback = async (req, res) => {
    if (!req.procId) req.procId = genProcId();

    const Model = models[modelName];
    Model.procId = req.procId;

    logger.info(`Request ${req.method} ${req.route.path}`, req.procId);

    try {
      let fnArgs = [];

      if (ep.fnArgs) {
        const arg = ep.fnArgs[0];

        if (arg === 'body' || arg === 'staff') {
          if (arg === 'body' && 'file_id' in Model.schema) req[arg].files = req.files || [];

          if ((modelName === 'Post' || modelName === 'Thread') && ep.httpMethod === 'post')
            req[arg].user = req.ip;

          fnArgs.push(req[arg]);
        } else fnArgs.push(req.params[arg]);
      }

      const result = await Model[ep.fn](...fnArgs);

      if (result.validationError) {
        logger.debug(
          `[${Model.procId}] Validaton error on ${modelName}.${ep.fn}(), data: ${JSON.stringify(
            result.validationError
          )}`
        );

        res.status(401).json(result);
      } else {
        logger.debug(`[${Model.procId}] DB: Entries returned ${result.length || result.affectedRows}`);
        res.json(result);
      }
    } catch (error) {
      logger.error(error);
      res.status(error.httpStatus || 500).send(error.message || error.sqlMessage || 'Server Error');
    }
  };

  args.push(appMethodCallback);

  return args;
};

const genProcId = () => Math.random().toString(20).substr(2, 6);
// Math.floor(Math.random() * 16777215).toString(16);

module.exports = routes;
