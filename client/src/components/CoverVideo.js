import React from "react";
import GIF from "../assets/video.gif";
import styled from "styled-components";

const VideoContainer = styled.div`
  width: 100%;
  video {
    width: 100%;
    height: 100%;
    border-radius: 4rem;
  }
`;

const CoverVideo = () => {
  return (
    <VideoContainer>
      <img src={GIF} alt='video/gif' />
    </VideoContainer>
  );
};
export default CoverVideo;
