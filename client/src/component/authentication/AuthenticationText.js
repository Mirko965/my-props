import React from 'react'

const AuthenticationText = () => {
  return (
    <div className='authentication__text'>
      <h3>What is JSON Web Token</h3>
      <p>JSON Web Token is a JSON-based open standard for creating access tokens. Server could generate a token that has the claim logged in, and provide that to a client. The client could then use that token to prove that it is logged in . The tokens are signed by one party's private key (optional but recommended), so that both parties are able to verify that the token is legitimate.</p>
      <p>In authentication, when the user successfully logs in using their credentials, a JSON Web Token will be returned and must be saved locally (better cookie then local storage), instead of the traditional approach of creating a session in the server and returning a cookie.</p>

      <h2>Server Side</h2>
      <h3>1). store token in mongodb</h3>
      <div className='text__code'>

        <pre>
          <code>
            <span className='const'>const </span>
            <span className='varname'>user</span>
            {` = {
              _id: ObjectId(),
              username: "`}<span className='string'>string</span>{`"
              }`
              }
          </code>
        </pre>

        <pre>
          <code>
            <span className='const'>const </span>
            <span className='varname'>payload</span>
            {` = {
              _id:user._id.`}
              <span className='function'>toHexString()</span>
            {`,username:user.username
              } `}
            </code>
        </pre>

        <pre className='code'>
          <code className='code'>
          <span className='const'>const </span>
            <span className='varname'>token</span>
            {` = jwt.`}
            <span className='function'>sign</span>
            {`(`}<span className='varname'>payload,secret</span>,{`{expiresIn: "1h" }).`}
            <span className='function'>toString()</span>
           </code>
        </pre>

        <pre>
          <code>
            <span className='const'>const</span>
            <span className='varname'> userWithToken</span>
            {` = db.collection("`}
            <span className='string'>users</span>{`")
            .`}
            <span className='function'>findOneAndUpdate</span>
            {`(
              {_id:user._id},
              {$set: {tokens:[{ token }]}},
              {returnOriginal: false})`}
          </code>
        </pre>
      </div>

      <h3>2). Use token from mongoDB and set token in http header (express)</h3>
      <div className='text__code'>
        <pre>
          <code>
            {`router.`}<span className='function'>post</span>{`('/`}
            <span className='string'>login</span>{`',(req,res) => {
   `}
            <span className='const'>const</span>{` { `}
            <span className='varname'>email,password</span>{` } = req.body
   try {
      `}
           <span className='const'>const</span>
            {` `}
           <span className='varname'>user</span>
            {` = loginUser(`}
            <span className='varname'>email, password</span>{`)
      `}<span className='const'>const</span>{` `}
      <span className='varname'>token</span>{` = user.tokens[0].token
      res.`}<span className='function'>header</span>{`"`}
            <span className='string'>Authorization</span>{`", `}
            <span className='varname'>token</span>{`).`}
            <span className='function'>send</span>{`(`}
            <span className='varname'>user</span>{`)
        } catch (err) {
          return res.`}
          <span className='function'>status</span>{`(400).`}
          <span className='function'>send</span>{`(err)
        }
      })`}
          </code>
        </pre>
      </div>

      <h3>3). Use token from header, after login and verify token</h3>
      <p>Note: If used SSL insted secret key we used private.key to sign JWT and public.key to verify it</p>
      <p>If verify token from header is O.K (token and secret in db is equal in header), decoded  id from token and use to find user in MongoDB</p>


      <div className='text__code'>
        <pre>
          <code>
            {`try {
    `}<span className='const'>const</span>{` `}
            <span className='varname'>token</span>{` = req.`}
            <span className='function'>header</span>{`("`}
            <span className='string'>Authorization</span>{`")
    `}<span className='const'>const</span>{` `}
            <span className='varname'>decoded</span>{` = jwt.`}
            <span className='function'>verify</span>{`(`}
            <span className='varname'>token,secret</span>{`)
    `}<span className='const'>const</span>{` `}
    <span className='varname'>_id</span>{`= ObjectID(decoded._id)
    `}<span className='const'>const</span>{` `}
            <span className='varname'>user</span>{`= db.collection("`}
            <span className='string'>users</span>{`").findOne({_id})
    return `}<span className='varname'>user</span>{`
  } catch (e) {
    throw e
  }`}
          </code>
        </pre>
      </div>
      <h2>Client Side</h2>
      <ul>
        <li>How to use token in React ???</li>
        <li>Apply header to every request</li>
        <li>Where store token on client side: cookie, local storage or reuse from DB ??</li>
        <li>Set token in cookie and how reuse it</li>
        <li>How use token when refreshe page</li>
        <li>How make private route(wiev only login user)</li>
      </ul>
      <h3>3). Get token from server side</h3>

      <div className='text__code'>
        <pre>
          <code>
            {`const loginUser = (user) => dispatch => {
  axios.post('api/users/login',user)
    .then(res => {
      const token = res.data.tokens[0].token  //use from monoDB
      const username = res.data.username
      setCookie(cookieName,token,15)         //set token in cookie
      setAuthToken(token)                    //set token in react
      dispatch(setCurrentUser(token))        //authenticated user
    })
    .catch(err => dispatch({
      type:'GET_ERRORS',
      errors:err.response.data
  }))
}`}
          </code>
        </pre>
      </div>

      <h3>4). Set token in header from client side</h3>
      <div className='text__code'>
        <pre>
          <code>
            {`const setAuthToken = token => {
  if (token) {
    axios.create({
      //60 sec timeout
      timeout: 60000,

      //keepAlive pools and reuses TCP connections, so it's faster
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),

      //follow up to 10 HTTP 3xx redirects
      maxRedirects: 10,

      //cap the maximum content length we'll accept to 50MBs, just in case
      maxContentLength: 50 * 1000 * 1000
    });
    // Apply to every request
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common['Authorization'];
  }
};`}
          </code>
        </pre>
      </div>


      <h3>5). Set and get and delete cookie</h3>
      <div className='text__code'>
        <pre>
          <code>
            {`// set cookie
const setCookie = (name,value,days) => {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

// get cookie
const getCookie = (name) => {
  const cookieArray = document.cookie.split(';')
  const cookie = cookieArray.filter((cookie) =>
  name === cookie.substring(0,cookie.indexOf('=')).trim()).toString()
  return cookie.substring(cookie.indexOf('=')+1)
}

// delete cookie
const eraseCookie = (name) => {
  document.cookie = name+'=; Max-Age=-99999999;';
}`}
          </code>
        </pre>
      </div>


      <h3>6).What shall we do when refresh page ??</h3>
      <div className='text__code'>
        <pre>
          <code>
            {
              ` const cookieName = 'my-proposal'
 const token = getCookie(cookieName)

   if (!isEmpty(token)){
   //verify end decode token
      let decoded = jwt.verify(token,secret,(err,decoded) => {
        if (err){
          console.log(err.message)
        }
        return decoded
      })
      setAuthToken(token); //set token
      //set user if token exist
      store.dispatch(setCurrentUser(token));
      //using user's credentials from mongo
      store.dispatch(getCurrentUser(decoded.username));
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = '/';
      }
    }`
            }
          </code>
        </pre>
      </div>


      <h3>7).Make private route in React</h3>
      <div className='text__code'>
        <pre>
          <code>
            {`const PrivateRoute =
({ component: Component, authenticate, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authenticate.isAuthenticate === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      )
    }
  />
);
const mapStateToProps = state => {
  return {
    authenticate:state.authenticate
  }
};
`}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default AuthenticationText
