"use client"; // Enable client-side rendering

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import webData from "@/assets/webData.json"
const Chatbot = () => {
    const [showChat, setShowChat] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hello! How can I assist you today?" },
    ]);
    const [loading, setLoading] = useState(false);

    // Function to call AI API
    async function generateAnswer() {
        if (!userInput.trim()) return;
        setLoading(true);

        // Add user message
        setMessages([...messages, { sender: "user", text: userInput }]);

        try {
            const response = await axios.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDE4ka-m01Wwj7uBUIe_XxmcvrBpFVOPLs",
                {
                    contents: [{
                        parts: [
                            {
                                text: `Answer the following question **naturally and concisely** without mentioning where the information came from. 
                
                Do NOT say "As per provided details" or "Based on the provided details." 
                Just give a **direct answer** like a chatbot in a conversation.
                                And Answer should ot be long It should be maximum 2 lines only
                Question: ${userInput}`
                            },
                            { text: `Website Details: ${JSON.stringify(webData)}` },]
                    }],
                }
            );

            setMessages([
                ...messages,
                { sender: "user", text: userInput },
                { sender: "bot", text: response.data.candidates[0].content.parts[0].text },
            ]);
        } catch (error) {
            setMessages([
                ...messages,
                { sender: "user", text: userInput },
                { sender: "bot", text: "Sorry, I couldn't process your request." },
            ]);
        }

        setLoading(false);
        setUserInput("");
    }

    return (
        <div>
            {/* Floating Button */}
            <Button
                onClick={() => setShowChat(!showChat)}
                className="fixed bottom-4 right-4 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg"
            >
                💬
            </Button>

            {/* Chatbot Modal */}
            {showChat && (
                <Card className="fixed bottom-20 right-4 w-[30rem] h-[25rem] bg-white border-gray-500 dark:border-teal-100 dark:bg-[#1C2634] rounded-lg shadow-md p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Chatbot</h3>
                        <div>
                        <Button variant="ghost" onClick={() => setMessages([
        { sender: "bot", text: "Hello! How can I assist you today?" },
    ])}>
                            Clear Chat
                        </Button>
                        <Button variant="ghost" onClick={() => setShowChat(false)}>
                            ❌
                        </Button>
                        </div>
                    </div>

                    {/* Chat Messages Container */}
                    <div className="h-64 overflow-y-auto space-y-2 p-2 border border-gray-500 dark:border-teal-100 rounded-md flex flex-col">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded-md text-sm max-w-[75%] ${msg.sender === "user"
                                        ? "bg-black text-white self-end text-right rounded-br-none" // User messages (Right-aligned)
                                        : "bg-gray-100 text-gray-900 self-start text-left rounded-bl-none" // Bot messages (Left-aligned)
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {loading && (
                            <div className="p-2 rounded-md bg-gray-100 text-gray-900 self-start text-left">
                                <span className="animate-pulse">...</span>
                            </div>
                        )}
                    </div>

                    {/* Input Field & Send Button */}
                    <div className="flex items-center space-x-2 mt-2">
                        <Input
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Type your message..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    generateAnswer(); // Trigger answer when Enter is pressed
                                }
                            }}
                            className="border-gray-500 dark:border-teal-100"
                        />
                        <Button onClick={generateAnswer} className="bg-blue-500 text-white">
                            ➤
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Chatbot;
