import axios from "axios";
import { useEffect, useState } from "react"

export const Balance = () => {
    const [balance,setBalance] = useState();
    const token = "Bearer " + localStorage.getItem("token");
    useEffect(()=>{
        axios.get("http://localhost:3000/api/v1/account/balance",{
            headers: {
                authorization: token,
            }
        }).then(response => {
            setBalance(response.data.balance);
        })
    },[balance,setBalance]);
    return <div className="flex">
        <div className="font-bold text-lg">
            Your balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs {balance}
        </div>
    </div>
}