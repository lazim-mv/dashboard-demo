// components/ChatMessages.js

import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import { Card, Input, Button, Row, Col } from "antd";
import { useState } from "react";

const ChatMessages = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Est, eget est quis ornare vulputate placerat. Odio nunc vitae, vel scelerisque tortor vitae egestas. Donec lobortis mattis pellentesque nisl nibh eu.",
      time: "10:45",
      date: "Friday",
      isSent: true,
    },
    {
      id: 2,
      text: "Vestibulum viverra lacus, congue scelerisque neque. Viverr cursus nisi, in purus dolor at. Nec sed eget scelerisque imperdiet consectetur. Pellentesque aliquam id posuere massa",
      time: "11:04",
      date: "Today",
      isSent: false,
    },
    {
      id: 3,
      text: "Vestibulum viverra lacus, congue scelerisque neque. Viverr cursus nisi, in purus dolor at. Nec sed eget scelerisque imperdiet consectetur. Pellentesque aliquam id posuere massa",
      time: "11:04",
      date: "Today",
      isSent: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          time: "11:05",
          date: "Today",
          isSent: true,
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <BorderContainer>
      <FormTitle title="Messages" />
      <div style={{ padding: "24px 20px" }}>
        {messages.map((message, index) => (
          <div key={message.id} style={{ marginBottom: "15px" }}>
            {(index === 0 || messages[index - 1].date !== message.date) && (
              <div
                style={{
                  textAlign: "center",
                  color: "#888",
                  fontSize: "14px",
                  marginBottom: "10px",
                }}
              >
                {message.date}
              </div>
            )}
            <Card
              style={{
                maxWidth: "70%",
                marginLeft: message.isSent ? "auto" : "0",
                backgroundColor: message.isSent ? "#f0f0f0" : "#e6f7ff",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* {message.isSent && (
                <MdCheckBoxOutlineBlank
                  style={{ color: "green", marginRight: "8px" }}
                />
              )} */}
              <div>
                <p
                  style={{
                    marginBottom: "0",
                    color: "#333",
                  }}
                >
                  {message.text}
                </p>
                <small style={{ color: "#888" }}>{message.time}</small>
              </div>
            </Card>
          </div>
        ))}

        <Row style={{ marginTop: "60px" }}>
          <Col span={22}>
            <Input
              placeholder="Message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={handleSendMessage}
              size="large"
              style={{
                width: "100%",
                borderTopRightRadius: "0",
                borderBottomRightRadius: "0",
              }}
            />
          </Col>
          <Col span={2}>
            <Button
              style={{
                width: "100%",
                borderTopLeftRadius: "0",
                borderBottomLeftRadius: "0",
              }}
              size="large"
              type="primary"
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Col>
        </Row>
      </div>
    </BorderContainer>
  );
};

export default ChatMessages;
