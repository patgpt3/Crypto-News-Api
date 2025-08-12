"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createPresignedPost: () => createPresignedPost
});
module.exports = __toCommonJS(index_exports);

// src/createPresignedPost.ts
var import_client_s3 = require("@aws-sdk/client-s3");
var import_util_format_url = require("@aws-sdk/util-format-url");
var import_middleware_endpoint = require("@smithy/middleware-endpoint");
var import_signature_v4 = require("@smithy/signature-v4");
var import_util_hex_encoding = require("@smithy/util-hex-encoding");
var import_util_utf8 = require("@smithy/util-utf8");

// src/constants.ts
var ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
var CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
var AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
var TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
var SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
var ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";

// src/createPresignedPost.ts
var createPresignedPost = /* @__PURE__ */ __name(async (client, { Bucket, Key, Conditions = [], Fields = {}, Expires = 3600 }) => {
  const { systemClockOffset, base64Encoder, utf8Decoder, sha256 } = client.config;
  const now = new Date(Date.now() + systemClockOffset);
  const signingDate = iso8601(now).replace(/[\-:]/g, "");
  const shortDate = signingDate.slice(0, 8);
  const clientRegion = await client.config.region();
  const credentialScope = (0, import_signature_v4.createScope)(shortDate, clientRegion, "s3");
  const clientCredentials = await client.config.credentials();
  const credential = `${clientCredentials.accessKeyId}/${credentialScope}`;
  const fields = {
    ...Fields,
    bucket: Bucket,
    [ALGORITHM_QUERY_PARAM]: ALGORITHM_IDENTIFIER,
    [CREDENTIAL_QUERY_PARAM]: credential,
    [AMZ_DATE_QUERY_PARAM]: signingDate,
    ...clientCredentials.sessionToken ? { [TOKEN_QUERY_PARAM]: clientCredentials.sessionToken } : {}
  };
  const expiration = new Date(now.valueOf() + Expires * 1e3);
  const conditionsSet = /* @__PURE__ */ new Set();
  for (const condition of Conditions) {
    const stringifiedCondition = JSON.stringify(condition);
    conditionsSet.add(stringifiedCondition);
  }
  for (const [k, v] of Object.entries(fields)) {
    conditionsSet.add(JSON.stringify({ [k]: v }));
  }
  if (Key.endsWith("${filename}")) {
    conditionsSet.add(JSON.stringify(["starts-with", "$key", Key.substring(0, Key.lastIndexOf("${filename}"))]));
  } else {
    conditionsSet.add(JSON.stringify({ key: Key }));
  }
  const conditions = Array.from(conditionsSet).map((item) => JSON.parse(item));
  const encodedPolicy = base64Encoder(
    utf8Decoder(
      JSON.stringify({
        expiration: iso8601(expiration),
        conditions
      })
    )
  );
  const signingKey = await (0, import_signature_v4.getSigningKey)(sha256, clientCredentials, shortDate, clientRegion, "s3");
  const signature = await hmac(sha256, signingKey, encodedPolicy);
  const endpoint = (0, import_middleware_endpoint.toEndpointV1)(
    await (0, import_middleware_endpoint.getEndpointFromInstructions)(
      { Bucket, Key },
      import_client_s3.PutObjectCommand,
      {
        ...client.config
      },
      {
        logger: client.config.logger
      }
    )
  );
  return {
    url: (0, import_util_format_url.formatUrl)(endpoint),
    fields: {
      ...fields,
      key: Key,
      Policy: encodedPolicy,
      [SIGNATURE_QUERY_PARAM]: (0, import_util_hex_encoding.toHex)(signature)
    }
  };
}, "createPresignedPost");
var iso8601 = /* @__PURE__ */ __name((date) => date.toISOString().replace(/\.\d{3}Z$/, "Z"), "iso8601");
var hmac = /* @__PURE__ */ __name((ctor, secret, data) => {
  const hash = new ctor(secret);
  hash.update((0, import_util_utf8.toUint8Array)(data));
  return hash.digest();
}, "hmac");
// Annotate the CommonJS export names for ESM import in node:

0 && (module.exports = {
  createPresignedPost
});

