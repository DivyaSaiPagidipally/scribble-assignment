import { useEffect } from "react";

export function useRoomTitle(code: string | undefined) {
  useEffect(() => {
    document.title = code ? `Scribble · Room ${code}` : "Scribble";
    return () => {
      document.title = "Scribble";
    };
  }, [code]);
}
