import * as React from "react";

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
  const [icons, setIcons] =
    React.useState<IconsType<Icon<string>>>(initialIcons);
  const [filters, setFilters] = React.useState<FilterTypes>(initialFilters);

  React.useEffect(() => {
    let filteredItems = [];
    let currentFilter = filters.find((e) => e.className === "active").tag;
    if (!!currentFilter) {
      filteredItems = icons.fullIcons.filter((e) =>
        e.name.includes(currentFilter)
      );
    } else {
      filteredItems = icons.fullIcons;
    }
    
    if (!!searchInput) {
      filteredItems = filteredItems.filter((e) => isHas(e.name, searchInput));
    }
    setIcons({ ...icons, filteredIcons: filteredItems });
  }, [filters, searchInput]);

  const isHas = (iconName: string, searchingName: string) => {
    iconName = iconName.replace(/.svg/gi, "").toUpperCase();
    searchingName = searchingName.toUpperCase();

    return iconName.includes(searchingName);
  };

  const onChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearchInput(value);
    setIcons((prevIcons) => ({
      ...prevIcons,
      filteredIcons: prevIcons.fullIcons.filter((icon) =>
        isHas(icon.name, value)
      ),
    }));
  };

  const onClearInput = () => {
    setSearchInput("");
    setIcons((icons) => ({ ...icons, filteredIcons: icons.fullIcons }));
  };

  const btnOptions = {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      const btnName = event.currentTarget.innerText;
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
      onChangeInput,
      onClearInput,
    },
    iconOptions: {
      icons,
      setIcons,
    },
    filters,
    btnOptions,
  };
};
