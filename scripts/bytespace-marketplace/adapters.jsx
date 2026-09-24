import React, { createContext, useContext, useEffect, useState } from "react";
import { agentIds } from "./fixtures";

export const SidebarContext = createContext({ state: { subView: "" }, setSubView: () => {} });
export function useSidebar() {
  const context = useContext(SidebarContext);
  return { ...context, openSidebar: (_type, data) => {
    const id = data?.agentId;
    if (agentIds.includes(id)) window.parent.postMessage({ type: "bytespace-marketplace:open", id, input: data?.input }, window.location.origin);
  } };
}
export function usePlayback() {
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const sync = () => setRunning(Boolean(window.__archiveRunning));
    window.addEventListener("archive-playback", sync);
    sync();
    return () => window.removeEventListener("archive-playback", sync);
  }, []);
  return running;
}
export default function Image({ src, fill, priority, unoptimized, quality, sizes, ...props }) {
  const value = typeof src === "string" ? src : src?.src;
  const local = value?.startsWith("/showcases/") || value?.startsWith("data:") ? value : `/showcases/bytespace-marketplace/assets${value}`;
  return <img {...props} src={local} {...(fill ? { style: { ...props.style, position: "absolute", inset: 0, width: "100%", height: "100%" } } : {})} />;
}
export function FaviconImage({ url, alt, className, size = 24 }) {
  return <img src={`/showcases/bytespace-marketplace/assets/apps/${url}.png`} alt={alt || url} className={className} width={size} height={size} />;
}
export function CroppedProfilePicture() { return null; }
export function AgentSignupModal() { return null; }
export const useRouter = () => ({ push() {}, replace() {} });
export const useTheme = () => ({ theme: "light", resolvedTheme: "light", systemTheme: "light" });
