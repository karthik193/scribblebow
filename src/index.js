import React, { useState, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import { AuthProvider } from './Auth';
import ScribblePlayer from './AudioUI/ScribblePlayer';
import PrivateRoute from './PrivateRoute';

import db from "./database/db";






const messaging = db.messaging();
messaging.requestPermission().then(function(){
  console.log("Recieved Permission");
  return messaging.getToken();
})
.then(function(token){
  console.log("token "+token);
})
.catch(function(err){
  console.log("Denied Permission")
});

messaging.onMessage(function(payload){
  console.log("onMessage: "+payload);
});



function App(){
  const [play, setPlay] = useState(false);
  const [data,setData] = useState();
  const [id,setId] = useState();
  const [liked,setLiked] = useState(false);
  const [added,setAdded] = useState(false);

  function checkLikeAdd(id){
    db.firestore().collection("likes").doc(id).get().then(snapshot => {
      const lst = snapshot.data().usernames;
      setLiked(lst.includes(localStorage.getItem("username")));
     
      db.firestore().collection("myshelf").doc(localStorage.getItem("username")).get().then(snapshot2 =>{
        const lst2 = snapshot2.data().audio;
        setAdded(lst2.includes(id));
        setPlay(true);
      });
    });

  }

 
   //sets audio player
  function setPlayAudio(data, Id){
    if(!localStorage.getItem("username") ){
      return <Redirect to={"/Log0"} />;
  }
    if(play){
      setPlay(false);
    }
    setData(data);
    setId(Id);
    setTimeout(()=>{checkLikeAdd(Id)},200)
    
  }

  const Home = lazy(() => import('./home/home'));
  const Login = lazy(() => import('./login/Login'));
  const Signup  = lazy(() => import('./login/Signup'));
  const Test  = lazy(() => import('./login/Test'));
  const ReadStory  = lazy(() => import('./Read/Story/Story'));  
  const Profile  = lazy(() => import('./Read/Profile/Profile'));
  const Pref0  = lazy(() => import('./login/Pref0'));
  const Pref1  = lazy(() => import( './login/Pref1'));
  const Log0  = lazy(() => import( './login/Log0'));
  const WriteTheStory  = lazy(() => import( './Write/Story/Main'));
  const Create  = lazy(() => import( './Write/create')); 
  const Unverif  = lazy(() => import( './login/Unverif'));
  const Discover  = lazy(() => import( './discover/Discover'));
  const Reports = lazy(() => import( './Write/Report/Reports'));
  const StorySeries = lazy(() => import( './Write/Story/StorySeries'));
  const Myshelf = lazy(() => import( './MyShelf/Myshelf'));
  const WriteQuote = lazy(() => import( './Write/Quote/Main'));
  const  Recorder  = lazy(() => import( './AudioUI/Recorder'));
  const ReadQuote = lazy(() => import( './Read/Quote/Main'));




  
  return <div>
  <AuthProvider>
  <Router>
  <Suspense fallback={<div class="myclass">
	<img src="./myimage.png" alt="logo" style={{height: "80px",width: "auto"}}></img>
	<p align="center">Loading...</p>
      </div>}>
    <Switch>
      <Route exact path="/" render={(props) => <Home setPlayAudio={setPlayAudio} {...props} />  }
      />
      <Route exact path="/home" render={(props) => <Home setPlayAudio={setPlayAudio} {...props} />  }
      />
      <Route exact path="/login" component={Login}
      />
      <Route exact path="/signup" component={Signup}
      />
      <Route exact path="/Report" component={Reports}
      />
       
       <PrivateRoute exact path="/ReadStory" component={ReadStory}  />
       <Route exact path="/ReadAudio"  render={(props) => <ReadQuote setPlayAudio={setPlayAudio} {...props  }/>}  />
       <Route exact path="/Profile"  render={(props) => <Profile setPlayAudio={setPlayAudio} {...props  }/>}  />
       <Route exact path="/StorySeries"  render={(props) => <StorySeries  {...props} />}  />
      <Route exact path="/Create" render={(props) => <Create setPlayAudio={setPlayAudio} {...props} />  } ></Route>
      <Route  exact path= "/WriteQuote"  render={(props) => <WriteQuote {...props} />  } ></Route>
      <Route exact path="/WriteStory"  render={(props) => <WriteTheStory {...props}/>}  />
      <Route exact path="/ReadQuote"  render={(props) => <ReadQuote {...props}/> }/>
      <Route exact path="/discover" render={(props) => <Discover setPlayAudio={setPlayAudio} {...props} />  } />
     
      <Route exact path="/test" component={Test}
      />
      <PrivateRoute exact path="/unverif" component={Unverif}
      />
      <Route exact path="/my-shelf" render={(props) => <Myshelf setPlayAudio={setPlayAudio} {...props} />  }
      />
      <PrivateRoute exact path="/recorder" component={Recorder}
      />
      <Route exact path="/Pref0" component={Pref0}
      />
      <Route exact path="/Pref1" component={Pref1}
      />
      <Route exact path="/Log0" component={Log0}
      />
      <Route exact path="/testnow" component={Test}
      />

    </Switch>
   
    </Suspense>
   
  </Router>
  </AuthProvider>
  {play===true?<ScribblePlayer 
  play={setPlay} 
  id={id} 
  setLiked={setLiked} 
  setAdded={setAdded} 
  added={added} 
  liked={liked} 
  data={data}/>:null}
  </div>
}



ReactDOM.render(
  <div>
  <App />
  </div>

  ,
  document.getElementById('root')
);


