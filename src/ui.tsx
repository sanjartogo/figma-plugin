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

// useSearch hook
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

declare function require(path: string): any;

function App() {
  const {
    btnOptions,
    filters,
    inputOptions,
    iconOptions
    } = useSearch();

  const getFiles = async () => {
    try {
      // const pathReference = ref(storage, "activity.svg");
      let res = await listAll(listRef);
      let items = await Promise.all(
        res.items.flat().map(async (el) => {
          return {
            url: await getDownloadURL(el),
            name: el.name,
          };
        })
      );
      console.log(res);
      iconOptions.setIcons({
        fullIcons: items,
        filteredIcons: items,
      });
    } catch (error) {
      console.log({ error });
    }
  };

  React.useEffect(() => {
    getFiles();
  }, []);

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

  return (
    <div className="container">
      <div className="navbarInput">
        <Search className="searchIcon" />
        <input
          type="text"
          className="searchInput"
          placeholder="Search"
          value={inputOptions.searchInput}
          onChange={inputOptions.onChangeInput}
        />
        {!!inputOptions.searchInput && (
          <div className="searchCloseIcon">
            <X onClick={inputOptions.onClearInput} />
          </div>
        )}
      </div>
      <div className="navbar">
        <div className="menuItems">
          {filters.map((item) => {
            return (
              <button
                {...btnOptions}
                className={`menuItem ${item.className}`}
                key={item.id}
              >
                {item.name}
              </button>
            );
          })}
        </div>
        <div className="feedbackIcon">
          <MoreHorizontal />
        </div>
      </div>
      <div className="iconsBox">
        {iconOptions.icons.filteredIcons.map((e, i) => {
          return (
            <img
              onClick={(target) => onItemPress(e, target)}
              key={i}
              src={e.url}
              className="icons"
            />
          );
        })}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("react-page"));
