import {cleanup, render, screen} from '@testing-library/react'
import {useEffect, useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import {Cart, cartItem} from '../Cart'

let preRerenderSetter: jest.Mock
let finalMapState : Map<string,cartItem>| null

const SetNewMap = function(props:{someMap : Map<string,cartItem> | null}){
        let [propMap, setPropMap] = useState<Map<string,cartItem>| null>(props.someMap)
        let testSetter:jest.Mock = jest.fn(setPropMap)
        
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
                    <Route path="/" element={<Cart itemsMap={propMap} itemsSetter={testSetter}/>}/> 
                </Routes>         
            </BrowserRouter>
            
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
        const target = screen.getByTestId('emptyCart')
        expect(target).toBeInTheDocument()
        cleanup()
    })

    it('Cart renders first item from Map',() => {
        const firstItemMap = new Map()
        firstItemMap.set('default',someItem('first item'))
        render(<SetNewMap someMap={firstItemMap} />)
        const target = screen.getByText('first item')
        expect(target).toBeInTheDocument()
        expect(screen.queryByTestId('emptyCart')).not.toBeInTheDocument()
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

    it('On mount, card checks if there are any items with 0 as their item value and removes them accordingly', ()=>{
        
        const itemsWith0Map = new Map()
        itemsWith0Map.set('default',Object.assign({},someItem('past'),{itemAmount: 0}))
        itemsWith0Map.set('present',someItem('present'))

        render(<SetNewMap someMap={itemsWith0Map} />)

        expect(screen.queryByText('past')).not.toBeInTheDocument()
        expect(screen.getByText('present')).toBeInTheDocument()

        expect(itemsWith0Map?.get('default')).toEqual(Object.assign({},someItem('past'),{itemAmount: 0}))
        expect(itemsWith0Map?.get('present')).toEqual(someItem('present'))

        expect(finalMapState?.get('default')).toBeUndefined()
        expect(finalMapState?.get('present')).toEqual(someItem('present'))
        
        cleanup()
    })

  
})


describe('Cart increments and decrements itemsAmount and adjusts price accordingly',() => {
    it('Item amount goes up when pressing the increment button',() => {
        let incrementedMap = new Map()
        incrementedMap.set('default',someItem('incremented text'))
        render(<SetNewMap someMap={incrementedMap}/>)
        expect(screen.getByTestId('amount.default').textContent).toBe('1')

        let target = screen.getByRole('button',{name: /increment.default/i})
        userEvent.click(target)
    
        expect(finalMapState?.get('default')?.itemAmount).toBe(2)
        expect(screen.getByTestId('amount.default').textContent).toBe('2')

        cleanup()
        

    })
    it('Item price is added to current total when pressing the increment button',()=> {
        let incrementedPrice = new Map()
        incrementedPrice.set('more',someItem('more'))
        
        render(<SetNewMap someMap={incrementedPrice}/>)
        
        expect(screen.getByTestId('totalPrice').textContent).toBe("$10.00")

        const incrementor = () => screen.getByRole('button',{name: /increment.more/i})
        
        userEvent.click(incrementor())
        expect(screen.getByTestId('totalPrice').textContent).toBe("$20.00")

        userEvent.click(incrementor())
        userEvent.click(incrementor())
        expect(screen.getByTestId('totalPrice').textContent).toBe("$40.00")

        cleanup()


    })
    it('Item amount goes down when pressing the decrement button',() => {
        let decrementedMap = new Map()
        decrementedMap.set('default',someItem('decremented text'))
        decrementedMap.set('another',someItem('another'))

        render(<SetNewMap someMap={decrementedMap}/>)
        expect(screen.getByTestId('amount.default').textContent).toBe('1')
        
        let target = screen.getByRole('button',{name: /decrement.default/i})
        userEvent.click(target)
        
        expect(finalMapState?.get('default')?.itemAmount).toBe(0)
        expect(screen.getByTestId('amount.default').textContent).toBe('0')

        expect(finalMapState?.get('another')?.itemAmount).toBe(1)
        expect(screen.getByTestId('amount.another').textContent).toBe('1')


        cleanup()

    })
    it('Item price is subtracted from current total when pressing the decrement button',()=> {
        let decrementedPrice = new Map()
        decrementedPrice.set('less',someItem('less'))
        decrementedPrice.set('default',someItem('default'))
        
        render(<SetNewMap someMap={decrementedPrice}/>)
        
        expect(screen.getByTestId('totalPrice').textContent).toBe("$20.00")

        const decrementor = screen.getByRole('button',{name: /decrement.less/i})
        
        userEvent.click(decrementor)
        expect(screen.getByTestId('totalPrice').textContent).toBe("$10.00")
        
        cleanup()

    })
    it('Item amount cannot be decremented beyond 0',() => {
        const another0Map = new Map()
        another0Map.set('default',someItem('default'))
        another0Map.set('buffer', someItem('buffer'))

        render(<SetNewMap someMap={another0Map} />)
        expect(screen.getByTestId('amount.default').textContent).toBe('1')

        let target = () => screen.getByRole('button',{name: /decrement.default/i})

        userEvent.click(target())
        expect(screen.getByTestId('amount.default').textContent).toBe('0')

        userEvent.click(target())
        expect(screen.getByTestId('amount.default').textContent).toBe('0')

        cleanup()
        
    })
    it('Values are changed through itemsSetter', () => {
        let incrementedMap2 = new Map()
        incrementedMap2.set('default',someItem('more incremented text'))

        render(<SetNewMap someMap={incrementedMap2}/>)
        let target =screen.getByRole('button',{name: /increment.default/i})

        userEvent.click(target)
        expect(preRerenderSetter).toHaveBeenCalled()
        cleanup()

        let decrementedMap2 = new Map()
        decrementedMap2.set('default',someItem('more decremented text'))

        render(<SetNewMap someMap={decrementedMap2}/>)
        let secondtarget = screen.getByRole('button',{name: /decrement.default/i})
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

        const target = screen.getByRole('button',{name: /remove.default/i})
        userEvent.click(target)
        expect(screen.queryByText('not in view')).not.toBeInTheDocument()
        expect(preRerenderSetter).toHaveBeenCalled()

        cleanup()

    })
    it('Default "empty cart" items are rendered when all items are removed',() =>{
        let secondToBeRemoved = new Map()
        secondToBeRemoved.set('removal',someItem('removal'))

        render(<SetNewMap someMap={secondToBeRemoved}/>)

        const target = screen.getByRole('button',{name : /remove.removal/i})
        userEvent.click(target)
        expect(screen.getByTestId('emptyCart')).toBeInTheDocument()
        
        cleanup()

    })
    it('Item price (corresponding to amounts) deducted from total when item is removed',() => {
        let thirdToBeRemoved = new Map()
        thirdToBeRemoved.set('deduct',someItem('deduct'))
        thirdToBeRemoved.set('static',someItem('static'))

        render(<SetNewMap someMap={thirdToBeRemoved}/>)
        
        expect(screen.getByTestId('totalPrice').textContent).toBe("$20.00")

        const incrementor = screen.getByRole('button',{name: /increment.deduct/i})
        userEvent.click(incrementor)
        expect(screen.getByTestId('totalPrice').textContent).toBe("$30.00")

        const decrementor = screen.getByRole('button',{name: /decrement.deduct/i})
        userEvent.click(decrementor)   
        expect(screen.getByTestId('totalPrice').textContent).toBe("$20.00")

        const remover = screen.getByRole('button',{name : /remove.deduct/i})
        userEvent.click(remover)
        expect(screen.getByTestId('totalPrice').textContent).toBe("$10.00")

        cleanup()

    })
    
    
})


