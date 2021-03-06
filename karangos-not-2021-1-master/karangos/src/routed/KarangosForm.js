import { useState } from 'react'
import axios from 'axios'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import { Checkbox } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputMask from 'react-input-mask'
import InputAdornment from '@material-ui/core/InputAdornment'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'


const useStyles = makeStyles(() => ({
    form: {
        maxWidth: '80%',
        margin: '0 auto',
        display: "flex",
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        '& .MuiFormControl-root': {
            minWidth: '200px',
            maxWidth: '500px',
            marginBottom: '24px',            
        },
        '& button': {
            height: '50px',
            alignContent: 'flex-end'
        }
    },
    toolbar: {
        marginTop:'36px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
    },
    checkbox: {
        alignItems: 'center'
    }
}))

// Classes de entrada para a máscara do campo placa
const formatChars = {
    'A': '[A-Za-z]',
    '0': '[0-9]',
    '#': '[0-9A-Ja-j]'
}

const placaMask = 'AAA-0#00'

export default function KarangosForm() {

    const classes = useStyles()

    const [karango, setKarango] = useState({
        id: null,
        marca: '',
        modelo: '',
        cor: '',
        ano_fabricacao: (new Date()).getFullYear(),
        importado: '0',
        placa: '',
        preco: 0
    })

    // const [currentId, setCurentId] = useState()
    const [importadoChecked, setImportadoChecked] = useState()

    function handleInputChange(event, property) {
    
        // Se houver id no event.target, ele será o nome da propriedade
        // senão, usaremos o valor do segundo parâmetro
        if(event.target.id) property = event.target.id
    
        if(property === 'importado') {
          const newState = ! importadoChecked
          setKarango({...karango, importado: (newState ? '1': '0')})
          setImportadoChecked(newState)
        }
        else if(property === 'placa') {
          setKarango({...karango, [property]: event.target.value.toUpperCase()}) 
        }
        else {
          // Quando o nome de uma propriedade de um objeto aparece entre [],
          // isso se chama "propriedade calculada". O nome da propriedade vai
          // corresponder à avaliação da expressão entre os colchetes
        //   setCurrentId(event.target.id)
          setKarango({...karango, [property]: event.target.value})
        }
    }

    // function handleCorChange(event) {
    //     setKarango({...karango, cor:event.target.value})
    // }

    // function handleAnoChange(event) {
    //     setKarango({...karango, ano_fabricacao:event.target.value})
    // }

    function years() {
        let result = []
        for(let i = (new Date()).getFullYear(); i>= 1900; i--) {
            result.push(i)
        }
        return result
    }

    async function saveData() {
        try {
            await axios.post('https://api.faustocintra.com.br/karangos', karango)
            alert('Dados salvos com sucesso!')
        }
        catch(error) {
            alert('ERRO: ' + error.message)
        }
    }

    function handleSubmit(event) {
        event.preventDefault()
        saveData()
    }



    return (
        <>
            <h1>Cadastrar novo karango</h1>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField id="marca" label="Marca" 
                variant="filled" value={karango.marca} onChange={handleInputChange} fullWidth />
                <TextField id="modelo" label="Modelo" 
                variant="filled" value={karango.modelo} onChange={handleInputChange} fullWidth />
                <TextField id="cor" label="Cor" 
                variant="filled" value={karango.cor} onChange={event => handleInputChange(event, 'cor')} select fullWidth >
                    <MenuItem value='Amarelo'>Amarelo</MenuItem>
                    <MenuItem value='Azul'>Azul</MenuItem>
                    <MenuItem value='Branco'>Branco</MenuItem>
                    <MenuItem value='Cinza'>Cinza</MenuItem>
                    <MenuItem value='Dourado'>Dourado</MenuItem>
                    <MenuItem value='Laranja'>Laranja</MenuItem>
                    <MenuItem value='Prata'>Prata</MenuItem>
                    <MenuItem value='Preto'>Preto</MenuItem>
                    <MenuItem value='Roxo'>Roxo</MenuItem>
                    <MenuItem value='Verde'>Verde</MenuItem>
                    <MenuItem value='Vermelho'>Vermelho</MenuItem>
                </TextField>
                   

                <TextField 
                    id="ano_fabricacao" 
                    label="Ano" 
                    variant="filled" 
                    value={karango.ano_fabricacao} 
                    onChange={event => handleInputChange(event, 'ano_fabricacao')} 
                    select
                    fullWidth 
                >
                    {
                        years().map(year => <MenuItem value={year}>{year}</MenuItem>)
                    }
                </TextField>


                

                <InputMask formatChars={formatChars} mask={placaMask} id="placa" onChange={event => handleInputChange(event, 'placa')} value={karango.placa}>
                   {() => <TextField label="Placa" variant="filled" fullWidth />}
                </InputMask>

                <TextField 
                    id="preco" 
                    label="Preco" 
                    variant="filled" 
                    value={karango.preco}
                    onFocus={event => event.target.select()}
                    onChange={handleInputChange} 
                    fullWidth 
                    InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
                    type="number"/
                >

                <FormControl className={classes.checkbox}>
                    <FormControlLabel 
                        control={<Checkbox checked={importadoChecked} onChange={handleInputChange} id="importado" />}
                        label="Importado?" 
                    />
                </FormControl>

                <Toolbar className={classes.toolbar}>
                      <Button variant="contained" color="primary" type="submit">Enviar</Button>
                      <Button variant="outlined">Voltar</Button>                    
                </Toolbar>

            </form>
            {/* <div>{JSON.stringify(karango)}
                <br />
                currentId:{currentId}

            </div> */}
        </>
    )
}