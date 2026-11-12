import { useEffect, useRef, useState } from "react";

interface RoomCodeBadgeProps {
  code: string;
}

export function RoomCodeBadge({ code }: RoomCodeBadgeProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const request = useRef(0);

  useEffect(() => {
    setCopyState("idle");
    return () => {
      request.current += 1;
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, [code]);

  async function handleCopy() {
    const currentRequest = ++request.current;
    if (timer.current !== null) clearTimeout(timer.current);
    setCopyState("idle");

    try {
      await navigator.clipboard.writeText(code);
      if (currentRequest !== request.current) return;
      setCopyState("copied");
      timer.current = setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      if (currentRequest === request.current) setCopyState("error");
    }
  }

  return (
    <div className="room-code-badge">
      <span className="room-code-badge__label">Room Code</span>
      <div className="room-code-badge__row">
        <span className="room-code-badge__code">{code}</span>
        <button className="button button--secondary room-code-badge__copy" type="button" onClick={handleCopy}>
          {copyState === "copied" ? "Copied" : "Copy"}
        </button>
      </div>
      <span className="room-code-badge__hint" role="status">
        {copyState === "error" ? "Copy failed; select the code manually." : "Share this code with friends to join"}
      </span>
    </div>
  );
}
