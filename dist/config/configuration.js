"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        uri: process.env.MONGOURI,
    },
    privy: {
        apiKey: process.env.PRIVY_API_KEY,
        appId: process.env.PRIVY_APP_ID || 'cm4g4hzw102g3hlf5jgx0rxf9',
    },
});
//# sourceMappingURL=configuration.js.map