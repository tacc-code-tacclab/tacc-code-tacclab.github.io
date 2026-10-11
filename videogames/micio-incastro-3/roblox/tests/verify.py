"""Compile plain Lua/Luau-compatible sources and execute the rule and GUI smoke tests.
Uses the installed Lua 5.4 runtime; does not pretend to be Roblox Studio.
"""
import ctypes
import ctypes.util
import os
import subprocess
import tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
os.chdir(ROOT)
lib=ctypes.CDLL(ctypes.util.find_library('lua5.4'))
lib.luaL_newstate.restype=ctypes.c_void_p
lib.luaL_openlibs.argtypes=[ctypes.c_void_p]
lib.luaL_loadfilex.argtypes=[ctypes.c_void_p,ctypes.c_char_p,ctypes.c_char_p]
lib.lua_pcallk.argtypes=[ctypes.c_void_p,ctypes.c_int,ctypes.c_int,ctypes.c_int,ctypes.c_longlong,ctypes.c_void_p]
lib.lua_tolstring.argtypes=[ctypes.c_void_p,ctypes.c_int,ctypes.POINTER(ctypes.c_size_t)]
lib.lua_tolstring.restype=ctypes.c_char_p
lib.lua_close.argtypes=[ctypes.c_void_p]

def run(path,execute=False):
    state=lib.luaL_newstate();lib.luaL_openlibs(state)
    try:
        status=lib.luaL_loadfilex(state,str(path).encode(),None)
        if not status and execute: status=lib.lua_pcallk(state,0,0,0,0,None)
        if status: raise RuntimeError(lib.lua_tolstring(state,-1,None).decode())
        print(('Executed: ' if execute else 'Syntax OK: ')+str(path),flush=True)
    finally: lib.lua_close(state)

if __name__=='__main__':
    for path in sorted(ROOT.glob('*.lua')): run(path)
    run('tests/core_test.lua',True)
    with tempfile.NamedTemporaryFile(suffix='.lua',mode='w') as f:
        f.write(subprocess.check_output(['node','tests/parity.cjs'],text=True));f.flush();run(f.name,True)
    run('tests/client_smoke.lua',True)
