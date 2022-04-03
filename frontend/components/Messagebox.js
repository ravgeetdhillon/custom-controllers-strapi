import { useState } from "react";

const formatDate = (value) => {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleTimeString();
};

function Messagebox({ message, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [messageText, setMessageText] = useState(message.attributes.content);

  const handleOnEdit = async (e) => {
    e.preventDefault();
    await onEdit({ id: message.id, message: messageText });
    setIsEditing(false);
  };

  const handleOnDelete = async (e) => {
    e.preventDefault();
    await onDelete({ id: message.id });
  };

  return (
    <div className="d-flex justify-content-between align-items-baseline mb-3 w-100 border px-3 py-2">
      <div className="d-flex align-items-baseline me-3">
        <p
          className="mb-0 text-muted small me-3"
          title={`Last updated on ${formatDate(message.attributes.updatedAt)}`}
        >
          {formatDate(message.attributes.createdAt)}
        </p>
        <b className="text-primary small me-2">{message.attributes.postedBy}</b>
        <p
          className="mb-0 me-2"
          contentEditable
          onFocus={() => setIsEditing(true)}
          onInput={(e) => setMessageText(e.target.innerText)}
        >
          {message.attributes.content}
        </p>
      </div>
      <div className="d-flex align-items-center small">
        {message.attributes.timesUpdated > 0 && (
          <p className="mb-0 text-muted small me-3">
            Edited{" "}
            {new Intl.PluralRules("ar-EG").select(
              message.attributes.timesUpdated
            )}{" "}
            times
          </p>
        )}
        {isEditing && (
          <>
            <button
              className="btn btn-sm btn-transparent text-success p-0 me-3"
              onClick={handleOnEdit}
            >
              Save
            </button>
            <button
              className="btn btn-sm btn-transparent text-muted p-0 me-3"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </>
        )}
        <button
          className="btn btn-sm btn-transparent text-danger p-0"
          onClick={handleOnDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Messagebox;
