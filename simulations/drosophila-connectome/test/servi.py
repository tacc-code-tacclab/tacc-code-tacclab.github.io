"""Server statico locale che RISPETTA le richieste Range, come GitHub Pages.

`python -m http.server` le ignora e risponde sempre 200. Un `<video>` servito
cosi' riporta `seekable = [0, 0]` e non si puo' scorrere, mentre in produzione
funziona benissimo: un falso negativo che fa perdere tempo a cercare un difetto
nel file video, che era a posto.

    python servi.py [porta] [radice]
"""
from __future__ import annotations

import os
import re
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class ConRange(SimpleHTTPRequestHandler):
    def send_head(self):
        intervallo = self.headers.get("Range")
        if not intervallo:
            return super().send_head()
        m = re.fullmatch(r"bytes=(\d*)-(\d*)", intervallo.strip())
        if not m:
            return super().send_head()

        percorso = self.translate_path(self.path)
        if os.path.isdir(percorso):
            return super().send_head()
        try:
            f = open(percorso, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        dimensione = os.fstat(f.fileno()).st_size
        inizio, fine = m.group(1), m.group(2)
        if inizio == "":                      # suffisso: gli ultimi N byte
            lunghezza = min(int(fine or 0), dimensione)
            inizio = dimensione - lunghezza
            fine = dimensione - 1
        else:
            inizio = int(inizio)
            fine = int(fine) if fine else dimensione - 1
            fine = min(fine, dimensione - 1)
        if inizio > fine or inizio >= dimensione:
            f.close()
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{dimensione}")
            self.end_headers()
            return None

        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(percorso))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", f"bytes {inizio}-{fine}/{dimensione}")
        self.send_header("Content-Length", str(fine - inizio + 1))
        self.end_headers()
        f.seek(inizio)
        return _Parziale(f, fine - inizio + 1)

    def end_headers(self):
        # GitHub Pages annuncia sempre il supporto: senza, alcuni browser non
        # provano nemmeno a scorrere
        if not any(k.lower() == "accept-ranges" for k, _ in self._headers_buffer_pairs()):
            self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def _headers_buffer_pairs(self):
        for riga in getattr(self, "_headers_buffer", []) or []:
            try:
                testo = riga.decode("latin-1")
            except Exception:
                continue
            if ":" in testo:
                k, v = testo.split(":", 1)
                yield k.strip(), v.strip()

    def log_message(self, *a):       # silenzioso: il rumore nasconde i test
        pass


class _Parziale:
    """Un file che si ferma dopo `resto` byte, per `copyfile`."""

    def __init__(self, f, resto):
        self.f, self.resto = f, resto

    def read(self, n=-1):
        if self.resto <= 0:
            return b""
        if n < 0 or n > self.resto:
            n = self.resto
        d = self.f.read(n)
        self.resto -= len(d)
        return d

    def close(self):
        self.f.close()


if __name__ == "__main__":
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 8731
    radice = sys.argv[2] if len(sys.argv) > 2 else "."
    h = partial(ConRange, directory=radice)
    with ThreadingHTTPServer(("127.0.0.1", porta), h) as srv:
        print(f"servo {radice} su http://127.0.0.1:{porta} (con Range)", flush=True)
        srv.serve_forever()
