import { SetStateAction } from "react"

interface cartItem {
    item : JSX.Element,
    itemAmount : Number
}

interface cartProps {
    itemsArray: cartItem[] | []
    itemsSetter: React.Dispatch<SetStateAction<cartItem[] |[]>>
    

}


const Cart = function(props:cartProps):JSX.Element{
    return(
        <div></div>
    )

}

export default Cart