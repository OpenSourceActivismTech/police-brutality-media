import React from "react";
import { FaFacebookSquare, FaTwitterSquare, FaWhatsappSquare } from 'react-icons/fa';

const Share = ({ url }) => (
  <div id="share">
    <div class="social-link">
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">
        <FaFacebookSquare size={32} color={"#3b5998"} />
      </a>
    </div>
    <div class="social-link">
      <a href={`whatsapp://send?text=${encodeURIComponent(url)}`}>
        <FaWhatsappSquare size={32} color={"#25D366"} />
      </a>
    </div>
    <div class="social-link">
      <a href={`http://www.twitter.com/share?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">
        <FaTwitterSquare size={32} color={"#1DA1F2"} />
      </a>
    </div>
  </div>
);

export default Share;
