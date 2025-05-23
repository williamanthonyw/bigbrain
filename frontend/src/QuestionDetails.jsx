import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

function QuestionDetails(props) {
  const token = props.token;
  const [question, setQuestion] = useState(null);
  const { gameId, questionId } = useParams();
  const [questionTitle, setQuestionTitle] = useState("");
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaType, setMediaType] = useState('image');
  const [questionMedia, setQuestionMedia] = useState(null);
  const [questionType, setQuestionType] = useState("");
  const [answers, setAnswers] = useState(['', '']); 
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [questionDuration, setQuestionDuration] = useState(0);
  const [questionPoints, setQuestionPoints] = useState(0);


  const navigate = useNavigate();
  const maxAnswer = 6;

  const goBack = () => {
    if (token){
      navigate(`/game/${gameId}`);
    }
  };

  function isYouTubeUrl(url) {
    return /youtu\.?be/.test(url);
  }

  function getYouTubeEmbedUrl(url) {
    try {
      const yt = new URL(url);
      if (yt.hostname.includes('youtube.com')) {
        return `https://www.youtube.com/embed/${yt.searchParams.get('v')}`;
      } else if (yt.hostname.includes('youtu.be')) {
        return `https://www.youtube.com/embed/${yt.pathname.slice(1)}`;
      }
    } catch (err) {
      console.error(err);
      return '';
    }
  }

  useEffect(() => {
    const fetchQuestion = async () => {
      try{
        const response = await axios.get('http://localhost:5005/admin/games', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        const currentGame = response.data.games.find(g => g.gameId == gameId);
        if (!currentGame) {
          return;
        }

        const findQuestion = currentGame.questions.find(q => q.id == questionId);
        if (!findQuestion){
          return;
        }
        console.log(response);

        setQuestion(findQuestion);
        setQuestionTitle(findQuestion.title || "");
        setQuestionType(findQuestion.type || "single");
        setQuestionMedia(findQuestion.media || null);
        setAnswers(findQuestion.answers || ['', '']); 
        setCorrectAnswers(findQuestion.correctAnswers || []);
        setQuestionDuration(findQuestion.duration || 0);
        setQuestionPoints(findQuestion.points || 0);
      }

      catch (err){
        console.error('Error fetching question', err);
      }
    };
    fetchQuestion();
  }, [gameId, questionId, token]);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  }

  const handleCorrectSelect = (index) => {
    setCorrectAnswers([String(index)]);
  }

  const toggleCorrectAnswer = (index) => {
    setCorrectAnswers((prev) => {
      const strIndex = String(index);
      if (prev.includes(strIndex)) {
        return prev.filter(i => i !== strIndex); // remove it
      } else {
        return [...prev, strIndex]; // add it
      }
    });
  };

  const addAnswerField = () => {
    if (answers.length < 6) {
      setAnswers([...answers, '']);
    }
  }

  const deleteAnswerField = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers.splice(index, 1);
  
    const updatedCorrectAnswers = correctAnswers
      .map(i => Number(i))                 
      .filter(i => i !== index)              
      .map(i => (i > index ? i - 1 : i))     
      .map(i => String(i));                 
  
    setAnswers(updatedAnswers);
    setCorrectAnswers(updatedCorrectAnswers);
  };

  const saveQuestion = async () => {

    if (!questionTitle.trim()) {
      alert('Question title cannot be empty.');
      return;
    }

    if ((questionType === 'single' || questionType === 'multiple')) {
      const emptyAnswerIndex = answers.findIndex(ans => !ans.trim());
      if (emptyAnswerIndex !== -1) {
        alert(`Answer ${emptyAnswerIndex + 1} cannot be empty.`);
        return;
      }
    }

    if (questionType === 'single' && correctAnswers.length !== 1) {
      alert('Please select one correct answer.');
      return;
    }

    if (questionType === 'multiple' && correctAnswers.length < 1) {
      alert('Please select at least one correct answer.');
      return;
    }

    if (questionType === 'judgement' && correctAnswers.length !== 1) {
      alert('Please select one correct answer.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5005/admin/games', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const games = response.data.games;
      const gameIndex = games.findIndex(g => g.gameId == gameId);

      const updatedQuestions = games[gameIndex].questions.map(q => {
        if (q.id == questionId){
          return{
            ...q,
            title: questionTitle,
            media: question.media,
            type: questionType,
            answers: answers,
            correctAnswers: correctAnswers.map(String),
            duration: Number(questionDuration),
            points: Number(questionPoints)
          };
        }
        return q;
      });

      const updatedGames = [...games];
      updatedGames[gameIndex].questions = updatedQuestions;

      await axios.put('http://localhost:5005/admin/games', {
        games: updatedGames
      }, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      navigate(`/game/${gameId}`)
    }

    catch (err){
      console.error('Failed to save question', err);
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // will give you base64 string
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  if (question){
    console.log(question);
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .editor-layout {
              flex-direction: column !important;
              padding: 1rem !important;
            }

            .question-editor {
              padding-right: 0 !important;
            }

            .media-box {
              width: 100% !important;
              height: auto !important;
              aspect-ratio: 4 / 3;
            }

            .sidebar {
              border-left: none !important;
              border-top: 1px solid #444;
              margin-top: 2rem;
            }
          }
        `}
      </style>
      <div style={{ background: "linear-gradient(145deg, #2c2f33, #23272a)", minHeight: "100vh", display: 'flex', flexDirection:'column', position: "relative", color: "white", paddingTop: '80px' }}>
        <div className="d-flex flex-grow-1 mt-5 editor-layout" style={{ padding: '1rem' }}>
          <div className="question-editor" style={{ flex: 4, paddingRight: '1rem'}}>
            {question ? (
              <>
                <Form.Group controlId="questionTitle" className="mb-4">
                  <Form.Control type="text" value={questionTitle} onChange={(e) => setQuestionTitle(e.target.value)} placeholder="Question Title" className="bg-dark text-white border-secondary text-center" 
                    style={{ 
                      fontSize: '2rem',
                      padding: '1rem',
                      height: 'auto',
                      fontWeight: 'bold',
                      lineHeight: '1.3',
                      color: 'white'
                    }}/>
                </Form.Group>
                <div data-testid="media-box" className="mt-4 text-center media-box"
                  style={{ 
                    width: '400px',
                    height: '300px',
                    margin: '0 auto',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => setShowMediaModal(true)}
                  onMouseEnter={(e) => (e.currentTarget.querySelector('.hover-overlay').style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.querySelector('.hover-overlay').style.opacity = 0)}>
                  {question.media ? (
                    isYouTubeUrl(question.media) ? ( 
                      <iframe
                        src={getYouTubeEmbedUrl(question.media)}
                        title="YouTube video"
                        allowFullScreen
                        style={{ width: '100%', height: '100%', border: 'none' }}
                      />

                    ) : (
                      <img
                        src={question.media}
                        alt="Media"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    )
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#23272a',
                      }}
                    >
                      <i className="bi bi-image" style={{ fontSize: '3rem', color: '#666' }}></i>
                    </div>
                  )}
                  <div
                    className="hover-overlay d-flex justify-content-center align-items-center"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease-in-out',
                      zIndex: 2,
                    }}
                  >
                    <i className="bi bi-pencil-fill" style={{ fontSize: '2.5rem', color: '#2f3136' }}></i>
                  </div>
                </div>
                {questionType === 'single' && (
                  <div className="mt-5">
                    <Form.Label className="text-white mb-4">Answer Options</Form.Label>
                    {answers.map((answer, index) => (
                      <div key={index} className="d-flex align-items-center mb-4">
                        <Form.Check type="radio" name="correctAnswer" checked={correctAnswers.includes(String(index))} onChange={() => handleCorrectSelect(index)} className="me-2"/>
                        <Form.Control type="text" value={answer} onChange={(e) => handleAnswerChange(index, e.target.value)} placeholder={`Answer ${index + 1}`} className="bg-dark text-white border-secondary me-2"/>
                        {index >= 2 ? (
                          <i data-testid={`delete-answer-${index}`} className="bi bi-trash text-danger" style={{ cursor: 'pointer', fontSize: '1.3rem' }} onClick={() => deleteAnswerField(String(index))}/>
                        ) : (
                          <i className="bi bi-trash " style={{ opacity: 0, fontSize: '1.3rem', pointerEvents: 'none' }} />
                        )}
                      </div>
                    ))}
                    {answers.length < maxAnswer && (
                      <Button variant="outline-light" onClick={addAnswerField} size="sm" className="mt-2">+ Add Answer</Button>
                    )}
                  </div>
                )}

                {questionType === 'multiple' && (
                  <div className="mt-5">
                    <Form.Label className="text-white mb-4">Answer Options</Form.Label>
                    {answers.map((answer, index) => (
                      <div key={index} className="d-flex align-items-center mb-4">
                        <Form.Check type="checkbox" checked={correctAnswers.includes(String(index))} onChange={() => toggleCorrectAnswer(index)} className="me-2"/>
                        <Form.Control type="text" value={answer} onChange={(e) => handleAnswerChange(index, e.target.value)} placeholder={`Answer ${index + 1}`} className="bg-dark text-white border-secondary me-2"/>
                        {index >= 2 ? (
                          <i data-testid={`delete-answer-${index}`} className="bi bi-trash text-danger" style={{ cursor: 'pointer', fontSize: '1.3rem' }} onClick={() => deleteAnswerField(String(index))}/>
                        ) : (
                          <i className="bi bi-trash " style={{ opacity: 0, fontSize: '1.3rem', pointerEvents: 'none' }} />
                        )}
                      </div>
                    ))}
                    {answers.length < maxAnswer && (
                      <Button variant="outline-light" onClick={addAnswerField} size="sm" className="mt-2">+ Add Answer</Button>
                    )}
                  </div>
                )}

                {questionType === 'judgement' && (
                  <div className="mt-5">
                    <Form.Label className="text-white mb-4">Answer Options</Form.Label>
                    
                    <div className="d-flex align-items-center mb-3">
                      <Form.Check type="radio" name="correctAnswer" checked={correctAnswers.includes('0')} onChange={() => setCorrectAnswers(['0'])} className="me-2"/>
                      <Form.Control type="text" value="True" disabled className="bg-dark text-white border-secondary"/>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <Form.Check type="radio" name="correctAnswer" checked={correctAnswers.includes('1')} onChange={() => setCorrectAnswers(['1'])} className="me-2"/>
                      <Form.Control type="text" value="False" disabled className="bg-dark text-white border-secondary"/>
                    </div>
                    <i className="bi bi-trash " style={{ opacity: 0, fontSize: '1.3rem', pointerEvents: 'none' }} />
                   
                  </div>
                )}

              </>
            ) : (
              <p>Loading question...</p>
            )}
          </div>
          <div className="sidebar" style={{ flex: 1, backgroundColor: '#1e2124', borderLeft: '1px solid #444', padding: '1rem'}}>
            <Form.Group controlId="questionType" className="mb-3">
              <Form.Label className="text-white"><strong>Question type</strong></Form.Label>
              <Form.Select value={questionType} onChange={(e) => {
                const type = e.target.value;
                setQuestionType(type);
                if (type === 'judgement'){
                  setAnswers(['True', 'False']);
                  setCorrectAnswers([]);
                }
                else{
                  setAnswers(['', '']);
                  setCorrectAnswers([]);
                }
              }} 
              className="bg-dark text-white border-secondary">
                <option value="single">Single Choice</option>
                <option value="multiple">Multiple Choice</option>
                <option value="judgement">Judgement</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="questionDuration" className="mb-3">
              <Form.Label className="text-white"><strong>Duration</strong></Form.Label>
              <Form.Control type="number" min="0" value={questionDuration} onChange={(e) => setQuestionDuration(e.target.value)} className="bg-dark text-white border-secondary"></Form.Control>
            </Form.Group>
            <Form.Group controlId="questionPoints" className="mb-3">
              <Form.Label className="text-white"><strong>Points</strong></Form.Label>
              <Form.Control type="number" min="0" value={questionPoints} onChange={(e) => setQuestionPoints(e.target.value)} className="bg-dark text-white border-secondary"/>
            </Form.Group>
            <Button variant="success" className="mt-3 w-100" onClick={saveQuestion}>Save</Button>
            <Button variant="danger" className="mt-3 w-100" onClick={goBack}>Cancel</Button>
          </div>
        </div>
      </div>

      <Modal show={showMediaModal} onHide={() => setShowMediaModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Media</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Media type</Form.Label>
            <Form.Select data-testid="media-type-select" value={mediaType} onChange={(e) => {
              setMediaType(e.target.value);
              setQuestionMedia(null);
            }}>
              <option value='image'>Image</option>
              <option value='youtube'>Youtube link</option>
            </Form.Select>
          </Form.Group>

          {mediaType === 'image' && (
            <Form.Group>
              <Form.Label>Select image</Form.Label>
              <Form.Control type='file' accept="image/*" onChange={(e) => setQuestionMedia(e.target.files[0])}/>
            </Form.Group>
          )}
          
          {mediaType === 'youtube' && (
            <Form.Group>
              <Form.Label>Youtube link</Form.Label>
              <Form.Control type="text" placeholder="enter link to youtube video" value={questionMedia || ''} onChange={(e) => setQuestionMedia(e.target.value)}/>
            </Form.Group>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMediaModal(false)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={async () => {
              let mediaUrl = question.media;

              if (mediaType === 'image' && questionMedia instanceof File) {
                mediaUrl = await fileToBase64(questionMedia); 
              } else if (mediaType === 'youtube') {
                mediaUrl = questionMedia; 
              }
          
              setQuestion(prev => ({...prev, media: mediaUrl}));
              setQuestionMedia(null);
              setShowMediaModal(false);
            }}

            disabled={
              (mediaType === 'image' && !questionMedia) ||
              (mediaType === 'youtube' && !questionMedia?.startsWith('http'))
            }
          >
            Upload
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};
export default QuestionDetails;