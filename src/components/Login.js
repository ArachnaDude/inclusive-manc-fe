import { useEffect, useContext, useState } from "react";
import { UserContext } from "../contexts/User.js";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../utils/be-api.js";
import mainLogo from "../img/logo.png";
import {
  FormControl,
  Button,
  InputGroup,
  Card,
  Form,
  ModalTitle,
  Alert,
} from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";

const Login = () => {
  const [newUsername, setNewUsername] = useState("");
  const [userList, setUserList] = useState([]);
  const { setLoggedInUser } = useContext(UserContext);

  useEffect(() => {
    getUsers().then((data) => {
      setUserList(data);
    });
  }, []);

  let navigate = useNavigate();

  const routeChange = (path) => {
    navigate(path);
  };

  const handleUsernameChange = (event) => {
    setNewUsername(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const checkUsername = (userList) => userList.username === newUsername;

    if (userList.some(checkUsername) === true) {
      userList.forEach((eachUser) => {
        if (eachUser.username === newUsername) {
          setLoggedInUser({ username: newUsername });
          localStorage.setItem("username", JSON.stringify(newUsername));
          localStorage.setItem("isLoggedIn", true);
          setNewUsername("");
          routeChange(`/map`);
        }
      });
    } else {
      alert("Username does not exist, please try again");
    }
  };

  return (
    <div className="loginPage">
      <main>
        <center>
          <img
            src={mainLogo}
            alt="Inclusive Manchester"
            width="300"
            height="300"
          ></img>
        </center>
        <Alert variant="info">
          <b>Demo: </b>For demo purposes please log in as <strong>joe</strong>.
          <br />
          <b>NB:</b> If you encounter the error "username does not exist", the
          backend host may have deallocated resources due to inactivity. Wait a
          short time and retry.
        </Alert>
        <Card className="login-card">
          <ModalHeader className="login-header">
            <ModalTitle>
              <h2>LOGIN</h2>
            </ModalTitle>
            <br />
          </ModalHeader>
          <Form className="Login__form" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" id="login-form">
              <InputGroup className="mb-3">
                <Form.Label htmlFor="Login__textbox">
                  Username:
                  <FormControl
                    type="text"
                    aria-describedby="basic-addon2"
                    name="Login__textbox"
                    id="Login__textbox"
                    value={newUsername}
                    onChange={handleUsernameChange}
                    placeholder="Enter Username"
                    required
                  />
                </Form.Label>

                <br></br>
              </InputGroup>
              <Button variant="secondary" type="submit">
                Log in
              </Button>
            </Form.Group>
          </Form>
        </Card>
      </main>
    </div>
  );
};

export default Login;
