import React, { useState } from 'react'
import 'use-axios-api-call/dist/index.css'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import useApiClient from './useApiClient'
import useApiCall from 'use-axios-api-call'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

const App = () => {

  const apiClient = useApiClient()

  const [selectedPokemon, setSelectedPokemon] = useState(null)

  const { data: allPokemon, fetching: fetchingAllPokemon, fetched: fetchedAllPokemon } = useApiCall(() => apiClient.pokemon.getAll(), [])

  const handleShowPrev = () => {
    const index = selectedPokemon ? allPokemon.results.map(x => x.name).indexOf(selectedPokemon.name) : -1
    setSelectedPokemon(allPokemon.results[Math.max(index - 1, 0)])
  }

  const handleShowNext = () => {
    const index = selectedPokemon ? allPokemon.results.map(x => x.name).indexOf(selectedPokemon.name) : 1
    setSelectedPokemon(allPokemon.results[Math.min(index + 1, allPokemon.results.length - 1)])
  }

  return (
    <Container maxWidth={'md'}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant={'h3'}>Pokemon Example</Typography>
        </Grid>
        <Grid item xs={12}>
          {!fetchedAllPokemon || fetchingAllPokemon ? <CircularProgress/> : (
            <Autocomplete
              options={allPokemon.results}
              getOptionLabel={(option) => option.name}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Pokemon Search" variant="outlined"/>}
              value={selectedPokemon}
              onChange={(event, value) => setSelectedPokemon(value)}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Button onClick={handleShowPrev}>Prev</Button>
          <Button onClick={handleShowNext}>Next</Button>
        </Grid>
        <Grid item xs={12}>
          <PokemonCard pokemonName={selectedPokemon?.name}/>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App

function PokemonCard({ pokemonName }) {

  const apiClient = useApiClient()

  const { data: pokemon, fetching: fetchingPokemon, fetched: fetchedPokemon } = useApiCall(() =>
      pokemonName ? apiClient.pokemon.get({ name: pokemonName }) : null,
    [pokemonName]
  )

  return (

    <Card>
      <CardContent>
        {fetchingPokemon ? <CircularProgress/> :
          !pokemon ? 'No pokemon selected' : (
            <>
              <Typography>{pokemon.name}</Typography>
              <img src={pokemon.sprites.front_default}/>
              <Typography>Height: {pokemon.height}</Typography>
              <Typography>Weight: {pokemon.weight}</Typography>
            </>
          )}
      </CardContent>
    </Card>
  )
}
