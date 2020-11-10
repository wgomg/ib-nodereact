'use strict';

const models = require('../models');

function BaseController() {
  this.model = new models[this.constructor.name]();
}

///////////////////////////////////////////////////////////////////////////////

BaseController.prototype.routeFunction = function ({ http, auth = {} }, func) {
  const { required = true, access = 'none' } = auth;

  if (!http) throw new Error('An http method must be provided');

  if (!['POST', 'PUT', 'GET', 'DELETE'].includes(http))
    throw new Error(`HTTP Method "${http}" is invalid`);

  if (!(auth instanceof Object))
    throw new Error(`Variable "auth" is required to be an object`);
  else {
    if (typeof required !== 'boolean')
      throw new Error(
        `Variable "required" is required to be a boolean, ${typeof required} given`
      );

    if (access.length > 0 && !['none', 'staff', 'admin'].includes(access))
      throw new Error(`Access value "${access}" is invalid`);
  }

  if (typeof func !== 'function')
    throw new Error(
      `Second argument is required to be a function, ${typeof func} given`
    );

  auth = { required };
  if (required) auth = { ...auth, access };

  func.routeParams = {
    http,
    auth,
  };

  return func;
};

BaseController.prototype.replaceHashIdFieldsWithDbId = function ({
  field,
  value,
}) {
  if (field.includes('_id')) {
    const model =
      field.slice(0, 1).toUpperCase() + field.slice(1, field.length - 3) + 's';
    const Model = new models[model]();

    value = parseInt(Model.getEntryId(value));
  }

  return { field, value };
};

//////////////////////////////////////////////////////////////////////////////////

// POST
BaseController.prototype.save = BaseController.prototype.routeFunction(
  { http: 'POST' },
  async function (body) {
    Object.entries(body).forEach(([field, value]) => {
      ({ field, value } = BaseController.prototype.replaceHashIdFieldsWithDbId({
        field,
        value,
      }));

      body[field] = value;
    });

    const Model = this.model;

    const validationErrors = Model.validate(body);
    if (validationErrors) return { data: validationErrors };

    const data = await Model.save(body);

    return { data: data ? data[0] : null };
  }
);

// PUT
BaseController.prototype.update = BaseController.prototype.routeFunction(
  { http: 'PUT' },
  async function (body) {
    const Model = this.model;

    const oldEntry = (
      await Model.get([{ field: this.idField, value: body[this.idField] }])
    )[0];

    Object.entries(body).forEach(([field, value]) => {
      ({ field, value } = BaseController.prototype.replaceHashIdFieldsWithDbId({
        field,
        value,
      }));
      body[field] = value;
    });

    delete body[Model.idField];

    delete oldEntry[Model.idField];
    delete oldEntry.created_on;

    Object.entries(oldEntry).forEach(([field, value]) => {
      if (
        (typeof value === 'string' &&
          body[field].toLowerCase() === value.toLowerCase()) ||
        (typeof value !== 'string' && body[field] === value)
      ) {
        Model.schema[field].required = false;
        delete body[field];
      }
    });

    const errors = Model.validate(body);
    if (errors) return [{ errors }];

    const data = await Model.update(body);

    return { data: data ? data[0] : null };
  }
);

// GET
BaseController.prototype.get = async function (filters = [], fields) {
  filters = filters.map((filter) => {
    if (filter.value)
      filter = BaseController.prototype.replaceHashIdFieldsWithDbId(filter);

    return filter;
  });

  const Model = this.model;
  const data = await Model.get(filters, fields);

  return { data };
};

// DELETE
BaseController.prototype.delete = BaseController.prototype.routeFunction(
  { http: 'DELETE' },
  async function (id) {
    const Model = this.model;

    const data = await Model.delete(id);

    return { data: data.deleteId ? { [Model.idField]: data.deleteId } : null };
  }
);

///////////////////////////////////////////////////////////////////////////////

BaseController.prototype.getRoutes = function () {
  const FUNC_ARGS = /([^\s,]+)/g;

  const childPrototype = Object.getPrototypeOf(this);
  const baseControllerPrototype = Object.getPrototypeOf(childPrototype);

  const routes = Object.entries({
    ...baseControllerPrototype,
    ...childPrototype,
  })
    .filter(
      ([propName, propVal]) =>
        typeof propVal === 'function' && propVal.routeParams
    )
    .map(([funcName, func]) => {
      const funcDef = func.toString();

      let funcArgs = funcDef
        .slice(funcDef.indexOf('(') + 1, funcDef.indexOf(')'))
        .match(FUNC_ARGS);

      if (funcArgs)
        funcArgs = funcArgs.map((arg) =>
          arg === 'id' ? this.model.idField : arg
        );

      const funcNameArray = funcName
        .split(/(?=[A-Z])/)
        .filter((s) => s !== 'All');

      const subRoutes =
        funcNameArray.length > 1
          ? funcNameArray.map((s) => s.toLocaleLowerCase()).slice(1)
          : null;

      const routeParams = funcArgs
        ? funcArgs.filter((arg) => arg.includes('id'))
        : null;

      const routeNouns = [
        this.constructor.name.toLowerCase(),
        ...(subRoutes ? subRoutes : []),
      ];

      const route =
        '/' +
        routeNouns
          .map((noun) => {
            if (
              routeParams &&
              routeParams.includes(noun.slice(0, noun.length - 1) + '_id')
            ) {
              const index = routeParams.indexOf(
                noun.slice(0, noun.length - 1) + '_id'
              );

              return noun + '/:' + routeParams[index];
            } else return noun;
          })
          .join('/');

      return {
        ...func.routeParams,
        func: funcName,
        reqProps: funcArgs,
        route,
      };
    });

  return routes;
};

module.exports = BaseController;
