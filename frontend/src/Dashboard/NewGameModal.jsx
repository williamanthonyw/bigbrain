import {
  Modal,
  Form,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
} from "react-bootstrap";

function NewGameModal({
  show,
  onHide,
  onExited,
  onSubmit,
  setNewThumbnail,
  validated,
  newTitle,
  setNewTitle,
}) {
  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setNewThumbnail(reader.result); // base64 string as thumbnail
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal show={show} onHide={onHide} onExited={onExited} centered>
      <Form noValidate validated={validated} onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Create new game ✏️</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <FormLabel>Name</FormLabel>
            <FormControl
              required
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter a name for your game."
            />
            <div className="invalid-feedback">Please choose a name.</div>
          </FormGroup>
          <FormGroup>
            <FormLabel>Thumbnail (optional)</FormLabel>
            <FormControl
              type="file"
              accept="image/*"
              onChange={handleThumbnailFileChange}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="success" type="submit">
            Create
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default NewGameModal;
