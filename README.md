# Quill ImageResize Module

A module for Quill rich text editor to allow images to be resized.

A fork of [kensnyder/quill-image-resize-module](https://github.com/kensnyder/quill-image-resize-module) with the following changes:

- Updated to work with Quill 2
- Modernized toolchain using vite and TypeScript
- Toolbar buttons removed since allignment settings were not preserved in the document Delta
- The presence of resize handles no longer impacts underlying selection range so keyboard actions such as copy to clipboard and type to replace still work as expected
- Keyboard shortcuts added to increase image size (+ key) and decrease image size (- key)
- Resize handles now appear when image is selected with the keyboard (using shift with the arrow keys)
- Works with touch events in addition to mouse events

## Demo

[Preview Site](https://mgreminger.github.io/quill-image-resize-module/)

## Usage

### Webpack/ES6

```javascript
import Quill from "quill";
import { ImageResize } from "quill-image-resize-module";

Quill.register("modules/imageResize", ImageResize);

const quill = new Quill(editor, {
  // ...
  modules: {
    // ...
    imageResize: {
      // See optional "config" below
    },
  },
});
```

### Script Tag

Copy image-resize.min.js into your web root or include from node_modules

```html
<script src="/node_modules/quill-image-resize-module/image-resize.min.js"></script>
```

```javascript
var quill = new Quill(editor, {
  // ...
  modules: {
    // ...
    ImageResize: {
      // See optional "config" below
    },
  },
});
```

### Config

For the default experience, pass an empty object, like so:

```javascript
var quill = new Quill(editor, {
  // ...
  modules: {
    // ...
    ImageResize: {},
  },
});
```

Functionality is broken down into modules, which can be mixed and matched as you like. For example,
the default is to include all modules:

```javascript
const quill = new Quill(editor, {
  // ...
  modules: {
    // ...
    ImageResize: {
      modules: ["Resize", "DisplaySize"],
    },
  },
});
```

Each module is described below.

#### `Resize` - Resize the image

Adds handles to the image's corners which can be dragged with the mouse to resize the image.

The look and feel can be controlled with options:

```javascript
var quill = new Quill(editor, {
  // ...
  modules: {
    // ...
    ImageResize: {
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
var quill = new Quill(editor, {
  // ...
  modules: {
    // ...
    ImageResize: {
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
  // See src/modules/BaseModule.js for documentation on the various lifecycle callbacks
}

var quill = new Quill(editor, {
  // ...
  modules: {
    // ...
    ImageResize: {
      modules: [MyModule, Resize],
      // ...
    },
  },
});
```
