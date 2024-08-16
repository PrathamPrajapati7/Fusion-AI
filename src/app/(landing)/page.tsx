import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () =>{
    return(
        <><div>
            <h1>Landing Page (unprotected)</h1>
        </div>
        <Link href="/sign-in">
        <Button> Sign-in </Button>
        </Link>
        <Link href="/sign-up">
        <Button> Sign-up </Button>
        </Link>
    
        
        
        
        </>
                
    );
}

export default LandingPage;



//changes;
