# Quill ImageResize Module

A module for Quill rich text editor to allow images to be resized.

A fork of [kensnyder/quill-image-resize-module](https://github.com/kensnyder/quill-image-resize-module) with the following changes:

- Updated to work with Quill 2
- Toolbar removed since alignment settings were not preserved in the Quill Delta data structure
- The presence of resize handles no longer impacts the underlying selection range so keyboard actions such as copy to clipboard and type to replace still work as expected
- Keyboard shortcuts added to increase image size (+ key) and decrease image size (- key)
- Resize handles now appear when image is selected with the keyboard (using shift with the arrow keys)
- Works with touch events in addition to mouse events
- Add `minWidth` and `keyboardSizeDelta` options for min image width and keyboard + and - size increment (both in pixels)
- Modernized toolchain using vite and TypeScript
- Add Playwright tests

## Demo

[Preview Site](https://mgreminger.github.io/quill-image-resize-module/)

## Installation

```console
npm install --save-dev @mgreminger/quill-image-resize-module
```

## Usage

### Importing and Registering the Module

```javascript
import Quill from "quill";
import ImageResize from "@mgreminger/quill-image-resize-module";

Quill.register("modules/imageResize", ImageResize);

const quill = new Quill(editorDiv, {
  // ...
  modules: {
    // ...
    imageResize: {
      // See optional "config" below
    },
  },
});
```

### Config

For the default experience, pass an empty object, like so:

```javascript
var quill = new Quill(editorDiv, {
  // ...
  modules: {
    // ...
    imageResize: {},
  },
});
```

Functionality is broken down into modules, which can be mixed and matched as you like. For example,
this config includes all of the modules (this is the default) and uses the default values for `minWidth` and `keyboardSizeDelta`:

```javascript
import { type ImageResizeOptions } from "@mgreminger/quill-image-resize-module/dist/types";

const options: ImageResizeOptions = {
  modules: ["Resize", "DisplaySize"],
  minWidth: 13,
  keyboardSizeDelta: 10
};

const quill = new Quill(editorDiv, {
  // ...
  modules: {
    // ...
    imageResize: options,
  },
});
```

The default configuration options can be seen in this [source file](https://github.com/mgreminger/quill-image-resize-module/blob/master/lib/DefaultOptions.ts). Each module is described below.

#### `Resize` - Resize the image

Adds handles to the image's corners which can be dragged with the mouse to resize the image.

The look and feel can be controlled with options:

```javascript
var quill = new Quill(editorDiv, {
  // ...
  modules: {
    // ...
    imageResize: {
      // ...
      handleStyles: {
        backgroundColor: "black",
        border: "none",
        color: white,
        // other camelCase styles for size display
      },
    },
  },
});
```

#### `DisplaySize` - Display pixel size

Shows the size of the image in pixels near the bottom right of the image.

The look and feel can be controlled with options:

```javascript
var quill = new Quill(editorDiv, {
  // ...
  modules: {
    // ...
    imageResize: {
      // ...
      displayStyles: {
        backgroundColor: "black",
        border: "none",
        color: white,
        // other camelCase styles for size display
      },
    },
  },
});
```

#### `BaseModule` - Include your own custom module

You can write your own module by extending the `BaseModule` class, and then including it in
the module setup.

For example,

```javascript
import { Resize, BaseModule } from "quill-image-resize-module";

class MyModule extends BaseModule {
  // See lib/modules/BaseModule.js for documentation on the various lifecycle callbacks
}

var quill = new Quill(editorDiv, {
  // ...
  modules: {
    // ...
    imageResize: {
      modules: [MyModule, Resize, DisplaySize],
      // ...
    },
  },
});
```
