export type Availability =
  | "available"
  | "downloadable"
  | "downloading"
  | "unavailable";

export type PortfolioTab = {
  id: string;
  label: string;
  prompt: string;
};
