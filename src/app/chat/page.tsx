"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import {
  ImageIcon,
  SendIcon,
  XIcon,
  SparklesIcon,
  ChefHatIcon,
  SunIcon,
  MoonIcon,
} from "@/components/ui/Icons";
import { useTheme } from "@/components/ThemeProvider";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      image: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setSelectedImage(null);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "I can see your fridge contents! Let me analyze what you have and suggest some delicious recipes you can make with these ingredients. Based on what I see, here are some recipe ideas...",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-md">
              <ChefHatIcon className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                FridgeWiz AI
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your personal cooking assistant
              </p>
            </div>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {theme === "light" ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="text-center py-8 sm:py-12">
              <div className="mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Welcome to FridgeWiz AI
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm sm:text-base">
                  Upload a photo of your fridge contents and ask me what you can
                  cook! I&apos;ll help you create amazing recipes with what you
                  have.
                </p>
              </div>

              {/* Example prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <ImageIcon className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      Upload & Analyze
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                    Take a photo of your fridge and get recipe suggestions
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <ChefHatIcon className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      Recipe Ideas
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                    Get creative recipes based on your ingredients
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Messages
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg shadow-sm ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {message.image && (
                      <div className="mb-3">
                        <img
                          src={message.image}
                          alt="Uploaded content"
                          className="rounded-lg max-w-full h-auto shadow-md"
                        />
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        message.type === "user"
                          ? "text-green-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Analyzing your fridge...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          {selectedImage && (
            <div className="mb-4 relative inline-block">
              <img
                src={selectedImage}
                alt="Selected"
                className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe what you'd like to cook, or upload a photo of your fridge..."
                  className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  rows={1}
                  style={{ minHeight: "48px", maxHeight: "120px" }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && !selectedImage}
              className="px-3 py-3 sm:px-4"
            >
              <SendIcon className="w-5 h-5" />
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
