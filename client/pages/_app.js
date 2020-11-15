import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/build-client";

const AppComponent =  ({Component, pageProps, currentUser}) => {
  return (
    <div>
      <h1>Header!  {currentUser.email}</h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContent) => {
  const client = buildClient(appContent.ctx);
  const {data} = await client.get('/api/users/currentuser');

  let pageProps = {};
  if(appContent.Component.getInitialProps) {
    pageProps = await appContent.Component.getInitialProps(appContent.ctx);
  }

  return {
    pageProps,
    ...data
  }
}

export default AppComponent;