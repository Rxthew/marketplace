import { cleanup, render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { cartItem } from '../Cart'
import { Item } from '../Item'
import { useEffect,useState } from 'react'
import 'intersection-observer'



type setMapType = Map<string,{name: string, description:string} | cartItem> | null

let preRerenderSetter: jest.Mock
let finalMapState: setMapType

const SetNewItemMap = function(props:{someMap : setMapType ,mapKey:string}){

    let [propMap, setPropMap] = useState<setMapType>(props.someMap)
    let testSetter:jest.Mock = jest.fn(setPropMap)
    const mapKey = props.mapKey
    const mapObject = propMap?.get(mapKey) as {name : string, description: string}
    let name = mapObject?.name
    let desc = mapObject?.description

    
    useEffect(()=>{
        return () => {
            preRerenderSetter = testSetter
        }
    
    },[testSetter])

    useEffect(()=>{
        finalMapState = propMap
    },[propMap])
    
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Item name={name ?? 'Product'} description={desc ?? 'Available'} itemsSetter={testSetter} mapKey={'testing'} imageSrc='#' price={12.12}/>}/>
            <Route path="/cart" element={<Item name={name ?? 'Product'} description={desc ?? 'Available'} itemsSetter={testSetter} mapKey={'testing'} imageSrc='#' price={12.12}/>}/> 
        </Routes>         
    </BrowserRouter>
        
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
    it('Item renders image through image source property (after page is finished lazy loading)',() =>{
        render(<SetNewItemMap someMap={firstMap} mapKey={'default'} />)
        setTimeout(()=>{
            expect(screen.getByRole('img').getAttribute('src')).toBe('#')
        },0)
       
        cleanup()

    })
    it('Item renders price property',()=>{
        render(<SetNewItemMap someMap={firstMap} mapKey={'default'} />)
        expect(screen.getByTestId('price').textContent).toBe("$12.12")
        cleanup()

    })
    

})

describe('Item updates itemsMap within state',() => {
    
    it('Item is added to cart through setter',()=>{
        const secondMap = new Map()
        secondMap.set('default',someItem('Cart','Add this to your cart.'))

        render(<SetNewItemMap someMap={secondMap} mapKey={'default'} />)
        const target = screen.getByRole('link',{name : 'Add to Cart'})

        expect(target).toBeInTheDocument()

        userEvent.click(target)

        expect(preRerenderSetter).toHaveBeenCalled()

        const final = finalMapState?.get('testing') as cartItem
        expect(final.item).toBeTruthy()
        expect(final.itemAmount).toBeTruthy()
        expect(final.itemPrice).toBeTruthy()

        cleanup()
    })
    it('If Item already in cart then adds to current amount through setter',()=>{
        const thirdMap = new Map()
        thirdMap.set('default',someItem('Cart','Item already here'))

        render(<SetNewItemMap someMap={thirdMap} mapKey={'default'} />)
        const target = screen.getByRole('link',{name : 'Add to Cart'})
        userEvent.click(target)
        userEvent.click(target)
        expect(preRerenderSetter).toHaveBeenCalled()

        const finalAmount = finalMapState?.get('testing') as cartItem
        expect(finalAmount.itemAmount).toBe(2)
        
        cleanup()
    })


})