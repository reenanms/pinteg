import pinteg from "../index"

const configuration = {
    param1: { type:"text", caption:"Sample with text:", size: "P" },
    param2: {
      type:"list",
      caption:"Sample with list:",
      size: "P",
      options: [
          { key: "keyA", caption: "caption A" },
          { key: "keyB", caption: "caption B" },
          { key: "keyC", caption: "caption C" }
        ]
      },
    param3: { type:"double", caption:"Sample with double:", size: "P" },
    param4: { type:"integer", caption:"Sample with integer:", size: "P" },
    param5: {
      type:"list",
      caption:"Sample with list:",
      size: "P",
      parent: "param2",
      options: [
          { key: "keyA_A", caption: "caption A.A", filter: "keyA" },
          { key: "keyA_B", caption: "caption A.B", filter: "keyA" },
          { key: "keyB_A", caption: "caption B.A", filter: "keyB" },
          { key: "keyB_B", caption: "caption B.B", filter: "keyB" }
        ]
    },
  };

const initialObject = {
    param1: "keyB",
    param2: "keyB",
    param3: 9.9,
    param4: 9,
    param5: "keyB_A",
  };


pinteg
  .setDivId("app")
  .setConfiguration(configuration)
  .buildScreen()
  .writeObject(initialObject);

const finalObject = pinteg.readObject();
console.log(finalObject);
