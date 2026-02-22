import type { Options } from "./types";

const DefaultOptions: Options = {
  modules: ["DisplaySize", "Resize", "AltText"],
  minWidth: 13,
  keyboardSizeDelta: 10,
  altTextPlaceholder: "Image description...",
  altTextLabel: "Alt Text:",
  overlayStyles: {
    position: "absolute",
    boxSizing: "border-box",
    border: "1px dashed #444",
  },
  handleStyles: {
    position: "absolute",
    height: "12px",
    width: "12px",
    backgroundColor: "white",
    border: "1px solid #777",
    boxSizing: "border-box",
    opacity: "0.80",
  },
  displayStyles: {
    position: "absolute",
    font: "12px/1.0 Arial, Helvetica, sans-serif",
    padding: "4px 8px",
    textAlign: "center",
    backgroundColor: "white",
    color: "#333",
    border: "1px solid #777",
    boxSizing: "border-box",
    opacity: "0.80",
    cursor: "default",
  },
  altTextContainerStyles: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4px",
    top: "calc(100% + 8px)",
    left: "0px",
    background: "white",
    border: "1px solid #ccc",
    padding: "4px 8px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  altTextLabelStyles: {
    font: "inherit",
    fontWeight: "bold",
    color: "#333",
  },
  altTextTextareaStyles: {
    border: "1px solid #ddd",
    padding: "2px 6px",
    font: "inherit",
    width: "200px",
    borderRadius: "2px",
  },
};

export default DefaultOptions;
