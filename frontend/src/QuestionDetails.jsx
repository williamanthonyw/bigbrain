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

  const navigate = useNavigate();

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

        const currentGame = response.data.games.find(g => g.id == gameId);
        if (!currentGame) {
          return;
        }

        const findQuestion = currentGame.questions.find(q => q.id == questionId);
        if (!findQuestion){
          return;
        }

        setQuestion(findQuestion);
        setQuestionTitle(findQuestion.title || "");
      }

      catch (err){
        console.error('Error fetching question', err);
      }
    };
    fetchQuestion();
  }, [gameId, questionId, token]);

  if (question){
    console.log(question);
  }

  return (
    <>
      <div style={{ background: "linear-gradient(145deg, #2c2f33, #23272a)", minHeight: "100vh", display: 'flex', flexDirection:'column', position: "relative", color: "white", paddingTop: '80px' }}>
        <Button variant='danger' onClick={props.logout} style={{ position: "absolute", top: "20px", right: "20px" }}>Logout</Button>
        <Button variant='light' onClick={goBack} style={{ position: "absolute", top: "20px", left: "20px" }}> ← Back</Button>
        <div className="d-flex flex-grow-1 mt-5" style={{ padding: '1rem' }}>
          <div style={{ flex: 4, paddingRight: '1rem'}}>
            left container
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
                <div className="mt-4 text-center"
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
              </>
            ) : (
              <p>Loading question...</p>
            )}
          </div>
          <div style={{ flex: 1, backgroundColor: '#1e2124', borderLeft: '1px solid #444', padding: '1rem'}}>
            right container
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
            <Form.Select value={mediaType} onChange={(e) => {
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
            onClick={() => {
              const mediaURL = mediaType === 'image'
                ? URL.createObjectURL(questionMedia)
                : questionMedia

              setQuestion(prev => ({ ...prev, media: mediaURL}));
              setShowMediaModal(false);
              console.log('Saved media:', questionMedia);
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