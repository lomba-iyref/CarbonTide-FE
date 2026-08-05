"use client"
import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
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
    }: {
        setOpenBot: Dispatch<SetStateAction<boolean>>;
        messageProps: [string, Dispatch<SetStateAction<string>>];
    })
{
    const [message, setMessage] = messageProps;
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    type Message = {
        from: "You" | "TideBot";
        text: string;
    }

    const [messages, setMessages] = useState<Message[]>([
        {
            from: "TideBot",
            text: "Halo! Ada yang bisa aku bantu?"
        }
    ]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    const addNewMessage = (
        from: "You" | "TideBot",
        text: string
    ) => {
        setMessages(prev => [
            ...prev,
            {
                from,
                text,
            },
        ]);
    };

    const answerMessage = async (userMessage: string) => {
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({
                    message: userMessage,
                }),
            });

            const data = await res.json();
            addNewMessage("TideBot", data.text);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!message.trim()) return;

        addNewMessage("You", message);

        const currentMessage = message;

        setMessage("");

        await answerMessage(currentMessage);
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
            <CardContent className="flex flex-col gap-3 h-50 overflow-y-auto">
                {messages.map((msg, index) => (
                    <Chat
                        key={index}
                        from={msg.from}
                        message={msg.text}
                    />
                ))}

                {loading && <TypingIndicator />}
                <div ref={bottomRef}/>
            </CardContent>
            <CardFooter className="bg-white flex flex-col gap-3">
                <Textarea 
                    disabled={loading}
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

function TypingIndicator() {
    return (
        <div className="relative flex flex-row gap-2 w-full justify-start">
            <Bot />

            <div className="relative translate-y-1 flex flex-col gap-1 items-start">
                <p>TideBot</p>

                <div className="bg-gray-200 rounded-xl px-4 py-3">
                    <div className="flex gap-1">
                        <span className="size-2 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.3s]" />
                        <span className="size-2 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.15s]" />
                        <span className="size-2 rounded-full bg-gray-500 animate-bounce" />
                    </div>
                </div>
            </div>
        </div>
    );
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
    const messageProps = useState("");

    return (
        <div className="fixed z-1 bottom-10 right-10 rounded-full shadow-lg">
            {openBot ? <BotCard  messageProps={messageProps} setOpenBot={setOpenBot}/> : <BotButton setOpenBot={setOpenBot}/>}
        </div>
    );
}