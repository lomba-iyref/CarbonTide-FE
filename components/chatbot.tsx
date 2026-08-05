"use client"
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Bot, X, SendHorizontal } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { ai } from "@/lib/chatbot";

function Chat({ from, message }: { from: string, message: string })
{
    const fromBot = from === "TideBot";
    console.log("from: "+from)
    const position = fromBot ? "start" : "end";
    const bgColor = fromBot ? "gray-200" : "primary";
    const textColor = fromBot ? "black" : "white";

    return (
        <div className={`relative flex flex-row gap-2 w-full justify-${position}`}>
            { fromBot ? <Bot /> : <></>}
            <div className={`relative translate-y-1 flex flex-col gap-1 items-${position}`}>
                <p>{from}</p>
                <div className={`max-w-70 bg-${bgColor} text-${textColor} py-1 px-2 rounded-lg`}>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    )
}

function BotCard({ 
        setOpenBot, 
        messageProps, 
        messagesProps 
    }: { 
        setOpenBot: Dispatch<SetStateAction<boolean>>, 
        messageProps: [string, Dispatch<SetStateAction<string>>], 
        messagesProps: [string[], Dispatch<SetStateAction<string[]>>] 
    })
{
    const [messages, setMessages] = messagesProps;
    const [message, setMessage] = messageProps;

    const addNewMessage = (message: string) => {
        const newMessages = messages.copyWithin(-1, -1);
        newMessages.push(message);
        setMessages(newMessages);
    }

    const answerMessage = async () => {
        const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
        });

        const data = await res.json();

        addNewMessage(data.text);
    }

    const handleSend = async () => {
        addNewMessage(message);
        answerMessage();
        setMessage("");
    }

    const button = message === "" ?
        <Button className="bg-gray-200 hover:bg-gray-300" onClick={handleSend}>
            <SendHorizontal color="black"/>
        </Button> : 
        <Button onClick={handleSend}>
            <SendHorizontal color="white"/>
        </Button>

    return (
        <Card className="flex flex-col w-xs md:w-xl lg:w-115">
            <CardHeader className="flex flex-row items-center justify-between border-b">
                <div className="flex flex-row items-center gap-2">
                    <Bot className="size-8"/>
                    <p className="text-sh-l">TideBot</p>
                </div>
                <Button 
                    className="bg-transparent hover:bg-gray-200"
                    onClick={() => setOpenBot(false)}
                >
                    <X color="black" className="size-7"/>
                </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 h-50 overflow-y-auto w-full">
                {messages.map((message, index) => <Chat from={index % 2 === 0 ? "TideBot" : "You"} message={message} key={index}/>)}
            </CardContent>
            <CardFooter className="bg-white flex flex-col gap-3">
                <Textarea 
                    value={message} placeholder="Type your question here." 
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <div className="flex flex-row justify-between items-center w-full">
                    <p className="text-text-secondary">Click 'enter' to send the message</p>
                    {button}
                </div>
            </CardFooter>
        </Card>
    )
}

function BotButton({ setOpenBot }: { setOpenBot: Dispatch<SetStateAction<boolean>> })
{
    return (
        <Button 
            className="flex flex-col items-center gap-1 text-black justify-center size-20 rounded-full bg-white border-gray-300 hover:bg-gray-200"
            onClick={() => setOpenBot(true)}
        >
            <Bot className="size-7"/>
            <p className="text-c-r">ChatBot!</p>
        </Button>
    );
}

export default function ChatBot()
{
    const [openBot, setOpenBot] = useState(false);
    const messagesProps = useState(["Halo! Ada yang bisa aku bantu?"])
    const messageProps = useState("");

    return (
        <div className="fixed z-1 bottom-10 right-10 rounded-full shadow-lg">
            {openBot ? <BotCard messagesProps={messagesProps} messageProps={messageProps} setOpenBot={setOpenBot}/> : <BotButton setOpenBot={setOpenBot}/>}
        </div>
    );
}