const cors = require('cors')
const express = require('express')

const app = express()
const PORT = 5001

app.use(cors())

// Example: http://localhost:5001/api/type/steel
app.get('/api/type/:name', async (req, res) => {
  const type = encodeURIComponent(req.params.name.toLowerCase())
  const response = await fetch(`https://pokeapi.co/api/v2/type/${type}/`)
  const data = await response.json()
  const { half_damage_to, double_damage_from } = data.damage_relations

  res.json({
    half_damage_to: half_damage_to.map((type) => type.name),
    double_damage_from: double_damage_from.map((type) => type.name),
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
