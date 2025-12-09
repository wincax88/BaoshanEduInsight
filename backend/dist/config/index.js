"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_config_1 = __importDefault(require("./database.config"));
const jwt_config_1 = __importDefault(require("./jwt.config"));
const minio_config_1 = __importDefault(require("./minio.config"));
exports.default = [database_config_1.default, jwt_config_1.default, minio_config_1.default];
//# sourceMappingURL=index.js.map