import { css } from "styled-components";

export const full = (position = "relative") => css`
  position: ${position};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;
export const flexCenter = () => css`
  display: flex;
  justify-content: center;
  align-items: center;
`;
