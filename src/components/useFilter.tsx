import { useState } from "react";

export type Filters = "outline" | "doutone" | "filled" | "all";

export const useFilter = () => {
  const [filter, setFilter] = useState<Filters>("all");
  return { filter };
};
