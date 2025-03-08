"use client";
import { useChat, Message } from "@ai-sdk/react";
import AIAssistantAnimation from "./AIAssistantAnimation";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { FeatureFlag } from "@/features/flags";
import {
  VideoIcon,
  Type,
  FileText,
  Tags,
  Sparkles,
  ImageIcon,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

const AIAgentChat = ({ videoId }: { videoId: string }) => {
  const { user } = useUser();

  const containerRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, append, status } =
    useChat({
      maxSteps: 10,
      body: { videoId },
    });

  const [suggestions, setSuggestions] = useState<
    Array<{
      suggestion: string;
      reason: string;
    }>
  >([]);

  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);

  const isVideoAnalysisEnabled = useSchematicEntitlement(
    FeatureFlag.VIDEO_INSIGHTS
  );

  const isScriptGenerationEnabled = useSchematicEntitlement(
    FeatureFlag.SCRIPT_GENERATION
  );
  const isTitleGenerationEnabled = useSchematicEntitlement(
    FeatureFlag.TITLE_GENERATION
  );
  const isDescriptionGenerationEnabled = useSchematicEntitlement(
    FeatureFlag.GENERATE_DESCRIPTION
  );
  const isTagsGenerationEnabled = useSchematicEntitlement(
    FeatureFlag.GENERATE_TAGS
  );
  const isHookGenerationEnabled = useSchematicEntitlement(
    FeatureFlag.GENERATE_HOOKS
  );
  const isImageGenerationEnabled = useSchematicEntitlement(
    FeatureFlag.THUMBNAIL_GENERATION
  );

  const getSuggestions = useCallback(async () => {
    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        body: JSON.stringify({ videoId }),
      });
      const data = await response.json();
      setSuggestions(data.suggestions);
      setIsLoadingSuggestions(false);
    } catch (error) {
      console.error(error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [videoId]);

  useEffect(() => {
    getSuggestions();
  }, [getSuggestions]);

  const generateScript = () => {
    const message: Message = {
      id: `generate-script-${Date.now()}`,
      content:
        "Generate a detailed shooting script for recreating a similar video. Include camera angles, shot types, and specific instructions for each scene. Focus only on the filming instructions and scene breakdown. Format the response as a numbered shooting script with clear, actionable steps.",
      role: "user",
    };
    append(message);
  };

  const generateTitle = () => {
    const message: Message = {
      id: `generate-title-${Date.now()}`,
      content:
        "Generate 5 engaging and SEO-optimized titles for a similar video. Focus on clickworthy, yet accurate titles that would perform well on YouTube. Format as a numbered list.",
      role: "user",
    };
    append(message);
  };

  const generateDescription = () => {
    const message: Message = {
      id: `generate-description-${Date.now()}`,
      content:
        "Generate a compelling YouTube video description for a similar video. Include relevant keywords, timestamps, and calls-to-action. Format it properly with sections and line breaks.",
      role: "user",
    };
    append(message);
  };

  const generateTags = () => {
    const message: Message = {
      id: `generate-tags-${Date.now()}`,
      content:
        "Generate a list of relevant SEO-optimized tags for a similar video. Include a mix of broad and specific keywords. Format as a comma-separated list.",
      role: "user",
    };
    append(message);
  };

  const generateHook = () => {
    const message: Message = {
      id: `generate-hook-${Date.now()}`,
      content:
        "Generate 3 attention-grabbing hooks for the first 5-10 seconds of a similar video. Focus on immediately capturing viewer interest. Format as a numbered list with each hook being 1-2 sentences.",
      role: "user",
    };
    append(message);
  };
  const generateImage = () => {
    const message: Message = {
      id: `generate-image-${Date.now()}`,
      content:
        "Generate a compelling thumbnail image for this video. Focus on creating an eye-catching, clickable design that accurately represents the video content. Include suggestions for text overlay, focal points, and color schemes that would work well for YouTube thumbnails.",
      role: "user",
    };
    append(message);
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      const scrollContainer = containerRef.current.querySelector(
        ".messages-container"
      );
      scrollContainer?.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div ref={containerRef} className="flex flex-col h-full relative">
      <div className="hidden xl:flex items-center gap-2 mb-4 px-4 py-3 border-b border-gray-200">
        <AIAssistantAnimation size="sm" />
        <h2>AI Agent</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth messages-container custom-scrollbar">
        <div className="space-y-6">
          {messages?.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 message-animation ${
                message.role === "user" ? "justify-end" : "justify-start"
              } ${
                index > 0 && messages[index - 1].role === message.role
                  ? "mt-1"
                  : "mt-6"
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {message.role === "assistant" && (
                <div className="animate-fade-in">
                  <AIAssistantAnimation
                    size="sm"
                    className="mb-1 flex-shrink-0"
                  />
                </div>
              )}
              <div
                className={`relative max-w-[80%] px-4 py-2.5 rounded-[1.3rem] message-bubble ${
                  message.role === "user"
                    ? "bg-primary rounded-br-md message-bubble-user"
                    : "bg-[#f1f1f1] text-gray-900 rounded-bl-md"
                }`}
              >
                <div className={cn("", message.role==="user" && "text-primary-foreground")}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
              {message.role === "user" && (
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex-shrink-0 mb-1 relative overflow-hidden animate-fade-in">
                  <Image
                    src={user?.imageUrl || "/avatar.png"}
                    alt={user?.fullName || "User"}
                    fill
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        {
          <>
            {isLoadingSuggestions ? (
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-shrink-0 bg-white px-4 py-2">
                    <Skeleton className="h-8 w-64 rounded-md" />
                  </div>
                ))}
              </div>
            ) : (
              suggestions.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {suggestions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const message: Message = {
                          id: `suggested-${Date.now()}`,
                          content: item.suggestion,
                          role: "user",
                        };
                        append(message);
                      }}
                      className="flex-shrink-0 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer text-sm text-gray-700 transition-colors font-cal max-w-sm"
                    >
                      {item.suggestion}
                    </button>
                  ))}
                </div>
              )
            )}
          </>
        }
      </div>
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="space-y-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              disabled={!isVideoAnalysisEnabled}
              className="flex-1 px-4 py-2 text-sm border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/10"
              value={input}
              onChange={handleInputChange}
              placeholder={
                isVideoAnalysisEnabled
                  ? "Ask a question"
                  : "Upgrade to use this feature"
              }
            />
            <Button
              type="submit"
              disabled={
                input.length === 0 ||
                status === "streaming" ||
                status === "submitted"
              }
              className="disabled:cursor-not-allowed"
            >
              {status === "streaming" ? (
                <AIAssistantAnimation size="sm" />
              ) : (
                "Send"
              )}
            </Button>
          </form>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={generateScript}
              disabled={!isScriptGenerationEnabled}
              variant={"ghost"}
              className="flex items-center gap-2"
            >
              <VideoIcon />
              Generate Script
            </Button>
            <Button
              onClick={generateTitle}
              disabled={!isTitleGenerationEnabled}
              variant={"ghost"}
              className="flex items-center gap-2"
            >
              <Type />
              Generate Title
            </Button>
            <Button
              onClick={generateDescription}
              disabled={!isDescriptionGenerationEnabled}
              variant={"ghost"}
              className="flex items-center gap-2"
            >
              <FileText />
              Generate Description
            </Button>
            <Button
              onClick={generateTags}
              disabled={!isTagsGenerationEnabled}
              variant={"ghost"}
              className="flex items-center gap-2"
            >
              <Tags />
              Generate Tags
            </Button>
            <Button
              onClick={generateHook}
              disabled={!isHookGenerationEnabled}
              variant={"ghost"}
              className="flex items-center gap-2"
            >
              <Sparkles />
              Generate Hook
            </Button>
            <Button
              onClick={generateImage}
              disabled={!isImageGenerationEnabled}
              variant={"ghost"}
              className="flex items-center gap-2"
            >
              <ImageIcon />
              Generate Thumbnail
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgentChat;
