import React from "react";
import { Link } from "gatsby";

import { rhythm } from "../utils/typography";

const PostLayout = ({ children, next, previous, location }) => {
  return (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`
      }}
    >
      <h1>
        <Link to={"/"}>
          Police Brutality
        </Link>
      </h1>
      <h2>
        {`in ${location}`}
      </h2>
      {children} 
    </div>
  );
};

export default PostLayout;
