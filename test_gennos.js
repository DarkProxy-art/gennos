const { processIdea } = require('./kernel/gennos')

// Test del sistema Gennos
processIdea('espada cristal').then(entry => {
  console.log('\n✅ Gennos funciona!')
  console.log('📄 Pieza generada:', entry.id)
  console.log('🗺️ STL guardado en:', entry.stlPath)
  console.log('🧬 DNA:', JSON.stringify(entry.dna, null, 2))
}).catch(error => {
  console.error('❌ Error:', error)
})
