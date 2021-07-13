// ----------- react -----------
import { useContext, useEffect } from 'react';

// ----- import landingpage -----
import LandingPage from "./components/pages/LandingPage";
import FeedPage from "./components/pages/FeedPage";
import ExplorePage from "./components/pages/ExplorePage";
import ProfilePeopleFeed from './components/pages/ProfilePeopleFeed';
import ProfilePeopleExplore from './components/pages/ProfilePeopleExplore';
import CreatePostPage from './components/pages/CreatePostPage';
import MessagePage from './components/pages/MessagePage';
import ChatPage from './components/pages/ChatPage';
import EditProfilePage from './components/pages/EditProfilePage';
import Notifikasi from './components/organisms/Notifikasi';

// --------- component ----------
import { UserContext } from "./components/contexts/UserContext"
import { API, setAuthToken } from './components/config/api';

// ---- rounter -----
import { Switch, Route, useHistory } from "react-router-dom";

// init token pada axios setiap kali aplikasi direfresh
if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {

  const router = useHistory();
  const [state, dispatch] = useContext(UserContext);

  // ketika reload jika masih login
  useEffect(() => {
    if (state.isLogin == false) {
      router.push('/auth')
    } else {
      router.push('/')
    }
  }, [state])

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth')

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR"
        })
      }

      let payload = response.data.data.user
      payload.token = localStorage.token

      dispatch({
        type: "USER_SUCCESS",
        payload
      })


    } catch (error) {
      console.log(error)
    }
  }

  // loading data

  useEffect(() => {
    checkUser()
  }, [])


  return (
    <div className="App">
      <Switch>
        {/* landing page */}
        <Route path="/auth" exact component={LandingPage} />
        <Route exact path="/" component={FeedPage} />
        <Route path="/ExplorePage" component={ExplorePage} />
        <Route path="/ProfilePeopleFeed/:ProfilePeopleFeedId" component={ProfilePeopleFeed} />
        <Route path="/ProfilePeopleExplore/:ProfilePeopleExploreId" component={ProfilePeopleExplore} />
        <Route path="/CreatePostPage" component={CreatePostPage} />
        <Route path="/MessagePage" component={MessagePage} />
        <Route path="/ChatPage/:chat" component={ChatPage} />
        <Route path="/EditProfilePage" component={EditProfilePage} />
        <Route path="/Notifikasi" component={Notifikasi} />
      </Switch>
    </div>
  );
}

export default App;
