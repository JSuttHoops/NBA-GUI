import os
import logging
import time
import uuid
from functools import lru_cache
from importlib import import_module
from pathlib import Path

import pandas as pd
from flask import Flask, request, jsonify, send_file, abort
from flask_cors import CORS

LOG_DIR = Path.home() / '.nba_desktop_app' / 'logs'
LOG_DIR.mkdir(parents=True, exist_ok=True)
logging.basicConfig(
    filename=LOG_DIR / 'backend.log',
    level=logging.INFO,
    format='%(levelname)s %(asctime)s %(message)s'
)

app = Flask(__name__)
CORS(app, origins="http://localhost:*")

ENDPOINTS = []
ENDPOINT_FILE = Path(__file__).with_name('endpoints.yaml')
if ENDPOINT_FILE.exists():
    with open(ENDPOINT_FILE) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                ENDPOINTS.append(line)

CACHE = {}

@lru_cache(maxsize=1)
def endpoints_module():
    return import_module('nba_api.stats.endpoints')


def call_endpoint(name, params):
    if name not in ENDPOINTS:
        abort(400, description='Unknown endpoint')
    mod = endpoints_module()
    endpoint_cls = getattr(mod, name)
    time.sleep(0.6)
    try:
        resp = endpoint_cls(**params)
        df = resp.get_data_frames()[0]
    except Exception as exc:
        logging.error("%s failed: %s", name, exc)
        abort(502, description='NBA site is busy—let\'s wait a minute')
    logging.info("%s rows=%s", name, len(df))
    return df


@app.post('/run')
def run():
    data = request.get_json(force=True)
    endpoint = data.get('endpoint')
    params = data.get('params', {})
    df = call_endpoint(endpoint, params)
    token = str(uuid.uuid4())
    CACHE[token] = df
    return jsonify({
        'token': token,
        'meta': {'rows': len(df), 'endpoint': endpoint},
        'data': df.to_dict(orient='records')
    })


@app.post('/visualize')
def visualize():
    data = request.get_json(force=True)
    chart = data.get('chart', 'line')
    df = pd.DataFrame(data.get('data', []))
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    plt.figure()
    if chart == 'scatter':
        df.plot.scatter(x=df.columns[0], y=df.columns[1])
    else:
        df.plot()
    tmp_path = Path('/tmp') / f"{uuid.uuid4()}.png"
    plt.savefig(tmp_path)
    with open(tmp_path, 'rb') as f:
        encoded = f.read()
    tmp_path.unlink(missing_ok=True)
    return jsonify({'image': encoded.decode('latin1')})


@app.get('/download/<token>')
def download(token):
    fmt = request.args.get('fmt', 'csv')
    df = CACHE.get(token)
    if df is None:
        abort(404)
    tmp_path = Path('/tmp') / f"{token}.{fmt}"
    if fmt == 'csv':
        df.to_csv(tmp_path, index=False)
    elif fmt == 'json':
        df.to_json(tmp_path, orient='records')
    elif fmt == 'xlsx':
        df.to_excel(tmp_path, index=False)
    elif fmt == 'parquet':
        df.to_parquet(tmp_path, index=False)
    else:
        abort(400, description='Unknown format')
    return send_file(tmp_path, as_attachment=True)


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=5005)
    args = parser.parse_args()
    app.run(host='127.0.0.1', port=args.port)


if __name__ == '__main__':
    main()
