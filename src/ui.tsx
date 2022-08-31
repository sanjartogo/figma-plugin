//@ts-ignore
import * as React from "react";
//@ts-ignore
import * as ReactDOM from "react-dom";
import "./ui.css";
//@ts-ignore
import { MoreHorizontal, Search, X } from "react-feather";
// useSearch hook
import { useSearch } from "./components/useSearch";
//@ts-ignore
import Modal from "react-modal";
//@ts-ignore
import { Button } from "antd";
//@ts-ignore
import InfiniteScroll from "react-infinite-scroll-component";
import IconBtn from "./components/Icon";
import Loading from "./components/Loading/Loading";
import { useModal } from "./components/useModal";

const customStyles = {
  content: {
    width: "60%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: "7px",
    transform: "translate(-50%, -50%)",
  },
};

export const baseUrl = "https://figma-plugin.herokuapp.com";

const listFiles = () => {};

// let url = "http://localhost:3001";
let url = "https://figma-plugin.herokuapp.com";

function App() {
  const {
    btnOptions,
    filters,
    inputOptions,
    count,
    icons,
    sendEmail,
    email,
    message,
    OnButtonClick,
    onChangeHandler,
    throttledFetch,
    loading,
    onItemPress,
    inputRef,
  } = useSearch();
  const { closeModal, modalIsOpen, openModal, afterOpenModal } = useModal();

  return (
    <div className="container">
      <div className="navbarInput">
        <Search className="searchIcon" />
        <input
          type="text"
          className="searchInput"
          placeholder={`Search ${count} icons`}
          onChange={inputOptions.onChangeInput}
          ref={inputRef}
        />
        {!!inputOptions.searchInput && (
          <div className="searchCloseIcon">
            <X
              width={"17px"}
              height={"17px"}
              onClick={inputOptions.onClearInput}
            />
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
            <form className="sendMessage" onSubmit={sendEmail}>
              <textarea
                className="textarea"
                placeholder="Send us your feedback to improve"
                rows={5}
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
                  Submit
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
      {/* {loadingAnimate ? (
        <Loading />
      ) : (
        <div className="iconsBox">
          {icons.map((e, i) => {
            return (
              <IconBtn
                key={i.toString()}
                name={e.name}
                index={i}
                url={`http://localhost:3001/static/${e.path}`}
                onItemPress={() => onItemPress(e)}
              />
            );
          })}
        </div>
      )}
      <div ref={loader}></div> */}
      <InfiniteScroll
        hasMore={true}
        dataLength={icons.icons.length}
        loader={<Loading />}
        next={throttledFetch}
        scrollThreshold={1}
      >
        <div className="iconsBox">
          {icons.icons.map((e, i) => {
            return (
              <IconBtn
                key={i.toString()}
                name={e.name}
                index={i}
                url={`${baseUrl}/static/${e.path}`}
                onItemPress={() => onItemPress(e)}
              />
            );
          })}
        </div>
        {loading && <Loading />}
      </InfiniteScroll>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("react-page"));
