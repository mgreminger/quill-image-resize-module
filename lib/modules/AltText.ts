import { BaseModule } from "./BaseModule";

export class AltText extends BaseModule {
  container: HTMLElement | null = null;
  textarea: HTMLTextAreaElement | null = null;

  onCreate = () => {
    if (!this.overlay || !this.img) {
      return;
    }

    this.container = document.createElement("label");
    Object.assign(this.container.style, {
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
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    });

    const label = document.createElement("span");
    label.innerText = "Alt Text:";
    Object.assign(label.style, {
      font: "inherit",
      fontWeight: "bold",
      color: "#333",
    });

    this.textarea = document.createElement("textarea");
    this.textarea.placeholder = "Image description...";
    this.textarea.value = this.img.alt || "";
    Object.assign(this.textarea.style, {
      border: "1px solid #ddd",
      padding: "2px 6px",
      font: "inherit",
      outline: "none",
      width: "200px",
      borderRadius: "2px",
    });

    this.textarea.addEventListener("input", this.handleChange);
    
    // Stop mousedown/touchstart propagation so clicking the input 
    // doesn't trigger Quill's selection changes and hide the overlay
    this.textarea.addEventListener("mousedown", this.stopEvent);
    this.textarea.addEventListener("touchstart", this.stopEvent, { passive: false });
    this.textarea.addEventListener("keydown", this.stopEvent);

    this.container.appendChild(label);
    this.container.appendChild(this.textarea);
    this.overlay.appendChild(this.container);
  };

  onDestroy = () => {
    if (this.textarea) {
      this.textarea.removeEventListener("input", this.handleChange);
      this.textarea.removeEventListener("mousedown", this.stopEvent);
      this.textarea.removeEventListener("touchstart", this.stopEvent);
      this.textarea.removeEventListener("keydown", this.stopEvent);
    }

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    this.container = null;
    this.textarea = null;
  };

  handleChange = () => {
    if (this.img && this.textarea) {
      this.img.setAttribute("alt", this.textarea.value);
    }
  };

  stopEvent = (evt: Event) => {
    evt.stopPropagation();
  };
}