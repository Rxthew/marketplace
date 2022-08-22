import React, { SetStateAction, useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { v4 as genKey } from "uuid"
import { ReactComponent as Add } from "../Icons/add.svg"
import { ReactComponent as Remove } from "../Icons/remove.svg"
import { ReactComponent as Subtract } from "../Icons/subtract.svg"
import { ReactComponent as ToggleView } from "../Icons/ToggleView.svg"




export interface cartItem {
    readonly item : JSX.Element,
    itemAmount : number,
    readonly itemPrice : number
    
}

interface cartProps {
    itemsMap: Map<string,cartItem> | null
    readonly itemsSetter: React.Dispatch<SetStateAction<Map<string,cartItem> | null>>
    
}

interface singleItemProps {
    mapKey: string,
    itemObject : cartItem
    setter : React.Dispatch<SetStateAction<Map<string,cartItem> | null>>
    decrement(key:string) : void
    increment(key:string) : void
    
}

interface collapsibleFormat {
    status : 'hidden'|'visible'
    format : JSX.Element
}


const getAmount = function(obj:cartItem):number{
    return obj.itemAmount
}

const removeItem = function(key:string, someNewMap:Map<string,cartItem> | null):Map<string,cartItem> | null{
        someNewMap?.delete(key)
        return someNewMap
    
}

const reduceMap = function(key: string, setter:React.Dispatch<SetStateAction<Map<string,cartItem> | null>>):void{
    setter(item => {
        let newMap = new Map(item)
        return removeItem(key, newMap)
    })
}

const SingleItem =  function(props:singleItemProps):JSX.Element{

    const [key,itemsSetter,decrement,increment] = [props.mapKey, props.setter,props.decrement,props.increment]
    let itemObject = props.itemObject
    let amount = itemObject.itemAmount.toString()
    let [collapsible, setCollapsible] = useState<collapsibleFormat>(
        {
            status : 'hidden',
            format : <div className='max-h-20 overflow-hidden'>
                        {itemObject.item} 
                     </div>
        }
        
    )

    const toggleCollapsibleView = function(){
        if(collapsible.status === 'hidden'){
            setCollapsible({
                status : 'visible',
                format : itemObject.item
            })
        }
        else {
            setCollapsible({
                status : 'hidden',
                format : <div className='max-h-20 overflow-hidden'>
                        {itemObject.item} 
                     </div>
            })
        }
    }




    return (
        <div className='bg-[#D6AD60]' key={genKey()}>
            {collapsible.format}
            <div className='flex justify-between'>
                <button type='button' aria-label={`decrement.${key}`} onClick = {() => {decrement(key)}}><Subtract/></button>
                <span className='text-3xl px-4 bg-white' data-testid={`amount.${key}`}>{amount}</span>
                <button type='button' aria-label={`increment.${key}`} onClick={() => {increment(key)}}><Add/></button>
            </div>
            <div className='flex justify-evenly'> 
                <button onClick={toggleCollapsibleView}><ToggleView /></button>
                <button className='mt-4 fill-red-500' type='button' aria-label={`remove.${key}`} onClick={() => {reduceMap(key,itemsSetter)}}><Remove/></button>
            </div>
            
        </div>
        
    )
}


export const Cart = function(props:cartProps):JSX.Element{

    const itemsSetter = props.itemsSetter 
    let itemsMap = props.itemsMap 
    let onMount:React.MutableRefObject<boolean> = useRef(false)
    
    let [cartContent,setCartContent] = useState<JSX.Element>(
    <main className='flex flex-col items-center bg-[#F4EBD0] min-h-screen text-[#122620]'>
        <div className='text-2xl font-bold'> 
            <span>Subtotal: </span>
            <span data-testid='totalPrice'>${0}</span>
        </div>
        <Link to='/products'>
            <button className='m-4 p-4 rounded-lg bg-[#D6AD60]' type='button'>Back to Marketplace</button>
        </Link>
        <span className='text-3xl'>Your cart is empty.</span>
    </main>
    )



    useEffect(()=>{
        onMount.current = true
    },[])

    useEffect(()=>{
        if(onMount.current){
            itemsSetter(function(iMap){
                if(iMap){
                    let newMap = new Map(iMap)
                    const items = Array.from(newMap.entries())
                    for(let item of items){
                        let [key, obj] = item
                        if(getAmount(obj) === 0 ){
                            removeItem(key,newMap)
                        }
                    }
                    return newMap   
                }
                return iMap                
                
            })
        }
        onMount.current = false

    },[itemsSetter])


    useEffect(() => {
        
        const incrementItem = function(key:string):void{
            itemsSetter(itemsMap => {
                if(itemsMap){
                    let target = itemsMap.get(key)
                    let amount  = target ? getAmount(target) + 1 : false
                    if(amount){
                        itemsMap = new Map(itemsMap)
                        let updatedObj = Object.assign({},target,{itemAmount:amount})
                        itemsMap.set(key,updatedObj)
                        
                    }
                }
                return itemsMap
            })
    
        }
               
        const decrementItem = function(key:string):void{
            itemsSetter(itemsMap => {
                if(itemsMap){
                    let target = itemsMap.get(key)
                    let amount  = target ? getAmount(target) - 1 : -1
                    if(amount >= 0){
                        itemsMap = new Map(itemsMap)
                        let updatedObj = Object.assign({},target,{itemAmount:amount})
                        itemsMap.set(key,updatedObj)
                        
                    }
                }
                return itemsMap
            })    
       
        }


        const reconcileSubTotal = function(itemArr:[string,cartItem][]):number{
            const relevantData = itemArr.map(elem => elem[1].itemAmount * elem[1].itemPrice)
            const initialValue = 0
            const subTotal = relevantData.reduce((prev,current) => parseFloat(prev.toFixed(2)) + parseFloat(current.toFixed(2)),initialValue)
            return subTotal
        }

        if(itemsMap){
            const itemsArray:[string,cartItem][] =  Array.from(itemsMap.entries())
            const renderedItems:JSX.Element[] = itemsArray.map(elem => 
                <SingleItem key={genKey()} mapKey={elem[0]} itemObject={elem[1]} setter={itemsSetter} increment={incrementItem} decrement={decrementItem} />
            )
            const subTotal:number = reconcileSubTotal(itemsArray)  
                setCartContent(
                    <main className='flex flex-col items-center bg-[#F4EBD0] min-h-screen text-[#122620]'> 
                        <div className='text-2xl font-bold'>
                            <span>Subtotal: </span>
                            <span data-testid='totalPrice'>${subTotal=== 0 ? 0 :subTotal.toFixed(2)}</span>
                            {subTotal === 0 ? false : <button className='m-4 p-4 rounded-lg bg-[#D6AD60] opacity-70' type='button' disabled={true}>Checkout</button>}
                        </div>
                        {subTotal === 0 ? 
                            <span className='text-3xl'>Your cart is empty.</span> : 
                            <section className='mt-8 rounded-lg text-center'>
                                <span className='p-2 w-full inline-block rounded-t-lg bg-[#B68D40] text-lg font-bold text-[#F4EBD0]'>Your Shopping Cart</span>
                                {renderedItems}
                            </section>}
                        <Link to='/products'>
                            <button className='m-4 p-4 rounded-lg bg-[#D6AD60]' type='button'>Back to Marketplace</button>
                        </Link>
                    </main>
                )

            
            
        }    

    },[itemsMap, itemsSetter])


    return (
        cartContent
    )  
    
}
