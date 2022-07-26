import {render, screen} from '@testing-library/react'
import {useState } from 'react'
import userEvent from '@testing-library/user-event'
import {Cart, cartItem} from '../Cart'


 
describe('Cart renders props, including itemsMap, correctly', () => { 
    const SetNewMap = function(props:{someMap : Map<string,cartItem> | null}){
        let [propMap, setPropMap] = useState<Map<string,cartItem>| null>(props.someMap)
        return (
            <Cart itemsMap={propMap} itemsSetter={setPropMap}/>
        )
       
    }
    
    const someItem = (text:string) =>{
        return(
            {
                item : <div>{text}</div>,
                itemAmount : 1,
                itemPrice : 10
            }
            
        )
    }

    it('Cart renders default empty message if null passed in as prop',() => {
        render(<SetNewMap someMap={null} />)
        const target = screen.getByText('Your cart is empty')
        expect(target).toBeInTheDocument()

    })
    it('Cart renders first item from Map',() => {
        const firstItemMap = new Map()
        firstItemMap.set('default',someItem('first item'))
        render(<SetNewMap someMap={firstItemMap} />)
        const target = screen.getByText('first item')
        expect(target).toBeInTheDocument()
        expect(screen.queryByText('Your cart is empty')).not.toBeInTheDocument()

    })

    it('Cart renders multiple items from Map',() => {
        const severalItemsMap = new Map()
        severalItemsMap.set('default',someItem('another first item'))
        severalItemsMap.set('a',someItem('second'))
        severalItemsMap.set('b',someItem('third'))
        
        render(<SetNewMap someMap={severalItemsMap}/>)
        
        const target = screen.getByText('another first item')
        const second = screen.getByText('second')
        const third = screen.getByText('third')

        expect(target).toBeInTheDocument()
        expect(second).toBeInTheDocument()
        expect(third).toBeInTheDocument()
    })

    it('On unmount, card checks if there are any items with 0 as their item value and removes them accordingly', ()=>{
        const itemsWith0Map = new Map()
        itemsWith0Map.set('default',Object.assign({},someItem('past'),{itemAmount: 0}))
        itemsWith0Map.set('present',someItem('present'))

        let {container,unmount} = render(<SetNewMap someMap={itemsWith0Map} />)
        expect(screen.getByText('past')).toBeInTheDocument()
        expect(screen.getByText('present')).toBeInTheDocument()
        unmount()
        expect(itemsWith0Map.get('default')).toBeUndefined()
        expect(itemsWith0Map.get('present')).toBeTruthy()
        render(<SetNewMap someMap={itemsWith0Map} />)
        expect(screen.queryByText('past')).not.toBeInTheDocument()
        expect(screen.getByText('present')).toBeInTheDocument()
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


