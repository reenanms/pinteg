import ScreenBuilder from "../builder/ScreenBuilder"

let configuration = {
    param1: { type:"string", caption:"Param 1:", size: "P" },
  };

new ScreenBuilder(configuration, "app")
  .build();
