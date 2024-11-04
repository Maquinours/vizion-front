import eslint from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import prettierConfig from "eslint-config-prettier";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import globals from "globals";
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginQuery.configs['flat/recommended'],
    prettierConfig,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    jsxA11Y.flatConfigs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            parser: tsParser,
        },

        settings: {
            react: {
                version: "detect",
            },
        },
        ignores: ["**/dist/", "**/node_modules/"],
        files: ["**/*.ts", "**/*.tsx"],
        rules: {
            "react/prop-types": "off"
        }
    }
)

// export default [
//     ...pluginQuery.configs['flat/recommended'],
//     {
//         ignores: ["**/dist", "**/node_modules"],
//     }, ...compat.extends(
//         "eslint:recommended",
//         "plugin:@typescript-eslint/recommended-type-checked",
//         "prettier",
//         "plugin:react/recommended",
//         "plugin:react/jsx-runtime",
//         "plugin:jsx-a11y/recommended",
//         "plugin:@typescript-eslint/stylistic-type-checked",
//     ), {
//         plugins: {
//             "@typescript-eslint": typescriptEslint,
//             react,
//             "jsx-a11y": jsxA11Y,
//         },

//         languageOptions: {
//             globals: {
//                 ...globals.browser,
//             },

//             parser: tsParser,
//         },

//         settings: {
//             react: {
//                 version: "detect",
//             },
//         },
//     }];