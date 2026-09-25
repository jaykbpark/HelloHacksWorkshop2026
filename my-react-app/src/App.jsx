import { useState } from 'react'

const types = [
  { name: 'Fire', color: 'bg-red-500', selected: 'border-red-200 bg-red-50 text-red-800' },
  { name: 'Water', color: 'bg-blue-500', selected: 'border-blue-200 bg-blue-50 text-blue-800' },
  { name: 'Grass', color: 'bg-green-500', selected: 'border-green-200 bg-green-50 text-green-800' },
  { name: 'Ground', color: 'bg-amber-500', selected: 'border-amber-200 bg-amber-50 text-amber-800' },
]
// [val1, val2, val3, val4]

function App() {
  const [selectedType, setSelectedType] = useState('')
  const [result, setResult] = useState('')

  async function getMatchup(type) {
    try {
      const response = await fetch(`http://localhost:5001/api/type/${type.toLowerCase()}`)
      if (!response.ok) throw new Error('Request failed')
      return await response.json()
    } catch {
      return { error: 'Could not load the matchup.' }
    }
  }

  async function handleTypeClick(type) {
    setSelectedType(type)
    setResult('Loading...')
    const response = await getMatchup(type)
    if (response.error) {
      setResult(response.error)
      return
    }

    const attackTypes = response.double_damage_from.join(', ')
    const defenseTypes = response.half_damage_to.join(', ')
    const attackAdvice = attackTypes
      ? `Use ${attackTypes} moves to deal double damage.`
      : `No move types deal double damage to ${type}.`
    const defenseAdvice = defenseTypes
      ? `Choose ${defenseTypes} Pokémon to take half damage from ${type}-type moves.`
      : `No Pokémon types take half damage from ${type}-type moves.`

    setResult(`For single-type matchups:\n\n${attackAdvice}\n\n${defenseAdvice}`)
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 p-5 text-stone-900">
      <section className="w-full max-w-md rounded-2xl border border-amber-100 bg-white p-6 shadow-sm sm:p-8">
        <header className="mb-8 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="relative size-9 shrink-0 overflow-hidden rounded-full border-2 border-stone-900 bg-white before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-red-500 after:absolute after:inset-x-0 after:top-1/2 after:h-0.5 after:bg-stone-900"
          >
            <span className="absolute left-1/2 top-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-stone-900 bg-white" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-600">Pokémon!!</p>
            <h1 className="text-lg font-bold tracking-tight">Battle Assistant</h1>
          </div>
        </header>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pick a type</h2>
          <p className="mt-2 text-sm text-stone-600">What type is the Pokémon you’re fighting?</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {types.map(({ name, color, selected }) => {
            const isSelected = selectedType === name

            return (
              <button
                key={name}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleTypeClick(name)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${
                  isSelected
                    ? selected
                    : 'border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <span aria-hidden="true" className={`size-2.5 rounded-full ${color}`} />
                {name}
              </button>
            )
          })}
        </div>

        <p aria-live="polite" className="mt-5 min-h-5 text-sm text-stone-500">
          {selectedType || 'Choose a type to get started.'}
        </p>
        {result && (
          <p aria-live="polite" className="mt-3 whitespace-pre-line text-sm leading-relaxed text-stone-700">
            {result}
          </p>
        )}
      </section>
    </main>
  )
}

export default App
