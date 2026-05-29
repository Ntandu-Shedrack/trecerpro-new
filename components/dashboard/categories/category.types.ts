export type Category = {
  id: string;
  name: string;
  description?: string;
  assetCount: number;
  attributes: {
    name: string;
    type: "text" | "number" | "date";
  }[];
};
