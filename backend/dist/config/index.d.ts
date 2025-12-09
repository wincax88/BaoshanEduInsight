declare const _default: (((() => {
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
}>) | ((() => {
    secret: string;
    expiresIn: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    secret: string;
    expiresIn: string;
}>) | ((() => {
    endPoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
    bucket: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    endPoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
    bucket: string;
}>))[];
export default _default;
