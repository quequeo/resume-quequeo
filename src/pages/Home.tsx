import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStyles, fetchResumes, saveResume, deleteResume  } from "../utils/Api";
import { Resume } from "../types/interfaces";
import Spinner from "../components/Spinner";
import API_URL from "../utils/Api";

const Home: React.FC = () => {
  const [styles, setStyles] = useState<string[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [showResumes, setShowResumes] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadStylesAndResumes = async () => {
      try {
        const fetchedStyles = await fetchStyles();
        const fetchedResumes = await fetchResumes();

        if (isMounted) {
          setStyles(fetchedStyles);
          setResumes(fetchedResumes);
          
          if (fetchedResumes.length > 0) {
            setSelectedResume(fetchedResumes[0])
          } else {
            const exampleResume = {
              title: "Example Resume",
              style: fetchedStyles[0],
              personal_information: { content: "Your Name\nYour Address\nYour Phone Number\nYour Email" },
              work_experience: { content: "Your Job Title\nCompany Name\nLocation\nStart Date - End Date\n\nYour Job Description" },
            };
            setSelectedResume(exampleResume);
          }
        }
      } catch (error) {
        console.error("Error loading styles and resumes:", error);
      }
    };

    loadStylesAndResumes();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    if (!selectedResume) return;

    const formattedResume = {
      id: selectedResume.id,
      title: selectedResume.title,
      style: selectedResume.style,
      personal_informations_attributes: [
        {
          id: selectedResume.personal_information?.id,
          content: selectedResume.personal_information?.content || "",
        },
      ],
      work_experiences_attributes: [
        {
          id: selectedResume.work_experience?.id,
          content: selectedResume.work_experience?.content || "",
        },
      ],
    };
  
    try {
      setIsLoading(true);
      const savedResume = await saveResume(formattedResume);

      setTimeout(() => {
        setResumes((prev) => {
          const updatedResumes = prev.some((resume) => resume.id === savedResume.id)
            ? prev.map((resume) => (resume.id === savedResume.id ? savedResume : resume))
            : [...prev, savedResume];
          setSelectedResume(savedResume);
          return updatedResumes;
        });
        setIsLoading(false);
      }, 1200); 
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume. Please try again.");
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteResume(id);

      setResumes((prev) => {
        const updatedResumes = prev.filter((resume) => resume.id !== id);
        setSelectedResume(updatedResumes.length > 0 ? updatedResumes[0] : null);
        return updatedResumes;
      });

      navigate("/");
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete the resume. Please try again.");
    }
  };

  const nextResume = () => {
    if (resumes.length > 0) {
      const nextIndex = (currentIndex + 1) % resumes.length;
      setCurrentIndex(nextIndex);
      setSelectedResume(resumes[nextIndex]);
    }
  };

  const previousResume = () => {
    if (resumes.length > 0) {
      const prevIndex = (currentIndex - 1 + resumes.length) % resumes.length;
      setCurrentIndex(prevIndex);
      setSelectedResume(resumes[prevIndex]);
    }
  };

  const moveLeft = () => {
    setVisibleStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const moveRight = () => {
    setVisibleStartIndex((prev) => Math.min(prev + 1, resumes.length + styles.length - 4));
  };

  const handleImproveContent = async (event) => {
    event.preventDefault();
    if (!selectedResume || !selectedResume.work_experience?.content) return;
  
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: selectedResume.work_experience.content }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch suggestions");
      }
  
      const data = await response.json();
      setSelectedResume((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          work_experience: {
            ...prev.work_experience,
            content: data.suggestions,
          },
          title: prev.title || "",
          style: prev.style || "",
        };
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error");
      console.error("Error improving content:", err.message);
      alert("Failed to improve the content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Your Resumes</h1>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <button
            className="btn btn-link"
            onClick={() => setShowResumes(!showResumes)}
          >
            {showResumes ? "Hide Resumes" : "Show Resumes"}
          </button>

          {showResumes && (
          <div className="d-flex align-items-center mt-4">
            <button
              className="btn btn-secondary me-2"
              onClick={moveLeft}
              disabled={visibleStartIndex === 0}
            >
              &lt;
            </button>
            <div className="row flex-nowrap overflow-hidden" style={{ height: "200px" }}>
            {[...resumes, ...styles.filter((style) => !resumes.some((resume) => resume.style === style))]
              .slice(visibleStartIndex, visibleStartIndex + 4)
              .map((item, index) => (
                <div className="col-md-3 mb-4" key={index}>
                  <div
                    className="card p-3 h-100 d-flex flex-column justify-content-between"
                    style={{ minHeight: "100%" }}
                  >
                    {typeof item === "object" ? (
                      <>
                        <h5 className="card-title text-center">{item.title}</h5>
                        <button
                          className="btn btn-danger align-self-center"
                          onClick={() => handleDelete(item.id!)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <h5 className="card-title text-center d-flex justify-content-center align-items-center">
                          {item.charAt(0).toUpperCase() + item.slice(1)} Style
                        </h5>
                        <button
                          className="btn btn-primary align-self-center"
                          onClick={() => {
                            setSelectedResume({
                              title: "",
                              style: item,
                              personal_information: { content: "" },
                              work_experience: { content: "" },
                            });
                          }
                        }
                        >
                          + Create
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn btn-secondary ms-2"
              onClick={moveRight}
              disabled={visibleStartIndex >= resumes.length + styles.length - 4}
            >
              &gt;
            </button>
          </div>
          )}

          {selectedResume && (
            <div className="mt-5">
              <h2>Resume: {selectedResume.title || "Untitled"}</h2>

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  value={selectedResume.title || ""}
                  onChange={(e) => setSelectedResume({ ...selectedResume, title: e.target.value })}
                />
              </div>

              <div className="form-group mt-3">
                <label htmlFor="personal-info">Personal Information</label>
                <textarea
                  id="personal-info"
                  className="form-control"
                  rows={4}
                  value={selectedResume.personal_information?.content || ""}
                  onChange={(e) => 
                    setSelectedResume({ 
                      ...selectedResume, 
                      personal_information: {
                        ...selectedResume.personal_information, 
                        content: e.target.value,   
                      },
                    })
                  }
                ></textarea>
                <button
                  type="button"
                  className="btn btn-warning mt-2"
                  onClick={handleImproveContent}
                  disabled={isLoading || !selectedResume?.personal_information?.content}
                >
                  Improve Personal Information with AI
                </button>
              </div>

              <div className="form-group mt-3">
                <label htmlFor="experience">Work Experience</label>
                <textarea
                  id="experience"
                  className="form-control"
                  rows={6}
                  value={selectedResume.work_experience?.content || ""}
                  onChange={(e) => 
                    setSelectedResume({ 
                      ...selectedResume, 
                      work_experience: {
                        ...selectedResume.work_experience, 
                        content: e.target.value,   
                      },
                    })
                  }
                ></textarea>
                <button
                  type="button"
                  className="btn btn-warning mt-2"
                  onClick={handleImproveContent}
                  disabled={isLoading || !selectedResume?.work_experience?.content}
                >
                  Improve Work Experience with AI
                </button>
              </div>

              <div className="mt-4">
                <button className="btn btn-secondary me-2" onClick={previousResume}>
                  Previous Resume
                </button>
                <button className="btn btn-secondary me-2" onClick={nextResume}>
                  Next Resume
                </button>
                <button className="btn btn-primary me-2" onClick={handleSave}>
                  Save Resume
                </button>
                {selectedResume.id && (
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleDelete(selectedResume.id!)}
                  >
                    Delete Resume
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
