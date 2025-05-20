# README.md

# Next.js ODPS Validator

This project provides a Next.js web application to validate YAML or JSON content against different versions of the ODPS (Open Data Product Schema) JSON Schema.

## Features

* Select ODPS schema version (v1.0, v2.0, v3.0)
* Paste YAML or JSON content to validate
* Displays validation errors or success messages
* Schemas are loaded locally for offline use

## Project Structure

```
nextjs-odps-validator/
├── public/
│   └── schemas/
│       ├── v1.0/odps.yaml       # ODPS v1.0 JSON Schema
│       ├── v2.0/odps.yaml       # ODPS v2.0 JSON Schema
│       └── v3.0/odps.yaml       # ODPS v3.0 JSON Schema
├── pages/
│   ├── _app.js                  # Bootstrap CSS import
│   └── index.js                 # App entry and validation logic
├── package.json
└── README.md
```

## Sample Schema Snippet (v1.0)

```yaml
$schema: "http://json-schema.org/draft-07/schema#"
title: "Open Data Product Schema v1.0"
type: object
properties:
  SLA:
    type: array
    items:
      type: object
      properties:
        dimension:
          type: string
        objective:
          type: number
        unit:
          type: string
      required: [dimension, objective, unit]
  dataAccess:
    type: object
    properties:
      format:
        type: string
      specification:
        type: string
    required: [format, specification]
required: [SLA, dataAccess]
```

*(Full schemas are located in **`public/schemas/{version}/odps.yaml`**.)*

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build & Run

```bash
npm run build
npm start
```

## How to Add New Schema Versions

1. Place the new `odps.yaml` under `public/schemas/{new-version}/`.
2. No code change required—folders are auto-discovered at build time.

## License

This project is licensed under the [MIT License](LICENSE).

© 2024 [Offline Agency](https://offlineagency.it). All rights reserved.

## Contributors

Built and maintained by [Offline Agency](https://offlineagency.it).

We welcome contributions! Please open a pull request or issue on [GitHub](https://github.com/yourusername/nextjs-odps-validator).

## Contact

📬 For support or questions:

* GitHub Issues: [odps-validator](https://github.com/offline-agency/odps-validator/issues)
* Website: [offlineagency.it](https://offlineagency.it)
