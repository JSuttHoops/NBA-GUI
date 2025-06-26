#!/usr/bin/env python3
"""Simple command line launcher for the NBA web app."""
import argparse
import webbrowser
from backend.app import app


def main():
    parser = argparse.ArgumentParser(prog='nba_gui')
    sub = parser.add_subparsers(dest='cmd')
    run_p = sub.add_parser('run', help='start the local web server')
    run_p.add_argument('--port', type=int, default=5005)
    args = parser.parse_args()

    if args.cmd == 'run':
        url = f'http://localhost:{args.port}/'
        print(f'Serving on {url}')
        webbrowser.open(url)
        app.run(host='127.0.0.1', port=args.port)
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
