import React from "react";
import { Link } from "gatsby";
import GlobalWrapper from "./GlobalLayout";
import { rhythm, scale } from "../utils/typography";

const PostLayout = ({ children, next, previous, location }) => {
  return (
    <GlobalWrapper>
      <h1>
        <Link to={"/"}>
          Police Brutality
        </Link>
      </h1>
      <h2>
        {`in ${location}`}
      </h2>
        {children} 
    </GlobalWrapper>
  );
};

export default PostLayout;
