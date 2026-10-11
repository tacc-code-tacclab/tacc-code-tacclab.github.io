#!/usr/bin/env python3
"""Build a self-contained native Roblox place and a small source/guide package."""
from pathlib import Path
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parent
MODULES = ['Journey', 'Core', 'Layout', 'Scenery']
OUTPUT = ROOT / 'Micio_Incastro_3_Roblox.rbxlx'

def build():
    doc = ET.Element('roblox', {'version': '4'})
    ET.SubElement(doc, 'External').text = 'null'
    ET.SubElement(doc, 'External').text = 'nil'
    ET.SubElement(doc, 'Meta', {'name': 'ExplicitAutoJoints'}).text = 'true'
    count = 0
    def item(parent, cls, name):
        nonlocal count
        count += 1
        node = ET.SubElement(parent, 'Item', {'class': cls, 'referent': f'RBX{count:08d}'})
        props = ET.SubElement(node, 'Properties')
        prop(props, 'string', 'Name', name)
        return node, props
    def prop(parent, kind, name, value):
        node = ET.SubElement(parent, kind, {'name': name})
        node.text = str(value)
        return node
    workspace, wp = item(doc, 'Workspace', 'Workspace')
    prop(wp, 'float', 'Gravity', 0)
    _, lp = item(doc, 'Lighting', 'Lighting')
    prop(lp, 'float', 'Brightness', 0)
    item(doc, 'SoundService', 'SoundService')
    item(doc, 'ReplicatedStorage', 'ReplicatedStorage')
    server, _ = item(doc, 'ServerScriptService', 'ServerScriptService')
    _, sp = item(server, 'Script', 'GuiOnlyExperience')
    prop(sp, 'ProtectedString', 'Source', "-- Individual local puzzle. No avatar, movement controls or 3D gameplay.\ngame:GetService('Players').CharacterAutoLoads=false\n")
    starter, _ = item(doc, 'StarterPlayer', 'StarterPlayer')
    item(starter, 'StarterPlayerScripts', 'StarterPlayerScripts')
    item(starter, 'StarterCharacterScripts', 'StarterCharacterScripts')
    starter_gui, props = item(doc, 'StarterGui', 'StarterGui')
    prop(props, 'bool', 'ResetPlayerGuiOnSpawn', 'false')
    screen, props = item(starter_gui, 'ScreenGui', 'MicioIncastro3')
    prop(props, 'bool', 'Enabled', 'true')
    prop(props, 'bool', 'ResetOnSpawn', 'false')
    prop(props, 'int', 'DisplayOrder', 100)
    prop(props, 'token', 'ScreenInsets', 2)
    for module in MODULES:
        _, props = item(screen, 'ModuleScript', module)
        prop(props, 'ProtectedString', 'Source', (ROOT / f'{module}.lua').read_text())
    _, props = item(screen, 'LocalScript', 'Micio3Client')
    prop(props, 'bool', 'Disabled', 'false')
    prop(props, 'ProtectedString', 'Source', (ROOT / 'Micio3.client.lua').read_text())
    ET.indent(doc)
    ET.ElementTree(doc).write(OUTPUT, encoding='utf-8', xml_declaration=True)
    parsed = ET.parse(OUTPUT)
    sources = {}
    for node in parsed.findall('.//Item'):
        source = node.find('Properties/ProtectedString[@name="Source"]')
        if source is not None:
            sources[node.find('Properties/string[@name="Name"]').text] = source.text
    for name in MODULES:
        assert sources[name] == (ROOT / f'{name}.lua').read_text()
    assert sources['Micio3Client'] == (ROOT / 'Micio3.client.lua').read_text()
    package = ROOT / 'Micio_Incastro_3_Roblox_Package.zip'
    with zipfile.ZipFile(package, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for name in [OUTPUT.name, 'README.md', 'build_place.py', 'Micio3.client.lua', *[f'{n}.lua' for n in MODULES]]:
            z.write(ROOT / name, name)
    print(f'Built {OUTPUT.name}: {OUTPUT.stat().st_size:,} bytes; {package.name}: {package.stat().st_size:,} bytes')
    return OUTPUT

if __name__ == '__main__':
    build()
