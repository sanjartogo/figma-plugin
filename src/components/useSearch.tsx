import * as React from "react";
//@ts-ignore
import Swal from "sweetalert2";
//@ts-ignore
import axios from "axios";
//@ts-ignore
import emailjs from "emailjs-com";
//@ts-ignore
import Swal from "sweetalert2";
//@ts-ignore
import _ from "lodash";

let baseUrl = "https://figma-plugin.herokuapp.com";

// types
interface Icon<T> {
  url: T;
  name: T;
  path: T;
}
interface IconsType<T> {
  fullIcons: T[];
  filteredIcons: T[];
}

interface FilterType<V, T> {
  id: V;
  name: T;
  className: T;
  tag: T;
}

type FilterTypes = FilterType<number, string>[];

// -----------
// initial values
const initialIcons = {
  fullIcons: [],
  filteredIcons: [],
};

const initialFilters = [
  {
    id: 0,
    name: "Outline",
    className: "active",
    tag: "outline",
  },
  {
    id: 1,
    name: "Doutone",
    className: "",
    tag: "bulk",
  },
  {
    id: 2,
    name: "Filled",
    className: "",
    tag: "solid",
  },
  {
    id: 3,
    name: "All",
    className: "",
    tag: "",
  },
];

export const useSearch = () => {
  const [searchInput, setSearchInput] = React.useState<string>("");
  const [filters, setFilters] = React.useState<FilterTypes>(initialFilters);
  const [page, setPage] = React.useState(0);

  const [count, setCount] = React.useState(0);

  const [loading, setLoading] = React.useState(false);

  const [icons, setIcons] = React.useState({ icons: [], count: 0 });

  React.useEffect(() => {
    let activeFilter = filters.find((e) => e.className === "active") || "";
    console.log({ activeFilter }, '82');

    //@ts-ignore
    if (!searchInput && !activeFilter.tag) {
      setPage(0);
      setIcons({ icons: [], count: 0 });
      throttledFetch();
      return;
    }
    if (!!activeFilter) {
      setPage(0);
      setIcons({ icons: [], count: 0 });
      throttledFetch();
    console.log("SEARCHING FILES", '94');

    }
  }, [filters]);

  React.useEffect(() => {
    (async function () {
      try {
        const res = await axios.get(baseUrl);
        const count = res.data.count;
        setIcons((icons) => ({ ...icons, count }));
        setCount(count);
          setLoading(true)
      } catch (error) {}
    })();
  }, []);

  const inputRef = React.useRef(null);

  const fetchFiles = async () => {
    setLoading(true);
    console.log("FETCHING FILES", '112');

    let activeFilter = filters.find((e) => e.className === "active");
    try {
      let items = await axios.get(
        `${baseUrl}?page=${page}&pageSize=51&filter=${activeFilter.tag}&search=${searchInput}`
      );
      setLoading(true)
      setTimeout(() => {
        setIcons((e) => ({ ...e, icons: [...e.icons, ...items.data.icons] }));
        setPage((e) => e + 1);
      }, 800);
    } catch (error) {}
    setLoading(false);
  };

  const searchFiles = async () => {
    if (!!searchInput) {
      setPage(0);
      throttledFetch();
    }
  };

  React.useEffect(() => {
    if (!searchInput) {
      console.log("Clearing search");
      throttledFetch();
      return;
    }
    searchFiles();
  }, [searchInput]);

  const throttledFetch = _.throttle(fetchFiles, 1000);

  React.useEffect(() => {
    const navbar = document.querySelector(
      ".header_modal--headerModalTitleWithoutOverflow--1rTCG .header_modal--headerModalTitle--8hnpX"
    ) as HTMLDivElement;

    throttledFetch();

    if (navbar) {
      navbar.style.backgroundColor = "#444";
    }
  }, []);

  const onItemPress = async (data) => {
    let res = await axios.get(`${baseUrl}/static/${data.path}`);
    parent.postMessage(
      {
        pluginMessage: { type: "insert_icon", data: res.data, name: data.name },
      },
      "*"
    );
  };

  const [message, setMessage] = React.useState("");
  const [email, setEmail] = React.useState("");

  async function sendEmail(e: { preventDefault: () => void }) {
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

  const OnButtonClick = () => {
    setLoading(true);
    const timeOutFunc = () => {
      setLoading(false);
    };
    setTimeout(timeOutFunc, 3000);
    clearTimeout(3000);
  };

  const onChangeHandler = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;

    if (name === "email") setEmail(value);
    if (name === "message") setMessage(value);
  };

  const onChangeInput = (value) => {
    //@ts-ignore
    setSearchInput(value);
  };

  let debouncedSearchChange = _.debounce(onChangeInput, 800);
  let memoizedDebouncedSearchChange = React.useCallback(
    (e) => debouncedSearchChange(e),
    []
  );
  const onSearch = (e) => {
    //@ts-ignore
    const value = e.target.value;
    if (!value) {
      setSearchInput("");
      setPage(0);
      setIcons({ count: 0, icons: [] });
      return;
    }
    if (!!page || !!icons.icons.length) {
      setPage(0);
      setIcons({ count: 0, icons: [] });
    }

    memoizedDebouncedSearchChange(value);
  };

  const onClearInput = () => {
    setSearchInput("");
    inputRef.current.value=""
  };

  const btnOptions = {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      const btnName = event.currentTarget.innerText;
      setPage(0);
      setFilters((filters) =>
        filters.map((filter) => ({
          ...filter,
          className: filter.name === btnName ? "active" : "",
        }))
      );
    },
  };

  return {
    inputOptions: {
      searchInput,
      onChangeInput: onSearch,
      onClearInput,
    },
    filters,
    btnOptions,
    page,
    count,
    icons,
    sendEmail,
    message,
    email,
    throttledFetch,
    OnButtonClick,
    onChangeHandler,
    onItemPress,
    loading,
    inputRef,
  };
};
