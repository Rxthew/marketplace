import { SetStateAction } from "react"

interface cartItem {
    readonly item : JSX.Element,
    itemAmount : Number
    readonly itemPrice : Number
}

interface cartProps {
    itemsMap: Map<string,cartItem> | null
    readonly itemsSetter: React.Dispatch<SetStateAction<Map<string,cartItem> | null>>
    

}



const Cart = function(props:cartProps):JSX.Element{


    const incrementItem = function(key:string){

    }
    
    const decrementItem = function(key:string){
    
    }
    
    const removeItem = function(key:string){
        
    }

    const renderItem = function(key:string,itemObject:cartItem ){
        let amount = itemObject.itemAmount.toString()

        return (
            <div>
                {itemObject.item}
                <div>
                    <button onClick = {() => {decrementItem(key)}}>Decrement</button>
                    <span>{amount}</span>
                    <button onClick={() => {incrementItem(key)}}>Increment</button>
                </div>
                <button onClick={() => {removeItem(key)}}>Remove</button>

            </div>
            
        )
    }
    if(props.itemsMap){
        const itemsArray =  Array.from(props.itemsMap.entries())
        const renderedItems = itemsArray.map(elem => renderItem(elem[0],elem[1]))
        return(
            <div>
                {renderedItems}
            </div>
        )
        
    }

    else{
        return (
            <div>
                <span>Your cart is empty</span>
            </div>
        )
    }
    


    

}

export default Cart