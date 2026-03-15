#!/usr/bin/env python3
"""
Espada Proxy - STL Generator
Genera archivos STL para impresión 3D de la Espada Proxy
"""

import numpy as np
import trimesh
from scipy.spatial import ConvexHull
import json
import os

class EspadaProxyGenerator:
    def __init__(self):
        self.output_dir = "stl_output"
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Dimensiones base (mm)
        self.blade_length = 730
        self.blade_width = 30
        self.blade_thickness = 5
        self.handle_length = 280
        self.guard_radius = 50
        
    def generate_blade(self):
        """Genera la hoja principal"""
        # Crear forma de hoja katana
        points = []
        
        # Perfil principal de la hoja
        for i in range(50):
            t = i / 49
            y = -self.blade_length/2 + t * self.blade_length
            
            # Ancho variable (más ancho en base, más delgado en punta)
            width = self.blade_width * (1 - t * 0.7)
            
            # Agregar puntos para el perfil
            points.append([-width/2, y, 0])
            points.append([width/2, y, 0])
            
        # Crear malla 3D con espesor
        vertices = []
        faces = []
        
        for i, (x, y, z) in enumerate(points):
            # Cara frontal
            vertices.append([x, y, z])
            # Cara trasera
            vertices.append([x, y, z + self.blade_thickness])
            
        # Generar caras
        for i in range(len(points) - 1):
            v1 = i * 2
            v2 = v1 + 1
            v3 = (i + 1) * 2
            v4 = v3 + 1
            
            # Cara lateral 1
            faces.append([v1, v2, v3])
            faces.append([v2, v4, v3])
            
        # Crear malla
        mesh = trimesh.Trimesh(vertices=vertices, faces=faces)
        
        # Agregar detalles de circuitos
        self.add_circuit_details(mesh)
        
        return mesh
    
    def add_circuit_details(self, mesh):
        """Agrega detalles de circuitos energéticos"""
        # Crear pequeñas esferas a lo largo de la hoja
        circuits = []
        
        for i in range(8):
            y = -self.blade_length/2 + (i + 1) * self.blade_length / 9
            x = np.sin(i * np.pi / 4) * self.blade_width / 4
            z = np.cos(i * np.pi / 4) * self.blade_width / 4
            
            circuit = trimesh.creation.icosphere(radius=2)
            circuit.apply_translation([x, y, z])
            circuits.append(circuit)
            
        # Unir circuitos a la hoja
        for circuit in circuits:
            mesh = mesh.union(circuit)
            
        return mesh
    
    def generate_handle(self):
        """Genera el mango tradicional con display"""
        # Cilindro principal del mango
        handle = trimesh.creation.cylinder(
            radius=8,
            height=self.handle_length
        )
        
        # Display OLED
        display = trimesh.creation.box(
            extents=[15, 8, 2]
        )
        display.apply_translation([10, self.handle_length/2 - 20, 0])
        
        # Envoltura tradicional (tsuka)
        wrap_segments = []
        for i in range(20):
            angle = i * 2 * np.pi / 20
            wrap = trimesh.creation.box(
                extents=[self.handle_length + 4, 2, 2]
            )
            wrap.apply_translation([
                np.sin(angle) * 8.5,
                0,
                np.cos(angle) * 8.5
            ])
            wrap_segments.append(wrap)
            
        handle = handle.union(display)
        for wrap in wrap_segments:
            handle = handle.union(wrap)
            
        return handle
    
    def generate_guard(self):
        """Genera la guardia holográfica"""
        # Guardia circular principal (tsuba)
        outer_ring = trimesh.creation.cylinder(
            radius=self.guard_radius,
            height=3
        )
        
        inner_ring = trimesh.creation.cylinder(
            radius=8,
            height=3
        )
        
        guard = outer_ring.difference(inner_ring)
        
        # Agregar patrones de circuitos
        for i in range(6):
            angle = i * np.pi / 3
            circuit = trimesh.creation.box(
                extents=[10, 2, 1]
            )
            circuit.apply_translation([
                np.sin(angle) * 30,
                0,
                np.cos(angle) * 30
            ])
            guard = guard.union(circuit)
            
        return guard
    
    def generate_pommel(self):
        """Genera el pomo de energía"""
        # Esfera principal
        pommel = trimesh.creation.icosphere(radius=12)
        
        # Base cilíndrica
        base = trimesh.creation.cylinder(
            radius=10,
            height=8
        )
        base.apply_translation([0, -4, 0])
        
        pommel = pommel.union(base)
        
        return pommel
    
    def generate_saya(self):
        """Genera la vaina con LEDs"""
        # Cuerpo principal de la vaina
        saya_length = self.blade_length + 50
        saya_radius = 20
        
        # Cilindro hueco
        outer = trimesh.creation.cylinder(
            radius=saya_radius,
            height=saya_length
        )
        
        inner = trimesh.creation.cylinder(
            radius=saya_radius - 2,
            height=saya_length + 10
        )
        
        saya = outer.difference(inner)
        
        # Ranuras para LEDs
        for i in range(4):
            angle = i * np.pi / 2
            led_slot = trimesh.creation.box(
                extents=[saya_length, 3, 2]
            )
            led_slot.apply_translation([
                np.sin(angle) * (saya_radius - 1),
                0,
                np.cos(angle) * (saya_radius - 1)
            ])
            saya = saya.difference(led_slot)
            
        return saya
    
    def save_stl(self, mesh, filename):
        """Guarda malla como archivo STL"""
        filepath = os.path.join(self.output_dir, filename)
        mesh.export(filepath)
        print(f"✅ Guardado: {filepath}")
        
    def generate_all_components(self):
        """Genera todos los componentes de la espada"""
        print("🗡️ Generando Espada Proxy...")
        
        # Generar componentes
        print("⚙️ Generando hoja...")
        blade = self.generate_blade()
        self.save_stl(blade, "blade_main.stl")
        
        print("🔧 Generando mango...")
        handle = self.generate_handle()
        self.save_stl(handle, "handle_main.stl")
        
        print("🛡️ Generando guardia...")
        guard = self.generate_guard()
        self.save_stl(guard, "guard_main.stl")
        
        print("⚡ Generando pomo...")
        pommel = self.generate_pommel()
        self.save_stl(pommel, "pommel_main.stl")
        
        print("📦 Generando vaina...")
        saya = self.generate_saya()
        self.save_stl(saya, "saya_main.stl")
        
        # Generar configuración de impresión
        self.generate_print_config()
        
        print("✨ Espada Proxy completa!")
        
    def generate_print_config(self):
        """Genera archivo de configuración de impresión"""
        config = {
            "components": {
                "blade": {
                    "material": "PLA Translucent",
                    "nozzle": 0.4,
                    "layer_height": 0.12,
                    "infill": 100,
                    "supports": True,
                    "print_speed": 40,
                    "temperature": 210,
                    "bed_temp": 60,
                    "estimated_time": "18 hours"
                },
                "handle": {
                    "material": "PETG Carbon Fiber",
                    "layer_height": 0.16,
                    "infill": 80,
                    "supports": False,
                    "print_speed": 50,
                    "temperature": 240,
                    "bed_temp": 80,
                    "estimated_time": "8 hours"
                },
                "guard": {
                    "material": "Resin UV",
                    "layer_height": 0.05,
                    "exposure": 8,
                    "bottom_layers": 8,
                    "estimated_time": "4 hours"
                }
            },
            "assembly": {
                "total_components": 5,
                "required_electronics": [
                    "Arduino Nano",
                    "LEDs WS2812B",
                    "Battery 18650",
                    "Capacitive Sensor TTP223",
                    "Bluetooth Module HC-05"
                ],
                "tools_required": [
                    "Screwdriver set",
                    "Soldering iron",
                    "3D Printer",
                    "Calipers"
                ]
            }
        }
        
        config_path = os.path.join(self.output_dir, "print_config.json")
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
            
        print(f"📋 Configuración guardada: {config_path}")

# Ejecutar generador
if __name__ == "__main__":
    generator = EspadaProxyGenerator()
    generator.generate_all_components()
    
    print("\n🚀 Archivos STL generados!")
    print("📁 Ubicación: ./stl_output/")
    print("🔧 Lista de componentes:")
    print("  - blade_main.stl (Hoja principal)")
    print("  - handle_main.stl (Mango con display)")
    print("  - guard_main.stl (Guardia holográfica)")
    print("  - pommel_main.stl (Pomo de energía)")
    print("  - saya_main.stl (Vaina con LEDs)")
    print("  - print_config.json (Configuración de impresión)")
