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
    param3: { type:"double", caption:"Sample with double:", size: "M" },
    param4: { type:"integer", caption:"Sample with integer:", size: "G" },
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

const initialObjectA = {
    param1: "keyB",
    param2: "keyB",
    param3: 9.9,
    param4: 9,
    param5: "keyB_A",
  };


  //appA
pinteg
  .setDivId("appA")
  .setConfiguration(configuration)
  .buildScreen()
  .writeObject(initialObjectA);



const initialObjectB = {
    param1: "keyB",
    param2: "keyB",
    param3: 9.9,
    param4: 9,
    param5: "keyB_A",
  };

//appB
pinteg
  .setDivId("appB")
  .setConfiguration(configuration)
  .buildScreen()
  .writeObject(initialObjectB);


const finalObject = pinteg.readObject();
console.log(finalObject);
