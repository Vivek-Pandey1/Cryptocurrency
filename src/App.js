import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import Home from "./components/pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import NotFound from "./components/pages/NotFound";


function App(props) {
  return (
    <Router>
      <div className="App">
         <Switch>
          <Route exact path="/" component={Home} />
          
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
