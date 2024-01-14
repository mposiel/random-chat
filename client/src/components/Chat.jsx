import "./styles/Chat.css";
import Icon from "@mdi/react";
import { mdiSendVariantOutline, mdiStopCircleOutline } from "@mdi/js";
import { mdiAccount } from "@mdi/js";

export const Chat = () => {
  return (
    <>
      <div className="content">
        <div className="container">
          <div className="chat-window">
            <h1>Chat</h1>
          </div>

          <div className="controls">
            <div className="input">
              <input type="text" placeholder="Type a message..." />
            </div>
            <div className="send-btn">
              <Icon path={mdiSendVariantOutline} size={1} />
            </div>
            <div className="end-btn">
              <Icon path={mdiStopCircleOutline} size={1} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
