import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ui.css";
//@ts-ignore
import { initializeApp } from "firebase/app";
//@ts-ignore
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
//@ts-ignore
import { Search } from "react-feather";
import { isAbsolute } from "path/posix";
//@ts-ignore
import { MoreHorizontal } from "react-feather";
//@ts-ignore
import { X } from "react-feather";
import { useSearch } from "./components/useSearch";

const firebaseConfig = {
  apiKey: "AIzaSyD4Cn954HI8TQgvLAG7ldIhbYK5xE8arZ4",
  authDomain: "icons-e8482.firebaseapp.com",
  projectId: "icons-e8482",
  storageBucket: "icons-e8482.appspot.com",
  messagingSenderId: "1029364126769",
  appId: "1:1029364126769:web:76a0e851b46047c2c37110",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseApp = app;
const storage = getStorage(firebaseApp, "gs://icons-e8482.appspot.com");
const listRef = ref(storage, "");
const list = document.querySelector("#icons");

declare function require(path: string): any;

function App() {
  const inputRef = React.useRef<HTMLInputElement>(null);
    // useSearch hook
    const {setIcons, icons, searchInput, onChangeInput, onClearInput} = useSearch()

  const [files, setFiles] = React.useState([]);

  const getFiles = async () => {
    try {
      // const pathReference = ref(storage, "activity.svg");
      let res = await listAll(listRef);
      let items = await Promise.all(
        res.items.flat().map(async (el) => {
          return await getDownloadURL(el);
        })
      );
      console.log(res);
      setFiles(items);
      setIcons(items)
    } catch (error) {
      console.log({ error });
    }
  };

  React.useEffect(() => {
    getFiles();
  }, []);

  const onCreate = () => {
    const count = Number(inputRef.current?.value || 0);
    parent.postMessage(
      { pluginMessage: { type: "create-rectangles", count } },
      "*"
    );
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  console.log("DS");

  const onItemPress = async (data, target) => {
    console.log({ target });
    console.log({ t: target.target.innerHTML });
    console.log({ d: target.target.textContent });
    let res = await fetch(data, { mode: "no-cors" });
    console.log({ res: await res.text() });
    //@ts-ignore
    // console.log({ res: res.body.text() });
    console.log({ res: res });

    parent.postMessage({ pluginMessage: { type: "insert_icon", data } }, "*");
  };

  const Items = [
    {
      id: 1,
      name: "All",
    },
    {
      id: 1,
      name: "Outline",
    },
    {
      id: 1,
      name: "Doutone",
    },
    {
      id: 1,
      name: "Filled",
    },
  ];

  console.log(JSON.stringify(Items, null, 4))
  console.log("icons:", JSON.stringify(files, null, 4))

  const [searchValue, setSearchValue] = React.useState("");
  return (
    <div className="container">
      <div className="navbarInput">
        <Search className="searchIcon" />
        <input
          type="text"
          className="searchInput"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {!!searchValue && (
          <div className="searchCloseIcon">
            <X onClick={() => setSearchValue("salom")} />
          </div>
        )}
      </div>
      <div className="navbar">
        <div className="menuItems">
          {Items.map((item) => {
            return (
              <div className="menuItem" key={item.id}>
                {item.name}
              </div>
            );
          })}
        </div>
        <div className="feedbackIcon">
          <MoreHorizontal />
        </div>
      </div>
      <div className="iconsBox">
        {files.map((e, i) => {
          return (
            <img
              onClick={(target) => onItemPress(e, target)}
              key={i}
              src={e}
              className="icons"
            />
          );
        })}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("react-page"));
