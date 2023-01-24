import "./App.css";
import React from "react";
import sha256 from "crypto-js/sha256";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "80%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "1px 2px #888888",
  },
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [friendList, setFriendList] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pageInput, setPageInput] = React.useState(1);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [friendDetail, setFriendDetail] = React.useState({});

  function openModal(data: Object) {
    setFriendDetail(data);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setFriendDetail({});
  }

  const getAddress = (data: Object) => {
    const address = [
      data.street.number,
      data.street.name,
      `${data.postcode} ${data.city}`,
      data.state,
      data.country,
    ].join(", ");
    return address;
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    await fetch("https://randomuser.me/api/?seed=lll")
      .then((res) => res.json())
      .then((data) => {
        // couldn't match
        // if(sha256(e.target.password.value).toString() === data.results[0].login.password)
        setIsAuthenticated(true);
      })
      .catch((error) => console.error(error));
  };

  const getFriendList = async (targetPage: number = 1) => {
    await fetch(
      `https://randomuser.me/api/?seed=lll&page=${targetPage}&results=25`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.info?.page > 20) {
          setPageInput(page);
          return alert("This page does not exist");
        }
        setFriendList(data.results?.length ? data.results : []);
        setPage(data.info?.page);
        setPageInput(data.info?.page);
      })
      .catch((error) => console.error(error));
  };

  const handlePreviousPage = () => {
    getFriendList(page - 1);
  };

  const handleNextPage = () => {
    getFriendList(page + 1);
  };

  const handleSetPage = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    getFriendList(e.target.page.value);
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      getFriendList();
    }
  }, [isAuthenticated]);

  return (
    <div className="App">
      <div className="page">
        {isAuthenticated ? (
          <>
            <div className="navButtonContainer">
              <button disabled={page === 1} onClick={handlePreviousPage}>
                Prev
              </button>
              <button onClick={handleNextPage}>Next</button>
              <form onSubmit={handleSetPage} className="pageForm">
                <input
                  type="number"
                  id="page"
                  name="page"
                  value={pageInput}
                  onChange={(e) => setPageInput(parseInt(e.target.value))}
                />
                <input type="submit" value="go" />
              </form>
            </div>
            <div className="friendList">
              {friendList.map((friend, i) => (
                <div
                  className="friendCard"
                  key={i}
                  onClick={() => openModal(friend)}
                >
                  <img src={friend.picture.thumbnail} />
                  <label>First Name: {friend.name.first}</label>
                  <label>Last Name: {friend.name.last}</label>
                  <label>Email: {friend.email}</label>
                  <label>Phone Number: {friend.phone}</label>
                </div>
              ))}
            </div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div>
                <button onClick={closeModal} className="modalButton">
                  X
                </button>
                <div className="friendDetail">
                  {Object.keys(friendDetail).length > 0 && (
                    <>
                      <img
                        src={friendDetail?.picture.large}
                        width="200"
                        height="200"
                      />
                      <label>First Name: {friendDetail?.name.first}</label>
                      <label>Last Name: {friendDetail?.name.last}</label>
                      <label>Email: {friendDetail?.email}</label>
                      <label>
                        D.O.B: {new Date(friendDetail?.dob.date).toDateString()}
                      </label>
                      <label>
                        Address: {getAddress(friendDetail.location)}
                      </label>
                      <label>Phone Number: {friendDetail?.phone}</label>
                    </>
                  )}
                </div>
              </div>
            </Modal>
          </>
        ) : (
          <form onSubmit={handleLogin} className="loginForm">
            <label>Username:</label>
            <br />
            <input type="text" id="username" name="username" required />
            <br />
            <label>Password:</label>
            <br />
            <input type="password" id="password" name="password" required />
            <br />
            <input type="submit" value="Login" />
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
