declare const _default: (() => {
    type: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    synchronize: boolean;
    logging: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    type: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    synchronize: boolean;
    logging: boolean;
}>;
export default _default;
