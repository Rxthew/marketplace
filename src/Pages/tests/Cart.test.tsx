import {cleanup, render, screen} from '@testing-library/react'
import {useEffect, useState } from 'react'
import userEvent from '@testing-library/user-event'
import {Cart, cartItem} from '../Cart'


let preRerenderSetter: jest.Mock

const SetNewMap = function(props:{someMap : Map<string,cartItem> | null}){
        let [propMap, setPropMap] = useState<Map<string,cartItem>| null>(props.someMap)
        let testSetter:jest.Mock = jest.fn(setPropMap)
        
        useEffect(()=>{
            return () => {
                preRerenderSetter = testSetter
            }
        
        },[testSetter])
        return (
            <Cart itemsMap={propMap} itemsSetter={testSetter}/>
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
describe('Cart renders props, including itemsMap, correctly', () => { 
    it('Cart renders default empty message if null passed in as prop',() => {
        render(<SetNewMap someMap={null} />)
        const target = screen.getByText('Your cart is empty')
        expect(target).toBeInTheDocument()
        cleanup()
        

    })

    it('Cart renders first item from Map',() => {
        const firstItemMap = new Map()
        firstItemMap.set('default',someItem('first item'))
        render(<SetNewMap someMap={firstItemMap} />)
        const target = screen.getByText('first item')
        expect(target).toBeInTheDocument()
        expect(screen.queryByText('Your cart is empty')).not.toBeInTheDocument()
        cleanup()

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
        cleanup()
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
        cleanup()
    })

    
})

describe('Cart increments and decrements itemsAmount and adjusts price accordingly',() => {
    it('Item amount goes up when pressing the increment button',() => {
        let incrementedMap = new Map()
        incrementedMap.set('default',someItem('incremented text'))
        render(<SetNewMap someMap={incrementedMap}/>)
        expect(screen.getByTestId('amount').textContent).toBe('1')

        let target = screen.getByText('Increment')
        userEvent.click(target)
        expect(incrementedMap.get('default').itemAmount).toBe(2)
        expect(screen.getByTestId('amount').textContent).toBe('2')
        cleanup()
        

    })
    it('Item price is added to current total when pressing the increment button',()=> {

    })
    it('Item amount goes down when pressing the decrement button',() => {
        let decrementedMap = new Map()
        decrementedMap.set('default',someItem('decremented text'))
        render(<SetNewMap someMap={decrementedMap}/>)
        expect(screen.getByTestId('amount').textContent).toBe('1')
        
        let target = screen.getByText('Decrement')
        userEvent.click(target)
        
        expect(decrementedMap.get('default').itemAmount).toBe(0)
        expect(screen.getByTestId('amount').textContent).toBe('0')
        cleanup()

    })
    it('Item price is subtracted from current total when pressing the decrement button',()=> {

    })
    it('Item amount cannot be decremented beyond 0',() => {
        
    })
    it('Values are changed through itemsSetter', () => {
        let incrementedMap2 = new Map()
        incrementedMap2.set('default',someItem('more incremented text'))
        render(<SetNewMap someMap={incrementedMap2}/>)
        let target = screen.getByText('Increment')
        userEvent.click(target)
        expect(preRerenderSetter).toHaveBeenCalled()
        cleanup()

        let decrementedMap2 = new Map()
        decrementedMap2.set('default',someItem('more decremented text'))
        render(<SetNewMap someMap={decrementedMap2}/>)
        let secondtarget = screen.getByText('Decrement')
        userEvent.click(secondtarget)
        expect(preRerenderSetter).toHaveBeenCalled()
        cleanup()

    })


})

describe('Cart removes item from itemsMap if user clicks corresponding button',() => {
    it('Items are removed from itemsMap with itemsSetter if remove button is invoked by user', () => {
        let toBeRemoved = new Map()
        toBeRemoved.set('default', someItem('not in view'))
        render(<SetNewMap someMap={toBeRemoved}/>)
        expect(screen.getByText('not in view')).toBeInTheDocument()
        const target = screen.getByText('Remove')
        userEvent.click(target)
        expect(screen.queryByText('not in view')).not.toBeInTheDocument()
        expect(preRerenderSetter).toHaveBeenCalled()
        cleanup()

    })

    
})


