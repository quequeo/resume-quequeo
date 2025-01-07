import { Link } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const [resumes, setResumes] = useState([
    { id: 1, title: "Modern Resume", url: "#" },
    { id: 2, title: "Classic Resume", url: "#" },
    { id: 3, title: "Creative Resume", url: "#" },
  ]);

  const [createdResumes, setCreatedResumes] = useState([]);

  return (
    <div className="container text-center mt-5">
      <h1>Welcome to Resume AI</h1>
      <p>Create your professional CV with the power of AI.</p>

      <div className="row mt-4">
        {resumes.map((resume) => (
          <div className="col-md-4 mb-4" key={resume.id}>
            <div className="card p-3">
              <h5 className="card-title">{resume.title}</h5>
              <button className="btn btn-primary">
                <Link to="/create-resume" style={{ color: "#fff" }}>
                  + Create Resume
                </Link>
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2>Your Resumes</h2>
      <ul className="list-group mt-3">
        {createdResumes.map((resume) => (
          <li key={resume.id} className="list-group-item d-flex justify-content-between align-items-center">
            {resume.title}
            <div>
              <button className="btn btn-success">Share</button>
              <button className="btn btn-secondary ms-2">Download</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
