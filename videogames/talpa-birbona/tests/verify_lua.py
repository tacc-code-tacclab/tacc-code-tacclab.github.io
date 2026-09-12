"""Compile both scripts and run rules with system Lua 5.4; not a Roblox Studio test."""
import ctypes
import ctypes.util
import os
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
        code=lib.luaL_loadfilex(state,str(path).encode(),None)
        if not code and execute: code=lib.lua_pcallk(state,0,0,0,0,None)
        if code: raise RuntimeError(lib.lua_tolstring(state,-1,None).decode())
        print(('Executed ' if execute else 'Syntax OK: ')+str(path))
    finally: lib.lua_close(state)
run('roblox/Core.lua')
run('roblox/TalpaBirbona.client.lua')
run('tests/core_test.lua',True)
if Path('tests/client_smoke.lua').exists(): run('tests/client_smoke.lua',True)
