import { SetStateAction, useState, useEffect } from "react"


export interface cartItem {
    readonly item : JSX.Element,
    itemAmount : number
    readonly itemPrice : number
}

interface cartProps {
    itemsMap: Map<string,cartItem> | null
    readonly itemsSetter: React.Dispatch<SetStateAction<Map<string,cartItem> | null>>
    

}


export const Cart = function(props:cartProps):JSX.Element{

    let [cartContent,setCartContent] = useState<JSX.Element>(
    <div>
        <span>Your cart is empty</span>
    </div>
    )


    useEffect(() => {

        const getAmount = function(obj:cartItem){
            return obj.itemAmount
        }
        
        const removeItem = function(key:string){
            props.itemsSetter(item => {
                item?.delete(key)
                item = new Map(item)
                return item
            })
        }
    
        const incrementItem = function(key:string){
            props.itemsSetter(itemsMap => {
                if(itemsMap){
                    let target = itemsMap.get(key)
                    let amount  = target ? getAmount(target) + 1 : false
                    if(amount){
                        let updatedObj = Object.assign({},target,{itemAmount:amount})
                        itemsMap.set(key,updatedObj)
                        itemsMap = new Map(itemsMap)
                    }
                }
                return itemsMap
            })
    
        }
        
        const decrementItem = function(key:string){
            props.itemsSetter(itemsMap => {
                if(itemsMap){
                    let target = itemsMap.get(key)
                    let amount  = target ? getAmount(target) - 1 : -1
                    if(amount >= 0){
                        let updatedObj = Object.assign({},target,{itemAmount:amount})
                        itemsMap.set(key,updatedObj)
                        itemsMap = new Map(itemsMap)
                    }
                }
                return itemsMap
            })
            
        
        }

        const removeEmptyOrders = function(){
            if(props.itemsMap){
                const items = Array.from(props.itemsMap.entries())
                for(let item of items){
                    let [key, obj] = item
                    if(getAmount(obj) === 0 ){
                        removeItem(key)
                    }
    
                }
            }
    
        }
        

        const renderItem = function(key:string,itemObject:cartItem ){
            let amount = itemObject.itemAmount.toString()
    
            return (
                <div>
                    {itemObject.item}
                    <div>
                        <button onClick = {() => {decrementItem(key)}}>Decrement</button>
                        <span data-testid='amount'>{amount}</span>
                        <button onClick={() => {incrementItem(key)}}>Increment</button>
                    </div>
                    <button onClick={() => {removeItem(key)}}>Remove</button>
    
                </div>
                
            )
        }

        if(props.itemsMap){
            const itemsArray =  Array.from(props.itemsMap.entries())
            const renderedItems = itemsArray.map(elem => renderItem(elem[0],elem[1]))
            setCartContent(
                <div>
                    {renderedItems}
                </div>
            )
            return () => {
                removeEmptyOrders()
            }
            
        }
    

    },[props])

    return (
        cartContent
    )  
    
}
