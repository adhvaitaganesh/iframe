import { useEffect, useState } from "react";
import { useReadContract } from "thirdweb/react";
import contractInstance2 from "../ui/ThirdWeb2";

import styles from "../../styles/Home.module.css";
import { ExternalLink } from "../ui";


type RetrieveProps = {
    tokenId: string;
    contractAdd: string;
  };

const Links = ({tokenId, contractAdd} : RetrieveProps) => {

    const contract = contractInstance2(contractAdd)

    const [data, setData] = useState("")

    const [refresh, setRefresh] = useState(0)

    /*useEffect(() => {
        async function fetchData() {
        const result = useReadContract({
            contract,
            method: "retrieveSimple",
            params: [BigInt(tokenId)],
        });
        setData(result.data ?? "")
    }

        fetchData();
    }, [refresh + 1])*/

    const result = useReadContract({
        contract,
        method: "retrieveSimple",
        params: [BigInt(tokenId)],
      });
    
      useEffect(() => {
        setData(result.data ?? "");
      }, [refresh]);



    //create a button when clicked shoud execute the below statements
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const handleClick = () => {
        setIsButtonClicked(true);
        //alert(isLoading);
        //alert(dataArr);
        setRefresh(refresh +1 )
    };

    //split the data (string) into an array if data is not undefined

    let dataArr: string[] = [];
    let dataSubArr: string[] = [];

    if(data){
        dataArr = data.split(',');
        //discard the first 2 element of the array

        console.log(dataArr);
    }
    else{
        console.log(data + ' is undefined');
    }


    return (
        <div className='text3xl'>
        <button className= {styles.buttonClass} onClick={handleClick}>Provenance</button>
        {isButtonClicked && data && dataArr.map((item, index) => (
              <div key={index} className={styles.dataClass}>
                <div>{item.split('&')[0]}</div>
                <ExternalLink className="h-[20px] w-[20px]" link={item.split('&')[1]} />
              </div>
            ))}
        </div>
    );

};

export default Links;