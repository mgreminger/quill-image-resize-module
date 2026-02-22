import type { DisplaySize } from "./modules/DisplaySize";
import type { Resize } from "./modules/Resize";
import type { AltText } from "./modules/AltText";

export type Modules = (
  | "DisplaySize"
  | "Resize"
  | "AltText"
  | typeof DisplaySize
  | typeof Resize
  | typeof AltText
)[];

export type Options = {
  modules: Modules;
  minWidth: number;
  keyboardSizeDelta: number;
  altTextPlaceholder: string;
  altTextLabel: string;
  overlayStyles: {
    position: string;
    boxSizing: string;
    border: string;
  };
  handleStyles: {
    position: string;
    height: string;
    width: string;
    backgroundColor: string;
    border: string;
    boxSizing: string;
    opacity: string;
  };
  displayStyles: {
    position: string;
    font: string;
    padding: string;
    textAlign: string;
    backgroundColor: string;
    color: string;
    border: string;
    boxSizing: string;
    opacity: string;
    cursor: string;
  };
  altTextContainerStyles: {
    position: string;
    display: string;
    flexDirection: string;
    alignItems: string;
    gap: string;
    top: string;
    left: string;
    background: string;
    border: string;
    padding: string;
    borderRadius: string;
    boxShadow: string;
  };
  altTextLabelStyles: {
    font: string;
    fontWeight: string;
    color: string;
  };
  altTextTextareaStyles: {
    border: string;
    padding: string;
    font: string;
    width: string;
    borderRadius: string;
  };
};

export type ImageResizeOptions = {
  modules?: Modules;
  minWidth?: number;
  keyboardSizeDelta?: number;
  overlayStyles?: {
    position?: string;
    boxSizing?: string;
    border?: string;
  };
  handleStyles?: {
    position?: string;
    height?: string;
    width?: string;
    backgroundColor?: string;
    border?: string;
    boxSizing?: string;
    opacity?: string;
  };
  displayStyles?: {
    position?: string;
    font?: string;
    padding?: string;
    textAlign?: string;
    backgroundColor?: string;
    colo?: string;
    border?: string;
    boxSizing?: string;
    opacity?: string;
    cursor?: string;
  };
};
