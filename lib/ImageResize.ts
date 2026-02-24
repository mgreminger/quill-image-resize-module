import defaultsDeep from "lodash/defaultsDeep";
import type Quill from "quill";
import type { Range } from "quill";
import type { Options, ImageResizeOptions, Modules } from "./types";
import { Parchment } from "quill";
import DefaultOptions from "./DefaultOptions";
import { DisplaySize } from "./modules/DisplaySize";
import { Resize } from "./modules/Resize";
import { AltText } from "./modules/AltText";

const knownModules = {
  DisplaySize: DisplaySize,
  Resize: Resize,
  AltText: AltText,
};

/**
 * Custom module for quilljs to allow user to resize <img> elements
 * (Works on Chrome, Edge, Safari and replaces Firefox's native resize behavior)
 * @see https://quilljs.com/blog/building-a-custom-module/
 */
export default class ImageResize {
  quill: Quill;
  options: Options;
  moduleClasses: Modules;
  modules: (DisplaySize | Resize | AltText)[];
  img: HTMLImageElement | null = null;
  overlay: HTMLDivElement | null = null;

  constructor(quill: Quill, options: ImageResizeOptions = {}) {
    // save the quill reference and options
    this.quill = quill;

    // Apply the options to our defaults, and stash them for later
    // defaultsDeep doesn't do arrays as you'd expect, so we'll need to apply the classes array from options separately
    let moduleClasses: Modules | false = false;
    if (options.modules) {
      moduleClasses = options.modules.slice();
    }

    // Apply options to default options
    this.options = defaultsDeep({}, options, DefaultOptions) as Options;

    // (see above about moduleClasses)
    if (moduleClasses !== false) {
      this.options.modules = moduleClasses;
    }

    // respond to image being selected
    this.quill.root.addEventListener("click", this.handleClick);
    this.quill.on("selection-change", this.handleSelectionChange);
    this.quill.on("text-change", this.handleTextChange);

    // setup modules
    this.moduleClasses = this.options.modules;

    this.modules = [];
  }

  initializeModules = () => {
    this.removeModules();

    this.modules = this.moduleClasses.map((ModuleClass) => {
      if (typeof ModuleClass === "string") {
        return new knownModules[ModuleClass](this);
      } else {
        return new ModuleClass(this);
      }
    });

    this.modules.forEach((module) => {
      module.onCreate();
    });

    this.onUpdate();
  };

  onUpdate = () => {
    this.repositionElements();
    this.modules.forEach((module) => {
      module.onUpdate();
    });
  };

  removeModules = () => {
    this.modules.forEach((module) => {
      module.onDestroy();
    });

    this.modules = [];
  };

  handleClick = (event: MouseEvent) => {
    // chrome and webkit don't automatically select an image when it's clicked so need to do this manually
    if (event.target instanceof HTMLImageElement) {
      const blot = (this.quill.constructor as typeof Quill).find(event.target);
      if (blot instanceof Parchment.EmbedBlot) {
        this.quill.setSelection(blot.offset(this.quill.scroll), blot.length());
      }
    }
  };

  handleSelectionChange = (range: Range | null) => {
    let firstImage: HTMLImageElement | null = null;

    if (range) {
      const blots = this.quill.scroll.descendants(
        Parchment.EmbedBlot,
        range.index,
        range.length,
      );
      for (const blot of blots) {
        if (blot.domNode instanceof HTMLImageElement) {
          firstImage = blot.domNode;
        }
      }
    }

    if (firstImage) {
      this.show(firstImage);
    } else if (this.img) {
      if (this.overlay && this.overlay.contains(document.activeElement)) {
        return;
      }

      // clicked on a non image
      this.hide();
    }
  };

  handleTextChange = () => {
    if (this.img) {
      if (!(this.quill.constructor as typeof Quill).find(this.img)) {
        this.hide();
      }
    }
  };

  show = (img: HTMLImageElement) => {
    // keep track of this img element
    this.img = img;

    this.showOverlay();

    this.initializeModules();
  };

  showOverlay = () => {
    if (this.overlay) {
      this.hideOverlay();
    }

    // prevent spurious text selection
    this.setUserSelect("none");

    this.quill.root.addEventListener("keydown", this.handleKeyboardShortcuts);

    // Create and add the overlay
    this.overlay = document.createElement("div");
    Object.assign(this.overlay.style, this.options.overlayStyles);

    this.quill.root.parentNode?.appendChild(this.overlay);

    this.repositionElements();
  };

  hideOverlay = () => {
    if (!this.overlay) {
      return;
    }

    // Remove the overlay
    this.quill.root.parentNode?.removeChild(this.overlay);
    this.overlay = null;

    // reset user-select
    this.setUserSelect("");

    this.quill.root.removeEventListener(
      "keydown",
      this.handleKeyboardShortcuts,
    );
  };

  repositionElements = () => {
    if (!this.overlay || !this.img) {
      return;
    }

    // position the overlay over the image
    if (this.quill.root.parentNode instanceof HTMLElement) {
      const parent = this.quill.root.parentNode;
      const imgRect = this.img.getBoundingClientRect();
      if (imgRect.width === 0 || imgRect.height === 0) {
        // Actual image is not in the DOM yet (just image tag)
        // This occurs after undoing a delete, best to remove overlay
        this.hide();
        return;
      }
      const containerRect = parent.getBoundingClientRect();

      Object.assign(this.overlay.style, {
        left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
        top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
        width: `${imgRect.width}px`,
        height: `${imgRect.height}px`,
      });
    } else {
      console.warn("parentNode is not an HTMLElement");
    }
  };

  hide = () => {
    this.hideOverlay();
    this.removeModules();
    this.img = null;
  };

  setUserSelect = (value: string) => {
    // set on contenteditable element and <html>
    this.quill.root.style.setProperty("user-select", value);
    document.documentElement.style.setProperty("user-select", value);
  };

  handleKeyboardShortcuts = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    switch (event.key) {
      case "+":
        if (this.img) {
          this.img.width = Math.max(
            this.img.width + this.options.keyboardSizeDelta,
            this.options.minWidth,
          );
          this.onUpdate();
        } else {
          return;
        }
        break;
      case "-":
        if (this.img) {
          this.img.width = Math.max(
            this.img.width - this.options.keyboardSizeDelta,
            this.options.minWidth,
          );
          this.onUpdate();
        } else {
          return;
        }
        break;
      case "a":
      case "A":
      case "F2":
        const altInput = this.overlay?.querySelector("textarea");
        if (altInput) {
          altInput.focus({ preventScroll: false });
        } else {
          return;
        }
        break;
      case "Escape":
        this.hide();
        break;
      default:
        return;
    }

    event.preventDefault();
  };
}
