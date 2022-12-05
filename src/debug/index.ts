import pinteg from "../index"

const configuration = {
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
    param3: { type:"double", caption:"Sample with integer:", size: "P" },
  };

const initialObject = {
    param1: "string value",
    param2: "keyB",
    param3: 9.9,
  };


pinteg
  .setDivId("app")
  .setConfiguration(configuration)
  .buildScreen()
  .writeObject(initialObject);

const finalObject = pinteg.readObject();
console.log(finalObject);
