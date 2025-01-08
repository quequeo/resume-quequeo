import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveResume } from "../utils/Api";

const CreateResume = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [style, setStyle] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const styleParam = queryParams.get("style");
    if (styleParam) {
      setStyle(styleParam);
    }
  }, [location.search]);

  const handleSave = async () => {
    try {
      await saveResume({ title, content, style });
      navigate("/");
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Create Your Resume</h1>
      <p>Style: {style}</p>
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
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
