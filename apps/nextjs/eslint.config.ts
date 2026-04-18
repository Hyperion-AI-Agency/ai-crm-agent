import { defineConfig } from "eslint/config";
import baseConfig, { restrictEnvAccess } from "@tooling/eslint-config/base";
import nextjsConfig from "@tooling/eslint-config/next";
import reactConfig from "@tooling/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess
);
