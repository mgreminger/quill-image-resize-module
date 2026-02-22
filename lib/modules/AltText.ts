import { BaseModule } from "./BaseModule";

export class AltText extends BaseModule {
  container: HTMLElement | null = null;
  textarea: HTMLTextAreaElement | null = null;

  onCreate = () => {
    if (!this.overlay || !this.img) {
      return;
    }

    this.container = document.createElement("label");
    Object.assign(this.container.style, this.options.altTextContainerStyles);

    const label = document.createElement("span");
    label.innerText = this.options.altTextLabel;
    Object.assign(label.style, this.options.altTextLabelStyles);

    this.textarea = document.createElement("textarea");
    this.textarea.placeholder = this.options.altTextPlaceholder;
    this.textarea.value = this.img.alt || "";
    Object.assign(this.textarea.style, this.options.altTextTextareaStyles);

    this.textarea.addEventListener("input", this.handleChange);

    // Stop mousedown/touchstart propagation so clicking the input
    // doesn't trigger Quill's selection changes and hide the overlay
    this.textarea.addEventListener("mousedown", this.stopEvent);
    this.textarea.addEventListener("touchstart", this.stopEvent, {
      passive: false,
    });
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
