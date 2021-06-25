import init from "../rete/editor";
import gridimg from "../grid.png";

import { usePubSub } from "./PubSub";

import { useContext, createContext, useState } from "react";

const Context = createContext({
  run: () => {},
  editor: {},
  serialize: () => {},
  buildEditor: () => {},
  setEditor: () => {},
  getNodeMap: () => {},
  getNodes: () => {},
});

export const useRete = () => useContext(Context);

const ReteProvider = ({ children }) => {
  const [editor, setEditor] = useState();
  const pubSub = usePubSub();

  const buildEditor = async (el) => {
    if (editor) return;

    const newEditor = await init(el, pubSub);
    setEditor(newEditor);
  };

  const run = () => {
    console.log("RUN");
  };

  const serialize = () => {
    console.log(JSON.stringify(editor.toJSON()));
  };

  const getNodeMap = () => {
    return editor.components;
  };

  const getNodes = () => {
    return Object.fromEntries(editor.components);
  };

  const publicInterface = {
    run,
    serialize,
    editor,
    buildEditor,
    getNodeMap,
    getNodes,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export const Editor = ({ children }) => {
  const { buildEditor } = useRete();

  return (
    <>
      <div
        style={{
          textAlign: "left",
          width: "100vw",
          height: "100vh",
          position: "absolute",
          backgroundImage: `url('${gridimg}')`,
        }}
      >
        <div
          ref={(el) => {
            if (el) buildEditor(el);
          }}
        />
      </div>
      {children}
    </>
  );
};

export default ReteProvider;