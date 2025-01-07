import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateResume = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState({});
  const navigate = useNavigate();

  const handleSave = () => {
    const newResume = { id: Date.now(), title, content };
    const resumes = JSON.parse(localStorage.getItem("resumes") || "[]");
    resumes.push(newResume);
    localStorage.setItem("resumes", JSON.stringify(resumes));

    navigate("/");
  };

  return (
    <div className="container mt-5">
      <h1>Create Your Resume</h1>
      <div className="form-group">
        <label htmlFor="title">Resume Title</label>
        <input
          type="text"
          className="form-control"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your resume"
        />
      </div>

      <div className="form-group mt-3">
        <label htmlFor="content">Resume Content</label>
        <textarea
          className="form-control"
          id="content"
          rows={8}
          value={content.body || ""}
          onChange={(e) => setContent({ ...content, body: e.target.value })}
          placeholder="Add your resume details"
        ></textarea>
      </div>

      <button className="btn btn-primary mt-3" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default CreateResume;
