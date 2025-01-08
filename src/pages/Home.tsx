import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStyles, fetchResumes, deleteResume } from "../utils/Api";

interface Resume {
  id: number;
  title: string;
  style: string;
}

const Home = () => {
  const [styles, setStyles] = useState<string[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    const loadStyles = async () => {
      try {
        const data = await fetchStyles();
        setStyles(data);
      } catch (error) {
        console.error("Error fetching styles:", error);
      }
    };

    const loadResumes = async () => {
      try {
        const data = await fetchResumes();
        setResumes(data);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };

    loadStyles();
    loadResumes();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((resume) => resume.id !== id));
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete the resume. Please try again.");
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1>Welcome to Resume AI</h1>
      <p>Create your professional CV with the power of AI.</p>

      <div className="row mt-4">
        {styles.map((style, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card p-3">
              <h5 className="card-title">{style.charAt(0).toUpperCase() + style.slice(1)} Resume</h5>
              <button className="btn btn-primary">
                <Link
                  to={`/create-resume?style=${style}`}
                  style={{ color: "#fff" }}
                >
                  + Create Resume
                </Link>
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2>Your Resumes</h2>
      <ul className="list-group mt-3">
        {resumes.map((resume) => (
          <li key={resume.id} className="list-group-item d-flex justify-content-between align-items-center">
            {resume.title} ({resume.style})
            <div>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(resume.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
