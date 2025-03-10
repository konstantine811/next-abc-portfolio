import { BlockObjectChild } from "@/@types/schema.notion";
import { VideoBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  items: VideoBlockObjectResponse & BlockObjectChild;
}

const NotionVideo = ({ items }: Props) => {
  let externalUrl;
  if (items.video.type === "external") {
    const url = items.video.external.url;
    const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
    if (!isYouTube) {
      externalUrl = url;
    } else {
      const videoId = url.split("v=")[1] || url.split("/").pop()?.split("?")[0];
      externalUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  }
  return (
    <>
      {externalUrl && (
        <iframe
          className="w-full h-96"
          src={externalUrl}
          title={items.video.caption.map((i) => i.plain_text).join(" ")}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </>
  );
};

export default NotionVideo;
