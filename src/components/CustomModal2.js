import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
// import ModalHeader from "react-bootstrap/ModalHeader";
// import ModalTitle from "react-bootstrap/ModalTitle";
// import ModalBody from "react-bootstrap/ModalBody";
// import ModalFooter from "react-bootstrap/ModalFooter";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import "../css/CustomModal.css";
import moment from "moment";
import {
  getVenueInfoById,
  patchAccessRatingById,
  patchEqualityRatingById,
  patchAttitudeRatingById,
  postCommentToVenueById,
} from "../utils/be-api.js";
import LoadingSpin from "./LoadingSpin.js";
import ConfirmButton from "./ConfirmButton.js";
import ExpandableButton from "./ExpandableButton.js";

function CustomModal({ show, onHide, id }) {
  // console.log("id passed to modal", id);
  // setup states for dialogue box
  const [venueItems, setVenueItems] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [update, setUpdate] = useState(false);

  // expandable button state
  const [isOpen, setIsOpen] = useState(false);

  // confirm button state
  const [confirmCount, setConfirmCount] = useState({});

  // user context
  const username = JSON.parse(localStorage.getItem("username"));

  // set state for radio buttons
  const [accessState, setAccessState] = useState(null);
  const [equalityState, setEqualityState] = useState(null);
  const [attitudeState, setAttitudeState] = useState(null);

  const setId = (id) => {
    const splitId = id.split("/");
    return splitId[1];
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleAccessRadioSelect = (event) => {
    setAccessState(event.target.value);
  };
  const handleEqualityRadioSelect = (event) => {
    setEqualityState(event.target.value);
  };
  const handleAttitudeRadioSelect = (event) => {
    setAttitudeState(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const accessRating = { accessibility_ratings: accessState };
    const equalityRating = { equality_ratings: equalityState };
    const attitudeRating = { attitude_ratings: attitudeState };
    const commentForSubmit = {
      author: username,
      body: newComment,
      total_confirmed_votes: 0,
    };

    patchAccessRatingById(setId(id), accessRating).then(() => {
      patchEqualityRatingById(setId(id), equalityRating).then(() => {
        patchAttitudeRatingById(setId(id), attitudeRating).then(() => {
          postCommentToVenueById(setId(id), commentForSubmit).then(() => {
            setAccessState(null);
            setEqualityState(null);
            setAttitudeState(null);
            setNewComment("");
            setUpdate((currVal) => !currVal);
          });
        });
      });
    });

    setIsOpen(false);
  };

  useEffect(() => {
    if (update) {
      setUpdate((currVal) => !currVal);
    }
    getVenueInfoById(setId(id)).then((res) => {
      setVenueItems(res);
      setIsLoading(false);
    });
  }, [id, update]);

  function average(val, arr) {
    let total = 0;
    let count = 0;

    if (!Array.isArray(val)) {
      arr.push(+val);

      arr.forEach(function (item, index) {
        total += item;
        count++;
      });
    } else {
      val.forEach(function (item, index) {
        total += item;
        count++;
      });
    }

    let final = Math.round(total / count);

    if (final === 5) {
      return "⭐️⭐️⭐️⭐️⭐️";
    } else if (final === 4) {
      return "⭐️⭐️⭐️⭐️★";
    } else if (final === 3) {
      return "⭐️⭐️⭐️★★";
    } else if (final === 2) {
      return "⭐️⭐️★★★";
    } else if (final === 1) {
      return "⭐️★★★★";
    } else if (final === 0) {
      return "★★★★★";
    }
  }

  return isLoading ? (
    <LoadingSpin />
  ) : (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      centered
      keyboard={false}
      size="lg"
    >
      <Modal.Header className="modalHeader" closeButton>
        <Modal.Title>
          <h2>{venueItems.name}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody">
        <h4>At a glance:</h4>
        <center>
          {venueItems.accessibility_ratings.length > 0 ? (
            <ListGroup>
              <ListGroup.Item variant="dark">
                <strong>Average General Accessibility rating: </strong>
                <br></br>
                {average(venueItems.accessibility_ratings)}
              </ListGroup.Item>
              <br></br>
              <ListGroup.Item variant="dark">
                <strong>Average Equality rating: </strong>
                <br></br>
                {average(venueItems.equality_ratings)}
              </ListGroup.Item>
              <br></br>
              <ListGroup.Item variant="dark">
                <strong>Average Attitude rating: </strong>
                <br></br>
                {average(venueItems.attitude_ratings)}
              </ListGroup.Item>
            </ListGroup>
          ) : (
            <p>
              <strong>
                There are no ratings to show you yet, be the first by reviewing
                this venue below.
              </strong>
            </p>
          )}
        </center>
        <hr></hr>
        <h4>Comments about {venueItems.name || "this location"}:</h4>
        {venueItems.comments.length > 0 ? (
          <ListGroup>
            {venueItems.comments.map((comments) => {
              // console.log("comments", comments);
              return (
                <>
                  {/* <ListGroup> */}
                  <ListGroup.Item variant="dark" key={comments._id}>
                    <strong>Author: </strong>
                    {comments.author}
                    <br></br>
                    <strong>Posted: </strong>
                    {moment(comments.commentDate).format("MMM Do YYYY")}
                    <br></br>
                    <strong>Comment confirmed: </strong>
                    {comments.total_confirmed_votes +
                      (confirmCount[comments._id]
                        ? confirmCount[comments._id]
                        : 0)}{" "}
                    times
                    <hr />
                    {comments.body}
                    <br></br>
                    <br></br>
                    <ConfirmButton
                      setConfirmCount={setConfirmCount}
                      total_confirmed_votes={comments.total_confirmed_votes}
                      id={comments._id}
                    />
                  </ListGroup.Item>
                  {/* </ListGroup> */}
                  <br />
                </>
              );
            })}
          </ListGroup>
        ) : (
          <center>
            <p>
              <strong>
                There are no comments here yet, be the first by adding your
                comments below.
              </strong>
            </p>
          </center>
        )}
        <hr></hr>
        <p>
          <b>
            Please add to our information for{" "}
            {venueItems.name || "this location"}:{" "}
          </b>
        </p>
        <ExpandableButton isOpen={isOpen} setIsOpen={setIsOpen}>
          <div onSubmit={handleSubmit}>
            <Form>
              <br />
              <ListGroup>
                <ListGroup.Item variant="dark" key="access">
                  <p>
                    <strong>How accessible is this location?</strong>
                    <br />
                    Does this location have accessible facilites? e.g. flat
                    entrances and disabled bathrooms?
                    <br />
                    Is there furniture suitable to meet specific individual
                    need? <br />
                    Is there adequate space between furniture? I.e. are there
                    suitable turning circles?
                  </p>
                  <p>Please give a rating for general accessibility</p>
                  <label htmlFor="accessRadioButton1">
                    <Form.Check
                      type="radio"
                      id="accessRadioButton1"
                      name="accessRating"
                      value={1}
                      onChange={handleAccessRadioSelect}
                      label={`Very Poor`}
                    />
                  </label>
                  <br />
                  <label htmlFor="accessRadioButton2">
                    <Form.Check
                      type="radio"
                      id="accessRadioButton2"
                      name="accessRating"
                      value={2}
                      onChange={handleAccessRadioSelect}
                      label={`Poor`}
                    />
                  </label>
                  <br />
                  <label htmlFor="accessRadioButton3">
                    <Form.Check
                      type="radio"
                      id="accessRadioButton3"
                      name="accessRating"
                      value={3}
                      onChange={handleAccessRadioSelect}
                      label={`Average`}
                    />
                  </label>
                  <br />
                  <label htmlFor="accessRadioButton4">
                    <Form.Check
                      type="radio"
                      id="accessRadioButton4"
                      name="accessRating"
                      value={4}
                      onChange={handleAccessRadioSelect}
                      label={`Good`}
                    />
                  </label>
                  <br />
                  <label htmlFor="accessRadioButton5">
                    <Form.Check
                      type="radio"
                      id="accessRadioButton5"
                      name="accessRating"
                      value={5}
                      onChange={handleAccessRadioSelect}
                      label={`Very Good`}
                    />
                  </label>
                  <br />
                </ListGroup.Item>
              </ListGroup>
              <hr />
              <ListGroup>
                <ListGroup.Item variant="dark" key="equal">
                  <p>
                    <strong>
                      How equal were you made to feel at this location?
                    </strong>
                    <br />
                    Are disabled facilities at this location utilised
                    inappropiately? I.e toilets/changing places being used as
                    storage.
                    <br />
                    Are reasonable adjustments made to individual need?
                    <br />
                    Are there alternative forms of communication available at
                    this location? E.g. BSL/ Braille/ hearing loops etc.
                  </p>
                  <div>
                    <p>Please give a rating for equality:</p>
                    <label htmlFor="equalityRadioButton1">
                      <Form.Check
                        type="radio"
                        id="equalityRadioButton1"
                        name="equalityRating"
                        value={1}
                        onChange={handleEqualityRadioSelect}
                        label={`Very Poor`}
                      />
                    </label>
                    <br />
                    <label htmlFor="equalityRadioButton2">
                      <Form.Check
                        type="radio"
                        id="equalityRadioButton2"
                        name="equalityRating"
                        value={2}
                        onChange={handleEqualityRadioSelect}
                        label={`Poor`}
                      />
                    </label>
                    <br />
                    <label htmlFor="equalityRadioButton3">
                      <Form.Check
                        type="radio"
                        id="equalityRadioButton3"
                        name="equalityRating"
                        value={3}
                        onChange={handleEqualityRadioSelect}
                        label={`Average`}
                      />
                    </label>
                    <br />
                    <label htmlFor="equalityRadioButton4">
                      <Form.Check
                        type="radio"
                        id="equalityRadioButton4"
                        name="equalityRating"
                        value={4}
                        onChange={handleEqualityRadioSelect}
                        label={`Good`}
                      />
                    </label>
                    <br />
                    <label htmlFor="equalityRadioButton5">
                      <Form.Check
                        type="radio"
                        id="equalityRadioButton5"
                        name="equalityRating"
                        value={5}
                        onChange={handleEqualityRadioSelect}
                        label={`Very Good`}
                      />
                    </label>
                  </div>
                </ListGroup.Item>
              </ListGroup>

              <hr />
              <ListGroup>
                <ListGroup.Item variant="dark" key="attitude">
                  <p>
                    <strong>
                      What was the attitude of the staff/clientele at this
                      location?
                    </strong>
                    <br />
                    Did this location provide an inclusive atmosphere? I.e. did
                    staff and clientele make you feel welcome?
                    <br />
                    Did everbody at this location treat you respectfully? E.g.
                    addressing you rather than your carer?
                    <br />
                    Did you feel that staff had appropriate Equality and
                    Diversity traning?
                  </p>
                  <div>
                    <p>Please give a rating for attitudes:</p>
                    <label htmlFor="attitudeRadioButton1">
                      <Form.Check
                        type="radio"
                        id="attitudeRadioButton1"
                        name="attitudeRating"
                        value={1}
                        onChange={handleAttitudeRadioSelect}
                        label={`Very Poor`}
                      />
                    </label>
                    <br />
                    <label htmlFor="attitudeRadioButton2">
                      <Form.Check
                        type="radio"
                        id="attitudeRadioButton2"
                        name="attitudeRating"
                        value={2}
                        onChange={handleAttitudeRadioSelect}
                        label={`Poor`}
                      />
                    </label>
                    <br />
                    <label htmlFor="attitudeRadioButton3">
                      <Form.Check
                        type="radio"
                        id="attitudeRadioButton3"
                        name="attitudeRating"
                        value={3}
                        onChange={handleAttitudeRadioSelect}
                        label={`Average`}
                      />
                    </label>
                    <br />
                    <label htmlFor="attitudeRadioButton4">
                      <Form.Check
                        type="radio"
                        id="attitudeRadioButton4"
                        name="attitudeRating"
                        value={4}
                        onChange={handleAttitudeRadioSelect}
                        label={`Good`}
                      />
                    </label>
                    <br />
                    <label htmlFor="attitudeRadioButton5">
                      <Form.Check
                        type="radio"
                        id="attitudeRadioButton5"
                        name="attitudeRating"
                        value={5}
                        onChange={handleAttitudeRadioSelect}
                        label={`Very Good`}
                      />
                    </label>
                  </div>
                  <br />
                </ListGroup.Item>
              </ListGroup>
              <br />
              <strong>Add your comments</strong>
              <p>Please expand on your experiences here:</p>
              <label htmlFor="commentBox"></label>
              <Form.Control
                size="lg"
                type="text"
                id="commentBox"
                name="commentBox"
                value={newComment}
                onChange={handleCommentChange}
                placeholder="Type your comment here..."
                required
              />
              <br />
              <Button variant="secondary" type="submit">
                Submit Comment
              </Button>
            </Form>
          </div>
        </ExpandableButton>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;
