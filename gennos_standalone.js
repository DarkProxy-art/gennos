import * as THREE from 'three'
const { STLExporter } = require('three/examples/jsm/exporters/STLExporter')
import fs from 'fs'
import path from 'path'

function seededRandom(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  }
  return () => {
    h ^= h << 13; h ^= h >> 17; h ^= h << 5
    return ((h >>> 0) / 0xFFFFFFFF)
  }
}

function generateCrystal(rand) {
  const geo = new THREE.IcosahedronGeometry(1, Math.floor(rand() * 3) + 1)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const noise = 1 + (rand() - 0.5) * 0.4
    pos.setXYZ(i, pos.getX(i) * noise, pos.getY(i) * noise, pos.getZ(i) * noise)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

function generateOrganic(rand) {
  const geo = new THREE.SphereGeometry(1, 32, 32)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const freq = 2 + rand() * 4
    const amp = 0.1 + rand() * 0.3
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    const noise = Math.sin(x * freq) * Math.cos(y * freq) * Math.sin(z * freq) * amp
    pos.setXYZ(i, x * (1 + noise), y * (1 + noise), z * (1 + noise))
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

function generateTwist(rand) {
  const geo = new THREE.CylinderGeometry(0.5, 1, 3, 32, 32)
  const pos = geo.attributes.position
  const twistAmount = (rand() - 0.5) * Math.PI * 4
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    const angle = (y / 3) * twistAmount
    const x = pos.getX(i), z = pos.getZ(i)
    pos.setXYZ(i,
      x * Math.cos(angle) - z * Math.sin(angle),
      y,
      x * Math.sin(angle) + z * Math.cos(angle)
    )
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

function generateLorenz(rand) {
  const points = []
  let x = rand() * 2 - 1
  let y = rand() * 2 - 1
  let z = rand() * 2 - 1
  const sigma = 8 + rand() * 4
  const rho = 24 + rand() * 6
  const beta = 2 + rand() * 1
  const dt = 0.005
  for (let i = 0; i < 3000; i++) {
    const dx = sigma * (y - x) * dt
    const dy = (x * (rho - z) - y) * dt
    const dz = (x * y - beta * z) * dt
    x += dx; y += dy; z += dz
    if (i > 200) points.push(new THREE.Vector3(x * 0.05, y * 0.05, z * 0.05 - 1.4))
  }
  return new THREE.BufferGeometry().setFromPoints(points)
}

function generatePiece(seed, algorithm) {
  const rand = seededRandom(seed)
  const params = {
    complexity: rand(),
    scale: 0.8 + rand() * 0.4,
    detail: rand()
  }

  let geometry

  switch (algorithm) {
    case 'crystal': geometry = generateCrystal(rand); break
    case 'organic': geometry = generateOrganic(rand); break
    case 'twist': geometry = generateTwist(rand); break
    case 'lorenz': geometry = generateLorenz(rand); break
    default: geometry = generateCrystal(rand)
  }

  const scene = new THREE.Scene()
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial())
  scene.add(mesh)

  const exporter = new STLExporter()
  const stlString = exporter.parse(mesh)
  const stlBuffer = Buffer.from(stlString)

  const dna = { seed, algorithm, params, timestamp: Date.now() }
  const id = `${algorithm}-${seed}-${dna.timestamp}`

  // Crear directorios
  const dir = path.join(process.cwd(), 'memory', 'logs')
  const stlDir = path.join(process.cwd(), 'memory', 'stl')

  fs.mkdirSync(dir, { recursive: true })
  fs.mkdirSync(stlDir, { recursive: true })

  const stlPath = path.join(stlDir, `${id}.stl`)
  fs.writeFileSync(stlPath, stlBuffer)

  const entry = {
    id,
    dna,
    stlPath,
    createdAt: new Date().toISOString()
  }

  fs.writeFileSync(
    path.join(dir, `${id}.json`),
    JSON.stringify(entry, null, 2)
  )

  console.log(`\n[GENNOS] Pieza generada: ${id}`)
  console.log(`[GENNOS] STL guardado en: ${stlPath}`)
  console.log(`[GENNOS] DNA: ${JSON.stringify(dna, null, 2)}`)

  return entry
}

const ALGORITHMS = ['crystal', 'organic', 'twist', 'lorenz']

function parseSeed(idea) {
  return idea.toLowerCase().trim().replace(/\s+/g, '-') + '-' + Date.now()
}

function pickAlgorithm(idea) {
  const idea_lower = idea.toLowerCase()
  if (idea_lower.includes('cristal') || idea_lower.includes('crystal') || idea_lower.includes('angular')) return 'crystal'
  if (idea_lower.includes('organico') || idea_lower.includes('orgánico') || idea_lower.includes('blob')) return 'organic'
  if (idea_lower.includes('twist') || idea_lower.includes('espiral') || idea_lower.includes('torsion')) return 'twist'
  if (idea_lower.includes('caos') || idea_lower.includes('flujo') || idea_lower.includes('lorenz')) return 'lorenz'
  return ALGORITHMS[Math.floor(Math.random() * ALGORITHMS.length)]
}

// Función principal para Windsurf
function processIdea(idea) {
  console.log(`\n[GENNOS] Procesando: "${idea}"`)

  const seed = parseSeed(idea)
  const algorithm = pickAlgorithm(idea)

  console.log(`[GENNOS] Seed: ${seed}`)
  console.log(`[GENNOS] Algoritmo: ${algorithm}`)

  const piece = generatePiece(seed, algorithm)
  
  return piece
}

// Exportar
module.exports = { processIdea }
