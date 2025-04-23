import { Button, Modal } from "react-bootstrap";

function ConfirmDialogModal({ confirmDialog, setConfirmDialog }) {
  return (
    <Modal
      show={confirmDialog.show}
      onHide={() => setConfirmDialog({ ...confirmDialog, show: false })}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{confirmDialog.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{confirmDialog.message}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setConfirmDialog({ ...confirmDialog, show: false })}
        >
          Cancel
        </Button>
        <Button
          variant={confirmDialog.variant}
          onClick={() => {
            confirmDialog.onConfirm();
            setConfirmDialog({ ...confirmDialog, show: false });
          }}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDialogModal;
