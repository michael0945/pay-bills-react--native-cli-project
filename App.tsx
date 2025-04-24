import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import AppNavigator from "./src/navigation";
// import OTP from "./src/screens/OTP";


const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
      {/* <OTP /> */}
    </Provider>
  );
};

export default App;
