import { cn } from "@/lib/utils";

type MessageProps = {
  content: string;
  isUser: boolean;
  timestamp?: string;
};

const Message = ({ content, isUser, timestamp }: MessageProps) => {
  return (
    <div
      className={cn(
        "mb-4 max-w-[80%] rounded-lg p-4",
        isUser
          ? "ml-auto bg-primary text-primary-foreground"
          : "glass-morphism text-foreground"
      )}
    >
      <div className="flex items-center mb-1">
        <div
          className={cn(
            "text-xs font-medium",
            isUser ? "text-primary-foreground/80" : "text-foreground/80"
          )}
        >
          {isUser ? "You" : "UnLovable AI"}
        </div>
        {timestamp && (
          <div
            className={cn(
              "text-xs ml-2",
              isUser ? "text-primary-foreground/60" : "text-foreground/60"
            )}
          >
            {timestamp}
          </div>
        )}
      </div>

      {/* 👇 Display content with HTML support */}
      <div
        className="whitespace-pre-wrap text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default Message;
