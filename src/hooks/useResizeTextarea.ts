import { useEffect, useRef } from "react";

interface UseResizeReturn {
  ref: React.MutableRefObject<HTMLTextAreaElement>
  onInput: (e: React.FormEvent<HTMLTextAreaElement>) => void;
}

export const useResizeTextarea = (): UseResizeReturn => {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = (): void => {
    ref.current.style.height = "inherit";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  };

  const onInput = (e: React.FormEvent<HTMLTextAreaElement>): void => {
    if (!ref.current) return;
    resize();
  };

  useEffect(() => {
    if (ref.current) resize();
  }, [ref.current, resize]);

  return {ref, onInput};
};
