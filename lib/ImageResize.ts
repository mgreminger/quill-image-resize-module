import defaultsDeep from "lodash/defaultsDeep";
import type Quill from "quill";
import type { Options, ImageResizeOptions, Modules } from "./types";
import DefaultOptions from "./DefaultOptions";
import { DisplaySize } from "./modules/DisplaySize";
import { Resize } from "./modules/Resize";

const knownModules = { DisplaySize: DisplaySize, Resize: Resize };

/**
 * Custom module for quilljs to allow user to resize <img> elements
 * (Works on Chrome, Edge, Safari and replaces Firefox's native resize behavior)
 * @see https://quilljs.com/blog/building-a-custom-module/
 */
export default class ImageResize {
  quill: Quill;
  options: Options;
  moduleClasses: Modules;
  modules: (DisplaySize | Resize)[];
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

    // respond to clicks inside the editor
    this.quill.root.addEventListener("click", this.handleClick, false);

    if (this.quill.root.parentNode instanceof HTMLElement) {
      this.quill.root.parentNode.style.position =
        this.quill.root.parentNode.style.position || "relative";
    } else {
      console.warn("parentNode is not an HTMLElement");
    }

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

  handleClick = (evt: MouseEvent) => {
    if (evt.target && evt.target instanceof HTMLImageElement) {
      if (this.img === evt.target) {
        // we are already focused on this image
        return;
      }
      if (this.img) {
        // we were just focused on another image
        this.hide();
      }
      // clicked on an image inside the editor
      this.show(evt.target);
    } else if (this.img) {
      // clicked on a non image
      this.hide();
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

    // listen for the image being deleted or moved
    document.addEventListener("keyup", this.checkImage, true);
    this.quill.root.addEventListener("input", this.checkImage, true);

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

    // stop listening for image deletion or movement
    document.removeEventListener("keyup", this.checkImage);
    this.quill.root.removeEventListener("input", this.checkImage);

    // reset user-select
    this.setUserSelect("");
  };

  repositionElements = () => {
    if (!this.overlay || !this.img) {
      return;
    }

    // position the overlay over the image
    if (this.quill.root.parentNode instanceof HTMLElement) {
      const parent = this.quill.root.parentNode;
      const imgRect = this.img.getBoundingClientRect();
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

  checkImage = () => {
    if (this.img) {
      this.hide();
    }
  };
}
