import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cart from '../Cart'

//These are proto-tests so far. Incorporate mocks of other components later on. 
describe('Cart renders props, including itemsArray, correctly', () => { 
    const someItem = function(text:string){
        return(
            {
                item : <div>{text}</div>,
                itemAmount : 1
            }
            
        )
    }

    it('Cart renders default empty message if empty Array passed in as prop',() => {
        render(<Cart itemsArray={[]}/>)

    })
    it('Cart renders first item from Array',() => {
        render(<Cart itemsArray={[someItem('first item')]}/>)

    })

    it('Cart renders multiple items from Array',() => {
        render(<Cart itemsArray={[someItem('another first item'), someItem('second'), someItem('third')]}/>)
    })
    it('On mount card checks if there are any items with 0 as their item value and removes them accordingly', ()=>{

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
    it('Values are changed through setArrayItems', () => {

    })


})

describe('Cart removes item from itemsArray if user clicks corresponding button',() => {
    it('Items are removed from itemsArray with setArrayItems if remove button is invoked by user', () => {

    })

    
})


