"use client";

import { useState } from "react"

type Message = {
    role: "user" | "ai";
    content: string;
};

export default function Home(){
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading,setIsLoading] = useState(false);
 
    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        if(!inputText.trim())return;

        const newMessages : Message[] =[...messages,{role: "user" , content: inputText}];
        setMessages(newMessages);
        setInputText("");
        setIsLoading(true);
        try{
            const response = await fetch("http://localhost:8000/api/generate-route",{
                method:"POST",
                headers:{"content-Type":"application/json"},
                body:JSON.stringify({user_input:inputText})
            });
            if (!response.ok) throw new Error("APIから反応がありませんでした");

            const data = await response.json();
            setMessages((prev) => [...prev,{ role: "ai", content:data.result}]);
        }
        catch (error){
        console.error(error)
        setMessages((prev) => [...prev,{role:"ai",content:"エラーが発生しました"}]);
        }
        finally{
        setIsLoading(false);
        }
    };
    return(
        <div className="flex flex-col h-screen bg-gray-50 font-sans">
            {"ヘッダー"}
            <header className="bg-bule-600 text-white p-4 shadow-md text-ceter font-bold">
                観光AIプランナー
            </header>
            <main className="felx-1 overflow-y-auto p-4 max-w-3xl w-full mx-auto" >
                {messages.length===0 &&(
                    <div className="text-center text-gray-400 py-10">
                        "こんにちは！AIトラベルプランナーです。どこへ旅行したいですか？"
                    </div>
                )}
                {messages.map((msg, index) => (
                  <div key={index} className={`mb-6 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-4 rounded-lg max-w-[80%] whitespace-pre-wrap ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-white shadow-sm border border-gray-200"}`}>
                        {msg.content}
                    </div>

                  </div>
                ))}
                
            </main>            
            <footer className="bg-white p-4 border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto w-full">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-full px-6 py-3 focus:outline-none foucus:ring-2 foucus:ring-blue-500"
                        placeholder="京都で抹茶スイーツを巡る半日ルートを教えて"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`text-white px-6 py-3 rounded-full transition-colors ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                        disabled={isLoading}
                    >
                        送信
                </button>
                </form>
            </footer>
        </div>
    )       

}