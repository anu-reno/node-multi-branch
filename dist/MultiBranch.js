"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var processes = require("child_process");
var _ = require("lodash");
var path = require("path");
var fs = require("fs-extra");
var UI_1 = require("./UI");
var redbird = require("redbird");
var MultiBranch = /** @class */ (function () {
    function MultiBranch(config) {
        this.config = config;
        this.setupProxy()
            .then(function () { })["catch"](function (e) {
            console.error("MultiBranch setupProxy failed !", e);
        });
        this.initRetry()
            .then(function () { })["catch"](function (e) {
            console.error("MultiBranch initRetry failed !", e);
        });
    }
    MultiBranch.bootstrap = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                config = __assign({
                    port: parseInt(process.env["PORT"]) || 3000,
                    repoDir: process.cwd(),
                    portENV: "PORT",
                    defaultBranch: "master",
                    instancesPortStart: 7000,
                    interfacePort: parseInt(process.env["MULTIBRANCH_UI_PORT"]) || 8000
                }, _.pickBy(config, function (value) {
                    return value;
                }));
                if (process.env["RUNNED_BY_MULTIBRANCH"]) {
                    console.info("Bootstrap canceled. started from MultiBranch");
                    return [2 /*return*/];
                }
                new MultiBranch(config);
                process.on("exit", function (code) {
                    console.warn("Process is exiting with code " + code + " ! closing processes ...");
                    Object.values(MultiBranch.instances).forEach(function (instance) {
                        console.warn("Closing instance: " + instance.branch);
                        instance.process.kill("SIGKILL");
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    MultiBranch.prototype.initRetry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.init()
                    .then(function () {
                    console.info("MultiBranch initialized !");
                })["catch"](function (e) {
                    console.error("MultiBranch initialization failed ! trying again in 5 seconds ...", e);
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        var e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this.initRetry()];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_1 = _a.sent();
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }, 5000);
                });
                return [2 /*return*/];
            });
        });
    };
    MultiBranch.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var branches, lastUsedPort, promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.info("MultiBranch initalizing config", this.config);
                        return [4 /*yield*/, UI_1.UI.bootstrap(this.config)];
                    case 1:
                        _a.sent();
                        this.package = fs.readJSONSync(path.join(this.config.repoDir, "package.json"));
                        branches = this.config.branches ||
                            processes
                                .execSync("git branch", {
                                cwd: this.config.repoDir,
                                stdio: "pipe"
                            })
                                .toString()
                                .split("\n")
                                .map(function (p) { return _.trim(p, "* "); })
                                .filter(function (p) { return p; });
                        lastUsedPort = this.config.instancesPortStart;
                        promises = branches.map(function (branch) { return function () { return __awaiter(_this, void 0, void 0, function () {
                            var branchDir, customPortEnvObj;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        branchDir = path.join(this.config.repoDir, "..", this.package.name.replace(/ /g, "_") + "-" + branch
                                            .replace(/\//g, "_")
                                            .replace(/ /g, "_"));
                                        return [4 /*yield*/, fs.ensureDir(branchDir)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, fs.emptyDir(branchDir)];
                                    case 2:
                                        _a.sent();
                                        console.info("Copying repository to create \"" + branch + "\" branch folder");
                                        return [4 /*yield*/, fs.copy(this.config.repoDir, branchDir)];
                                    case 3:
                                        _a.sent();
                                        processes.execSync("git reset HEAD --hard && git checkout " + branch, {
                                            cwd: branchDir,
                                            stdio: "ignore"
                                        });
                                        customPortEnvObj = {};
                                        customPortEnvObj[this.config.portENV] = lastUsedPort;
                                        MultiBranch.instances[branch] = {
                                            process: processes.exec("pwd && npm start", {
                                                cwd: branchDir,
                                                env: __assign(__assign(__assign({}, process.env), customPortEnvObj), {
                                                    RUNNED_BY_MULTIBRANCH: true,
                                                    BRANCH: branch
                                                })
                                            }),
                                            branch: branch,
                                            port: lastUsedPort
                                        };
                                        MultiBranch.instances[branch].process.stdout.on("data", function (chunk) {
                                            console.log("[" + branch + "]\n", (chunk || "").toString());
                                        });
                                        MultiBranch.instances[branch].process.stderr.on("data", function (chunk) {
                                            console.warn("[" + branch + "]\n", (chunk || "").toString());
                                        });
                                        lastUsedPort++;
                                        return [2 /*return*/];
                                }
                            });
                        }); }; });
                        return [4 /*yield*/, Promise.all(promises.map(function (p) { return p(); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MultiBranch.prototype.setupProxy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.info("MultiBranch PROXY is available at http://0.0.0.0:" + this.config.port + " ");
                MultiBranch.proxy = new redbird({
                    port: this.config.port,
                    resolvers: [
                        function (host, url, req) {
                            if (url.startsWith("/mb")) {
                                req.url = req.url.replace("/mb", "/");
                                return "http://localhost:" + _this.config.interfacePort;
                            }
                            var branch = req.headers.branch || _this.config.defaultBranch;
                            var instance = MultiBranch.instances[branch];
                            if (!instance)
                                return;
                            return "http://localhost:" + MultiBranch.instances[branch].port;
                        }
                    ]
                });
                return [2 /*return*/];
            });
        });
    };
    MultiBranch.instances = {};
    return MultiBranch;
}());
exports.MultiBranch = MultiBranch;
//# sourceMappingURL=MultiBranch.js.map