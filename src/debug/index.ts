import pinteg from "../index"

const userSchema = {
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

const mainSchema = {
  param0: { type:"user" },
  param1: { type:"user" },
  param2: { type:"user" },
};


const initialObject0 =
{
  param0: {
    param1: "user A",
    param2: "keyA",
    param3: 1.1,
    param4: 1,
    param5: "keyA_B",
  },
  param1: {
    param1: "user B",
    param2: "keyB",
    param3: 2.2,
    param4: 2,
    param5: "keyB_B",
  },
  param2: {
    param1: "user C",
    param2: "keyC",
    param3: 3.3,
    param4: 3,
    param5: "",
  }
};

//complex object
pinteg
  .setDivId("app0")
  .registerSchema("user", userSchema)
  .setMainSchema(mainSchema)
  .setReadOnly()
  .setViewMultiple()
  .buildForm()
  .writeObject(initialObject0);


const schema = {
  username: { type:"text", caption:"Username:", size: "P" },
  name:     { type:"text", caption:"Name:",     size: "G" },
  email:    { type:"text", caption:"E-mail:",   size: "M" }
};
const initialObject = [
  { username: "username0",  name: "User name 0",  email: "username0@user.com" },
  { username: "username1",  name: "User name 1",  email: "username1@user.com" },
  { username: "username2",  name: "User name 2",  email: "username2@user.com" }
];

//list object
pinteg
  .setDivId("app1")
  .setMainSchema(schema)
  .setReadOnly()
  .setViewMultiple()
  .buildList()
  .writeObject(initialObject);

(window as any).printObj = () => {
  const obj = pinteg.readObject();
  console.log(obj);
}
