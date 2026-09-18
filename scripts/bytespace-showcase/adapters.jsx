/* Next-only props are intentionally stripped from the static image adapter. */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { jsx } from "react/jsx-runtime";

export function notify(message = "Account services are disconnected in this preserved demo.") {
  window.dispatchEvent(new CustomEvent("showcase-notice", { detail: message }));
}
export default function Image({ src, alt, fill, priority, unoptimized, quality, sizes, ...props }) {
  const value = typeof src === "string" ? src : src?.src;
  return jsx("img", { ...props, src: value?.startsWith("/") ? `/showcases/bytespace/assets${value}` : value, alt, ...(fill ? { style: { ...props.style, position: "absolute", inset: 0, width: "100%", height: "100%" } } : {}) });
}
export function Link({ children, href, ...props }) { return <button {...props} type="button" onClick={() => notify()}>{children}</button>; }
export const useRouter = () => ({ push: () => notify(), replace: () => notify() });
export const useSearchParams = () => new URLSearchParams();
export const usePathname = () => "/my-agents";
export const useSidebar = () => ({ openSidebar: () => notify(), state: { isOpen: false, type: null, data: null } });
export const useAgentSelection = () => ({ startSelection: () => notify(), isSelectionMode: false, toggleAgent: () => {}, isAgentSelected: () => false, selectionSource: null });
export const toast = { info: notify, success: notify, error: notify };
export function FaviconImage({ url, className, size = 16 }) {
  let label = "W";
  try { label = new URL(url).hostname.replace(/^www\./, "")[0].toUpperCase(); } catch { /* Local fallback for archived website references. */ }
  return <span className={className} style={{ width: size, height: size, display: "inline-grid", placeItems: "center", fontSize: 10, background: "#eef0f3", borderRadius: 3 }} aria-label="Website">{label}</span>;
}
