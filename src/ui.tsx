//@ts-ignore
import * as React from "react";
//@ts-ignore
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
//@ts-ignore
import axios from "../node_modules/axios/index";
//@ts-ignore
import Modal from "react-modal";
//@ts-ignore
import emailjs from "emailjs-com";
//@ts-ignore
import Swal from "sweetalert2";
//@ts-ignore
import { Button } from "antd";
//@ts-ignore
import { useState } from "react";
import { Filters, useFilter } from "./components/useFilter";
import Loading from "./components/Loading/Loading";
const customStyles = {
  content: {
    width: "60%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

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
const rootListRef = ref(storage, "");

const listFiles = () => { };

function App() {
  const { btnOptions, filters, inputOptions, iconOptions } = useSearch();
  const [loadingAnimate, setLoadingAnimate] = useState(false)

  const getFiles = async (listRef, prefix = "") => {
    setLoadingAnimate(true)
    try {
      // const pathReference = ref(storage, "activity.svg");
      let res = await listAll(listRef);
      if (!!res.prefixes.length) {
        let r = res.prefixes.map((e) => {
          let path = prefix + e._location.path;
          return getFiles(e, path);
        });
        return await Promise.all(r);
      }
      let items = await Promise.all(
        res.items
          .flat()
          .filter((e, i) => i < 10)
          .map(async (el) => {
            return {
              url: await getDownloadURL(el),
              name: prefix + "/" + el.name,
            };
          })
      );
      return items;
    } catch (error) {
      console.log({ error });
    }
  };

  const effect = async () => {
    try {
      let items = (await getFiles(rootListRef)).flat(3);
      console.log({ items });
      iconOptions.setIcons({
        fullIcons: items,
        filteredIcons: items,
      });
      setLoadingAnimate(false)
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    effect();
  }, []);

  console.log({ loadingAnimate })
  const onItemPress = async (data, target) => {
    let res = await axios.get(data.url);
    console.log({ res });
    parent.postMessage(
      { pluginMessage: { type: "insert_icon", data: res.data } },
      "*"
    );
  };

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")

  async function SendMessage(e: { preventDefault: () => void }) {
    e.preventDefault();

    if (!(message && email)) return;

    try {
      const data = await emailjs.sendForm(
        "service_w62mxye",
        "template_kca82ts",
        //@ts-ignore
        e.target,
        "MRw0SKfM-RnYWqYjk"
      );
      const status = await data.status;
      if (status === 200) {
        Swal.fire("Succes");
        setMessage("");
        setEmail("");
      }
    } catch (error) {
      Swal.fire("Error");
    }
  }
  const [loading, setLoading] = useState(false);

  const OnButtonClick = () => {
    setLoading(true);
    const timeOutFunc = () => {
      setLoading(false);
    };
    setTimeout(timeOutFunc, 3000);
    clearTimeout(3000);
  };

  const onChangeHandler = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget

    if (name === 'email') setEmail(value)
    if (name === 'message') setMessage(value)
  }

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
          <MoreHorizontal onClick={openModal} style={{ cursor: "pointer" }} />
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <form className="sendMessage" onSubmit={SendMessage}>
              <textarea
                className="textarea"
                placeholder="Enter your comment"
                rows={8}
                cols={50}
                id="message"
                name="message"
                value={message}
                onChange={onChangeHandler}
              />
              <input
                type="email"
                id="email"
                value={email}
                className="input"
                placeholder="Your email"
                name="email"
                onChange={onChangeHandler}
              />
              <div className="btnBox">
                <button className="closeBtn" onClick={closeModal}>
                  Cancel
                </button>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => message && email && OnButtonClick()}
                  loading={loading}
                  className="sendBtn"
                >
                  Send
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
      {
        loadingAnimate ? (
          <Loading />
        ) : (
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
        )
      }
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("react-page"));
