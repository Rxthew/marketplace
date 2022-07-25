import {render, screen} from '@testing-library/react'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'
import {Cart, cartItem} from '../Cart'


 
describe('Cart renders props, including itemsMap, correctly', () => { 
    const setNewMap = jest.fn(()=> {
        let [propMap, setPropMap] = useState<Map<string,cartItem>| null>(new Map().set('default',{item: <div></div>, itemAmount: 1, itemPrice: 4}))
        return {
            mapCheck:propMap,
            mapSet: setPropMap
        }
    })
    
    const someItem = jest.fn((text:string) =>{
        return(
            {
                item : <div>{text}</div>,
                itemAmount : 1,
                itemPrice : 10
            }
            
        )
    })

    it('Cart renders default empty message if null passed in as prop',() => {
        const setMap = setNewMap().mapSet
        render(<Cart itemsMap={null} itemsSetter={setMap}/>)
        const target = screen.getByText('Your cart is empty')
        expect(target).toBeInTheDocument()

    })
    it('Cart renders first item from Map',() => {
        const firstItemMap = setNewMap()
        if(!firstItemMap.mapCheck){return}
        firstItemMap.mapCheck.set('default', someItem('first item')) 
        render(<Cart itemsMap={firstItemMap.mapCheck} itemsSetter={firstItemMap.mapSet} />)
        const target = screen.getByText('first item')
        expect(target).toBeInTheDocument()
        const emptyCart = screen.getByText('Your cart is empty')
        expect(emptyCart).toBeNull()

    })

    it('Cart renders multiple items from Map',() => {
        const severalItemsMap = setNewMap()
        if(!severalItemsMap.mapCheck){return}
        severalItemsMap.mapCheck.set('default',someItem('another first item'))
        severalItemsMap.mapCheck.set('a',someItem('second'))
        severalItemsMap.mapCheck.set('b',someItem('third'))
        render(<Cart itemsMap={severalItemsMap.mapCheck} itemsSetter={severalItemsMap.mapSet}/>)
        
        const target = screen.getByText('another first item')
        const second = screen.getByText('second')
        const third = screen.getByText('third')

        expect(target).toBeInTheDocument()
        expect(second).toBeInTheDocument()
        expect(third).toBeInTheDocument()
    })

    it('On unmount, card checks if there are any items with 0 as their item value and removes them accordingly', ()=>{
        const itemsWith0Map = setNewMap()
        if(!itemsWith0Map.mapCheck){return}
        itemsWith0Map.mapCheck.set('default',Object.assign({},itemsWith0Map.mapCheck.get('default'),{itemAmount: 0}))
        itemsWith0Map.mapCheck.set('present',someItem('present'))

        const {container,unmount} = render(<Cart itemsMap={itemsWith0Map.mapCheck} itemsSetter={itemsWith0Map.mapSet} />)
        unmount()
        expect(itemsWith0Map.mapCheck.get('default')).toBeUndefined()
        expect(itemsWith0Map.mapSet).toBeCalled()
        expect(container.textContent).toContain('present')
    })
    
    
})

describe('Cart increments and decrements itemsAmount and adjusts price accordingly',() => {
    it('Item amount goes up when pressing the increment button',() => {

    })
    it('Item price is added to current total when pressing the increment button',()=> {

    })
    it('Item amount goes down when pressing the decrement button',() => {

    })
    it('Item price is subtracted from current total when pressing the decrement button',()=> {

    })
    it('Item amount cannot be decremented beyond 0',() => {
        
    })
    it('Values are changed through itemsSetter', () => {

    })


})

describe('Cart removes item from itemsMap if user clicks corresponding button',() => {
    it('Items are removed from itemsMap with itemsSetter if remove button is invoked by user', () => {

    })

    
})


