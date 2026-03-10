"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './Chatbot.module.css';
import { Send, X, Mic } from 'lucide-react';
import Image from 'next/image';
import agricultureDataset from '../public/agricultureDataset.json';

interface Message {
    id: number;
    text: string;
    sender: 'bot' | 'user';
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Namaste! I am Kisan Sahayak. Ask me anything about crops, schemes, or weather.", sender: 'bot' }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState<'en-IN' | 'hi-IN'>('hi-IN');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const speakText = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel(); // Stop any current speech

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        // Optionally adjust rate/pitch
        utterance.rate = 0.9;

        window.speechSynthesis.speak(utterance);
    };

    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            // Automatically send the message after recognizing
            handleSendWithVoice(transcript);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const getFallbackResponse = async (userText: string) => {
        let replyText = "माफ़ कीजिए, मुझे इस प्रश्न का उत्तर अभी उपलब्ध नहीं है।";
        const lowerInput = userText.toLowerCase();

        try {
            // Weather API Integration
            if (lowerInput.includes('weather') || lowerInput.includes('temperature')) {
                const match = lowerInput.match(/in\s+([a-zA-Z\s]+)/i);
                const city = match ? match[1].trim() : 'Delhi';

                const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
                const geoData = await geoRes.json();

                if (geoData.results && geoData.results.length > 0) {
                    const { latitude, longitude, name } = geoData.results[0];
                    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m`);
                    const weatherData = await weatherRes.json();

                    if (weatherData && weatherData.current) {
                        replyText = `Right now in ${name}, it is ${weatherData.current.temperature_2m}°C with ${weatherData.current.relative_humidity_2m}% humidity.`;
                    }
                } else {
                    replyText = `I couldn't find the location '${city}'. Please try another city name.`;
                }
            }
            // Market Price
            else if (lowerInput.includes('price') || lowerInput.includes('rate') || lowerInput.includes('market')) {
                const marketData = [
                    { crop: 'wheat', price: 2150, mandis: 'Azadpur' },
                    { crop: 'rice', price: 3800, mandis: 'Karnal' },
                    { crop: 'mustard', price: 5600, mandis: 'Jaipur' },
                    { crop: 'cotton', price: 6200, mandis: 'Akola' },
                    { crop: 'onion', price: 1800, mandis: 'Nasik' },
                    { crop: 'potato', price: 800, mandis: 'Agra' }
                ];
                let foundCrop = marketData.find(c => lowerInput.includes(c.crop));
                if (foundCrop) {
                    replyText = `The current market rate for ${foundCrop.crop.charAt(0).toUpperCase() + foundCrop.crop.slice(1)} is approximately ₹${foundCrop.price} per quintal (Example: ${foundCrop.mandis} Mandi).`;
                } else {
                    replyText = "I don't have the live price for that specific crop right now. You can check the main 'Market' section for a full list.";
                }
            }
            // Crop Rec
            else if (lowerInput.includes('crop') || lowerInput.includes('grow')) {
                if (lowerInput.includes('sandy')) replyText = "For sandy soil, crops like Bajra, Groundnut, and Watermelon are highly recommended.";
                else if (lowerInput.includes('clay')) replyText = "For clay soil, which holds water well, Rice and Wheat are excellent choices.";
                else if (lowerInput.includes('black')) replyText = "Black soil is perfect for Cotton. It is known as 'Black Cotton Soil'.";
                else replyText = "Please tell me your soil type (e.g., 'crops for sandy soil') to give a specific recommendation.";
            }
            // Schemes
            else if (lowerInput.includes('scheme') || lowerInput.includes('pm kisan')) {
                replyText = "PM Kisan Samman Nidhi provides ₹6000/year to eligible farmers. You can find registration details in our 'Schemes' section.";
            }
            // Greeting
            else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('namaste')) {
                replyText = "Namaste! How can I assist you with farming today? Try asking for the weather in your city!";
            }
            // Offline Q&A Dataset Fallback
            else {
                let bestMatch = null;
                let maxMatchCount = 0;

                for (const item of agricultureDataset) {
                    let matchCount = 0;
                    for (const kw of item.keywords) {
                        if (lowerInput.includes(kw.toLowerCase())) {
                            matchCount++;
                        }
                    }
                    if (matchCount > maxMatchCount) {
                        maxMatchCount = matchCount;
                        bestMatch = item;
                    }
                }

                if (bestMatch && maxMatchCount > 0) {
                    replyText = bestMatch.answer;
                }
            }
        } catch (error) {
            console.error("Fallback logic error:", error);
        }
        return replyText;
    };

    const handleSendWithVoice = async (textToSend: string) => {
        if (!textToSend.trim()) return;

        const userMsg: Message = { id: Date.now(), text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: textToSend, language })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to connect to AI server.");
            }

            const replyText = data.reply || "Sorry, I couldn't understand that.";

            const botResponse: Message = {
                id: Date.now() + 1,
                text: replyText,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);

            // Speak the response automatically!
            speakText(replyText);

        } catch (error: any) {
            console.error("Chatbot API Error:", error);

            try {
                // Try playing the fallback response
                const fallbackReply = await getFallbackResponse(textToSend);

                const botResponse: Message = {
                    id: Date.now() + 1,
                    text: fallbackReply,
                    sender: 'bot'
                };
                setMessages(prev => [...prev, botResponse]);
                speakText(fallbackReply);

            } catch (fallbackError) {
                // If everything fails, show the exact error message
                let errorText = error.message;
                if (errorText === "Failed to fetch" || errorText.includes("Network")) {
                    errorText = "Network error. Please check your internet connection.";
                }

                const fallbackMessage = language === 'hi-IN'
                    ? `माफ़ करें, एक त्रुटि हुई: ${errorText}.`
                    : `Sorry, an error occurred: ${errorText}`;

                const botResponse: Message = {
                    id: Date.now() + 1,
                    text: fallbackMessage,
                    sender: 'bot'
                };
                setMessages(prev => [...prev, botResponse]);
                speakText(fallbackMessage);
            }
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = () => {
        handleSendWithVoice(input.trim());
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className={styles.chatbotContainer}>
            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '30px', height: '30px', background: 'white', borderRadius: '50%', overflow: 'hidden' }}>
                                <Image src="/farmer_mascot.png" alt="Bot" width={30} height={30} style={{ objectFit: 'cover' }} />
                            </div>
                            <h3>Kisan Sahayak</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className={styles.messagesContainer}>
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`${styles.message} ${msg.sender === 'bot' ? styles.botMessage : styles.userMessage}`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div className={`${styles.message} ${styles.botMessage}`}>
                                <i>Typing...</i>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className={styles.controlsRow}>
                        <div className={styles.langToggle}>
                            <button
                                className={`${styles.langBtn} ${language === 'en-IN' ? styles.active : ''}`}
                                onClick={() => setLanguage('en-IN')}
                            >
                                EN
                            </button>
                            <button
                                className={`${styles.langBtn} ${language === 'hi-IN' ? styles.active : ''}`}
                                onClick={() => setLanguage('hi-IN')}
                            >
                                हिंदी
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputArea}>
                        <button
                            className={`${styles.micBtn} ${isListening ? styles.listening : ''}`}
                            onClick={startListening}
                            title="Speak your question"
                        >
                            <Mic size={24} />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask a question..."
                            className={styles.input}
                        />
                        <button onClick={handleSend} className={styles.sendBtn}>
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}

            <button className={styles.toggleBtn} onClick={() => setIsOpen(!isOpen)}>
                {!isOpen && (
                    <div className={styles.speechBubble}>
                        How may I assist you?
                    </div>
                )}
                <div style={{ width: '80px', height: '80px', position: 'relative' }}>
                    <Image
                        src="/farmer_mascot.png"
                        alt="Farmer Mascot"
                        fill
                        style={{ objectFit: 'contain' }}
                        className={styles.mascotImage}
                    />
                </div>
            </button>
        </div>
    );
}
