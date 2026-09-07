#!/usr/bin/env python3
"""Build a standalone Roblox XML place using only the Python standard library."""
import argparse
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent

def build(output):
    doc = ET.Element('roblox', {'version': '4'})
    ET.SubElement(doc, 'External').text = 'null'
    ET.SubElement(doc, 'External').text = 'nil'
    ET.SubElement(doc, 'Meta', {'name': 'ExplicitAutoJoints'}).text = 'true'
    counter = 0
    def item(parent, cls, name):
        nonlocal counter
        counter += 1
        node = ET.SubElement(parent, 'Item', {'class': cls, 'referent': f'RBX{counter:08d}'})
        props = ET.SubElement(node, 'Properties')
        ET.SubElement(props, 'string', {'name': 'Name'}).text = name
        return node, props
    def prop(parent, kind, name, value):
        node = ET.SubElement(parent, kind, {'name': name})
        node.text = str(value)
        return node
    workspace, wp = item(doc, 'Workspace', 'Workspace')
    prop(wp, 'float', 'Gravity', 196.2)
    spawn, sp = item(workspace, 'SpawnLocation', 'InvisibleSafetySpawn')
    for name in ['Anchored', 'CanCollide', 'Enabled', 'Neutral']:
        prop(sp, 'bool', name, 'true')
    prop(sp, 'float', 'Transparency', 1)
    prop(sp, 'int', 'Duration', 0)
    cf = ET.SubElement(sp, 'CoordinateFrame', {'name': 'CFrame'})
    for name, value in dict(X=0, Y=-1, Z=0, R00=1, R01=0, R02=0, R10=0, R11=1, R12=0, R20=0, R21=0, R22=1).items():
        ET.SubElement(cf, name).text = str(value)
    size = ET.SubElement(sp, 'Vector3', {'name': 'size'})
    for name, value in dict(X=128, Y=2, Z=128).items():
        ET.SubElement(size, name).text = str(value)
    lighting, lp = item(doc, 'Lighting', 'Lighting')
    prop(lp, 'float', 'Brightness', 1)
    prop(lp, 'float', 'ClockTime', 12)
    for name in ['ReplicatedStorage', 'ServerScriptService', 'SoundService']:
        item(doc, name, name)
    starter, _ = item(doc, 'StarterPlayer', 'StarterPlayer')
    item(starter, 'StarterPlayerScripts', 'StarterPlayerScripts')
    item(starter, 'StarterCharacterScripts', 'StarterCharacterScripts')
    starter_gui, props = item(doc, 'StarterGui', 'StarterGui')
    prop(props, 'bool', 'ResetPlayerGuiOnSpawn', 'false')
    screen, props = item(starter_gui, 'ScreenGui', 'ZeroRiot')
    for name, value in [('Enabled', 'true'), ('IgnoreGuiInset', 'true'), ('ResetOnSpawn', 'false')]:
        prop(props, 'bool', name, value)
    prop(props, 'int', 'DisplayOrder', 100)
    for cls, name, path in [('ModuleScript', 'Core', ROOT / 'Core.lua'), ('LocalScript', 'ZeroRiotClient', ROOT / 'ZeroRiot.client.lua')]:
        _, props = item(screen, cls, name)
        if cls == 'LocalScript':
            prop(props, 'bool', 'Disabled', 'false')
        prop(props, 'ProtectedString', 'Source', path.read_text())
    ET.indent(doc)
    output.parent.mkdir(parents=True, exist_ok=True)
    ET.ElementTree(doc).write(output, encoding='utf-8', xml_declaration=True)
    # Validate structure and exact script round-trip; this is not a Studio playtest.
    parsed = ET.parse(output)
    for cls, filename in [('ModuleScript', 'Core.lua'), ('LocalScript', 'ZeroRiot.client.lua')]:
        source = parsed.find(f".//Item[@class='{cls}']/Properties/ProtectedString[@name='Source']")
        assert source.text == (ROOT / filename).read_text()
    print(f'Built {output} ({output.stat().st_size:,} bytes)')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=ROOT / 'Zero_Riot_Roblox_V1.rbxlx')
    build(parser.parse_args().output.resolve())
