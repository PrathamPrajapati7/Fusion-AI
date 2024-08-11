import { Heading } from "@/components/heading";
import { MessageSquare } from "lucide-react";

const ConversationPage = () => {
    return(
        <div>
            <Heading title={"Conversation"} 
            description={"Our most advanced conversation tool "} 
            Icon={MessageSquare} 
            IconColor="text-voilet-500"
            bgColor="bg-voilet-500/10"
            />
        </div>
    );
}

export default ConversationPage;