// pages/index.js
import { useState } from 'react';
import * as YAML from 'js-yaml';
import Ajv from 'ajv';

export default function Home({ versions }) {
  const [version, setVersion] = useState(versions[0]);
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Load schema from local public folder
      const schemaUrl = `/schemas/${version}/odps.yaml`;
      const res = await fetch(schemaUrl);
      if (!res.ok) throw new Error(`Failed to load local schema: ${res.statusText}`);
      const schemaText = await res.text();
      const schema = YAML.load(schemaText);

      // Parse user content: JSON or YAML
      let data;
      try {
        data = JSON.parse(content);
      } catch {
        data = YAML.load(content);
      }

      // Validate with Ajv
      const ajv = new Ajv({ allErrors: true, strict: false });
      const validate = ajv.compile(schema);
      const valid = validate(data);

      setResult({ valid, errors: validate.errors });
    } catch (err) {
      setResult({ error: err.message });
    }
  };

  return (
      <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="w-75">
            <h1 className="text-center mb-4">ODPS Validator</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="version" className="form-label">ODPS version</label>
              <select
                  id="version"
                  className="form-select"
                  value={version}
                  onChange={e => setVersion(e.target.value)}
              >
                {versions.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="content" className="form-label">Content to be validated</label>
              <textarea
                  id="content"
                  className="form-control"
                  rows={10}
                  placeholder="Paste valid YAML or JSON here"
                  value={content}
                  onChange={e => setContent(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">Validate</button>
          </form>

          {result && (
              <div className="mt-4">
                {result.error && <div className="alert alert-danger">Error: {result.error}</div>}
                {result.valid && <div className="alert alert-success">✔️ Content is valid for {version}</div>}
                {!result.valid && result.errors && (
                    <div className="alert alert-danger">
                      <h5>Validation errors:</h5>
                      <ul>
                        {result.errors.map((err, i) => (
                            <li key={i}><strong>{err.instancePath || '/'}:</strong> {err.message}</li>
                        ))}
                      </ul>
                    </div>
                )}
              </div>
          )}
        </div>

        <footer className="w-75 text-center mt-5">
          <hr />
          <p className="mb-1">
            © {new Date().getFullYear()}{' '}
            <a href="https://offlineagency.it" target="_blank" rel="noopener noreferrer">
              Offline Agency
            </a>
          </p>
          <p>
            <a
                href="https://github.com/offline-agency/odps-validator"
                target="_blank"
                rel="noopener noreferrer"
            >
              Help &amp; Contribute on GitHub
            </a>
          </p>
        </footer>
      </div>
  );
}

// At build time, read all subdirectories under public/schemas
import fs from 'fs';
import path from 'path';

export async function getStaticProps() {
  const schemasDir = path.join(process.cwd(), 'public', 'schemas');
  const versions = fs
      .readdirSync(schemasDir)
      .filter(name => fs.statSync(path.join(schemasDir, name)).isDirectory())
      .sort();
  return { props: { versions } };
}
