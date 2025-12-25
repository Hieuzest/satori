#!/usr/bin/env node

// src/bin.ts
import { createRequire } from "node:module";
import scaffold from "create-cordis";
var require2 = createRequire(import.meta.url);
var { version } = require2("../package.json");
scaffold({
  name: "satori",
  version,
  template: "@satorijs/boilerplate"
});
