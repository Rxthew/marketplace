import { SetStateAction } from "react"

interface cartItem {
    readonly item : JSX.Element,
    itemAmount : Number
    readonly itemPrice : Number
}

interface cartProps {
    itemsArray: cartItem[] | []
    readonly itemsSetter: React.Dispatch<SetStateAction<cartItem[] |[]>>
    

}



const Cart = function(props:cartProps):JSX.Element{

    const incrementItem = function(){

    }
    
    const decrementItem = function(){
    
    }
    
    const removeItem = function(){
        
    }

    const renderItem = function(itemObject:cartItem){
        let amount = itemObject.itemAmount.toString()

        return (
            <div>
                {itemObject.item}
                <button>Decrement</button>
                <span>{amount}</span>
                <button>Increment</button>
            </div>
            
        )
    }

    const renderedItems = props.itemsArray.map(itemObj => renderItem(itemObj))


    return(
        <div>
            {renderedItems}
        </div>
    )

}

export default Cart