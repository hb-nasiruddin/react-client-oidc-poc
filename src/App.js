import * as React from "react";
import * as ReactDOM from "react-dom";

import { AuthProvider, useAuth } from "react-oidc-context";

const oidcConfig = {
  authority: "",
  client_id: "",
  client_secret: "",
  redirect_uri: "http://localhost:3000",
};

function App() {
  const auth = useAuth();

  // const [data, setData] = React.useState({
  //   username: '',
  //   password: ''
  // })

  React.useEffect(() => {
    // the `return` is important - addAccessTokenExpiring() returns a cleanup function
    return auth.events.addAccessTokenExpiring(() => {
      if (alert("You're about to be signed out due to inactivity. Press continue to stay signed in.")) {
        auth.signinSilent();
      }
    })
  }, [auth.events, auth.signinSilent]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        Hello {auth.user?.profile.sub}{" "}
        <button onClick={() => void auth.signoutPopup()}>
          Log out
        </button>
      </div>
    );
  }

  return <>
    {/* <input type="text" name="username" id="username" onChange={({ target: { value = '' } }) => setData({ ...data, username: value })} />
    <input type="text" name="password" id="password" onChange={({ target: { value = '' } }) => setData({ ...data, password: value })} /> */}
    <button onClick={() => void auth.signinRedirect()}>Log in</button>;
  </>
}

export const AppWrapper = () => (
  <AuthProvider {...oidcConfig}>
    <App />
  </AuthProvider>
)

export default App