'use strict';

const authentication = require('../middlware/auth');

const controllers = require('../controllers');
const Staffs = require('../models/Staffs');

const baseRoute = '/_back/api';

const routes = (app) => {
  for (let Controller of controllers) {
    const controllerRoutes = Controller.getRoutes();

    controllerRoutes.forEach((r) => {
      const { http, route, func, reqProps, auth } = r;

      console.log(http + ': :' + route + ': :' + func);

      let appRouteArgs = [baseRoute + route];

      if (auth.required) appRouteArgs.push(authentication(auth.access, Staffs));

      app[http.toLowerCase()](...appRouteArgs, async (req, res) => {
        let controllerFuncArgs = [];

        if (reqProps)
          reqProps.forEach((p) => {
            if (p.toLowerCase().includes('body'))
              controllerFuncArgs.push(req.body);
            else if (p === 'staff') controllerFuncArgs.push(req.staff_id);
            else controllerFuncArgs.push(req.params[p]);
          });

        try {
          const result = await Controller[func](...controllerFuncArgs);

          if (result.errors) res.status(401).json(result.errors);
          else res.json(result);
        } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
        }
      });
    });
  }
};

module.exports = routes;
