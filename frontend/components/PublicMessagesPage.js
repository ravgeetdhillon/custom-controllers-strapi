import React, { useState, useEffect } from "react";
import Messagebox from "./Messagebox";
import { MessagesAPIService } from "../services/MessagesApi";
import { useInterval } from "../utils/hooks";

function PublicMessagesPage() {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const messages = await MessagesAPIService.find();
    setMessages(messages);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useInterval(() => {
    fetchMessages();
  }, 10000);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please add your username");
      return;
    }

    if (!message) {
      alert("Please add a message");
      return;
    }

    await MessagesAPIService.create({
      data: {
        postedBy: user,
        content: message,
      },
    });

    await fetchMessages();
    setMessage("");
  };

  const handleEditMessage = async ({ id, message }) => {
    if (!message) {
      alert("Please add a message");
      return;
    }

    await MessagesAPIService.update({
      id: id,
      data: {
        content: message,
      },
    });

    await fetchMessages();
  };

  const handleDeleteMessage = async ({ id }) => {
    if (confirm("Are you sure you want to delete this message?")) {
      await MessagesAPIService.delete({ id });
      await fetchMessages();
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-12 mb-4 border-bottom px-0">
          <h1 className="mb-1">Random Talk</h1>
          <p className="text-muted">Post your random thoughts that vanish</p>
        </div>

        <div className="col-lg-12 mb-4 px-0">
          <form onSubmit={(e) => handleSendMessage(e)}>
            <input
              type="text"
              className="form-control form-control-sm rounded-0 border-light"
              placeholder="Set your username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
            <div className="d-flex align-items-center overflow-hidden">
              <input
                type="text"
                className="form-control rounded-0 border-light"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <button
                className="btn btn-primary rounded-0"
                onClick={(e) => handleSendMessage(e)}
              >
                Send
              </button>
            </div>
          </form>
        </div>

        <div className="col-lg-12 px-0">
          {messages.map((message) => (
            <Messagebox
              key={message.attributes.uid}
              message={message}
              onEdit={handleEditMessage}
              onDelete={handleDeleteMessage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PublicMessagesPage;
