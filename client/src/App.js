import React, { useEffect, createContext, useReducer, useContext } from "react";

import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";

import TopBarProgress from "react-topbar-progress-indicator";
import lazyLoading from "./components/common/LazyLoading";

import { NavBar } from "./components";

import { userReducer, initialState } from "./reducers/userReducer";

import "./App.css";

export const UserContext = createContext();

const Profile = lazyLoading(() => import("./components/Profile/Profile"), {
  fallback: <TopBarProgress />,
});

const Home = lazyLoading(() => import("./components/Home/Home"), {
  fallback: <TopBarProgress />,
});

const CreatePost = lazyLoading(
  () => import("./components/CreatePost/CreatePost"),
  {
    fallback: <TopBarProgress />,
  }
);

const UserProfile = lazyLoading(
  () => import("./components/Profile/UserProfile"),
  {
    fallback: <TopBarProgress />,
  }
);

const Signup = lazyLoading(() => import("./components/Auth/Signup"), {
  fallback: <TopBarProgress />,
});

const Signin = lazyLoading(() => import("./components/Auth/Signin"), {
  fallback: <TopBarProgress />,
});

const Routing = () => {
  const history = useHistory();

  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/signin");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/" component={Home}>
        <Home />
      </Route>

      <Route path="/signin" component={Signin}>
        <Signin />
      </Route>

      <Route path="/signup" component={Signup}>
        <Signup />
      </Route>

      <Route exact path="/profile" component={Profile}>
        <Profile />
      </Route>

      <Route path="/createpost" component={CreatePost}>
        <CreatePost />
      </Route>

      <Route path="/profile/:userId" component={UserProfile}>
        <UserProfile />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
