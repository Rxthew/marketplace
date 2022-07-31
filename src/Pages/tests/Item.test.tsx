import userEvent from '@testing-library/user-event'
import {cleanup, render, screen} from '@testing-library/react'
import {useState, useEffect} from 'react'
import {Item} from '../Item'

let preRerenderSetter: jest.Mock
const SetNewItemMap = function(props:{someMap : Map<string,{name: string, description:string}> | null,mapKey:string}){
    let [propMap, setPropMap] = useState<Map<string,{name: string, description:string}>| null>(props.someMap)
    let testSetter:jest.Mock = jest.fn(setPropMap)
    let mapKey = props.mapKey
    let name = propMap?.get(mapKey)?.name
    let desc = propMap?.get(mapKey)?.description
    
    useEffect(()=>{
        return () => {
            preRerenderSetter = testSetter
        }
    
    },[testSetter])
    
    return (
        <Item name={name ?? 'Product'} description={desc ?? 'Available'} itemsSetter={testSetter} mapKey={props.mapKey} imageSrc='#' price={12.12}/>
    )
   
}

const someItem = (name:string, description:string,) =>{
        return(
            {
                name,
                description
            }
            
        )
    }



describe('Item renders correctly with props included',() => {
    const firstMap = new Map()
    firstMap.set('default',someItem('Notepad','Read this notepad. Brand new'))
    

    it('Item renders name property',() =>{
        render(<SetNewItemMap someMap={firstMap} mapKey={'default'} />)
        expect(screen.getByRole('heading').textContent).toBe('Notepad')
        cleanup()

    })
    it('Item renders description property',()=>{
        render(<SetNewItemMap someMap={firstMap} mapKey={'default'} />)
        expect(screen.getByTestId('desc').textContent).toBe('Read this notepad. Brand new')
        cleanup()

    })
    it('Item renders image through image source property',() =>{
        render(<SetNewItemMap someMap={firstMap} mapKey={'default'} />)
        expect(screen.getByRole('img').getAttribute('src')).toBe('#')
        cleanup()

    })
    it('Item renders price property',()=>{
        render(<SetNewItemMap someMap={firstMap} mapKey={'default'} />)
        expect(screen.getByTestId('price').textContent).toBe("12.12")
        cleanup()

    })
    

})
describe('Item updates itemsMap within state',() => {

})