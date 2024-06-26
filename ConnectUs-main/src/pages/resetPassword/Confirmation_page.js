import "./reset.css"
import { useParams } from "react-router-dom";

export default function Confirmation_page() {
    const params=useParams();
    return(
        <div className="bg-[#e1f4fa] min-w-[100vw] min-h-[100vh] flex justify-center items-center">
            <div className="flex flex-col sm:flex-row justify-center  gap-[30px] w-[100%]">
                <div className="left flex flex-col justify-center max-[641px]:items-center sm:pl-[20px] w-[100%] sm:w-[50%]">
                    <h4 className="resetLogo text-[36px] sm:text-[55px] font-medium">
                        ConnectUs
                    </h4>
                    <div className="text-[15px] sm:text-[24px] max-[641px]:text-center font-medium w-[90%] sm:w-[70%]">
                        Connect with friends and the world around you on ConnectUs.
                    </div>
                </div>
                <div className="text-black mt-[20px]">
                    <h3 style={{textAlign:"center"}}>Confirmation mail is sent on {params.email}  Please verify the provided email and set the new Password.</h3>
                </div>
            </div>
        </div>
    )
}
