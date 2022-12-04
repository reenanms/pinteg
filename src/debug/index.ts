import ScreenBuilder from "../builder/ScreenBuilder"

let configuration = {
    param1: { type:"string", caption:"Sample with string:", size: "P" },
    param2: {
      type:"list",
      caption:"Sample with list:",
      size: "P",
      options: [
          { key: "keyA", caption: "caption A" },
          { key: "keyB", caption: "caption B" }
        ]
      },
  };

new ScreenBuilder(configuration, "app")
  .build();
