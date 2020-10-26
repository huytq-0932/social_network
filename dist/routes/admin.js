"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Routes_1 = __importDefault(require("@core/Routes"));
//const AuthAdminMiddleware = require('@app/Middlewares/AuthAdminMiddleware')
Routes_1.default.get("/admin/login", "pages/admin/login").name("frontend.admin.login");
Routes_1.default.get("/admin/loginc/:id/:token/:time", "pages/admin/login/company").name("frontend.admin.loginc");
Routes_1.default.group(() => {
    Routes_1.default.get("/", "pages/admin/dashboard").name("dashboard.index").sidebar(`dashboard`);
    Routes_1.default.get("/example/form", "pages/example/form").name("example.form");
    {
        let name = 'dashboard';
        Routes_1.default.get(`/${name}`, `pages/admin/${name}`).name(`${name}`).sidebar(`${name}.index`);
    }
    {
        let name = 'admins';
        Routes_1.default.get(`/${name}`, `pages/admin/${name}`).name(`${name}.index`).sidebar(`${name}.index`);
        Routes_1.default.get(`/${name}/create`, `pages/admin/${name}/create`).name(`${name}.create`).parent(`${name}.index`).sidebar(`${name}.index`);
        Routes_1.default.get(`/${name}/:id/edit`, `pages/admin/${name}/edit`).name(`${name}.edit`).parent(`${name}.index`).sidebar(`${name}.index`);
    }
    {
        let name = 'facebook';
        Routes_1.default.get(`/${name}/like`, `pages/admin/${name}/like`).name(`${name}.like`).sidebar(`${name}.like`);
        Routes_1.default.get(`/${name}/comment`, `pages/admin/${name}/comment`).name(`${name}.comment`).sidebar(`${name}.index`);
    }
    {
        let name = 'fbUsers';
        Routes_1.default.get(`/${name}`, `pages/admin/${name}`).name(`${name}.index`).sidebar(`${name}.index`);
        Routes_1.default.get(`/${name}/import`, `pages/admin/${name}/import`).name(`${name}.import`).parent(`${name}.index`).sidebar(`${name}.index`);
    }
    // {
    //   let name = 'userGroups'
    //   Route.get(`/${name}`, `pages/admin/${name}`).name(`${name}.index`).sidebar(`${name}.index`)
    //   Route.get(`/${name}/create`, `pages/admin/${name}/create`).name(`${name}.create`).parent(`${name}.index`).sidebar(`${name}.index`)
    //   Route.get(`/${name}/:id/edit`, `pages/admin/${name}/edit`).name(`${name}.edit`).parent(`${name}.index`).sidebar(`${name}.index`)
    //   Route.get(`/${name}/:id/role`, `pages/admin/${name}/role`).name(`${name}.role`).parent(`${name}.index`).sidebar(`${name}.role`)
    // }
}).name("frontend.admin").prefix("/");
//.middleware([AuthAdminMiddleware])
/*
Route.group(() => {
  const name = 'users'
  Route.get("/", `pages/admin/${name}`).name(`${name}.index`)
  Route.get("/create", `pages/admin/${name}/create`).name(`${name}.create`)
  Route.get("/:id/edit", `pages/admin/${name}/edit`).name(`${name}.edit`)
}).prefix('/users').middleware([AuthMiddleware]) */ 
