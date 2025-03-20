import { SerializedStyles } from "@emotion/react";

export type ListingCardProps = {
  customStyles?: SerializedStyles;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  cardRedirectionLink?: string;
};

export type SendRequestFunction = (
  handleResponse?: (response: Response) => void,
  handleError?: (error: Error) => void,
  requestOptions?: RequestInit | undefined,
  urlParameters?: string
) => Promise<void>;
