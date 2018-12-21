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


        <pre className='pre'>
          <code className='code'>
            <span className='const'>const </span>
            <span className='varname'>user</span>
            {
            `= {
  _id: ObjectId(),
  username: "`}
  <span className='string'>string</span>
            {`"
    }`
          }
          </code>
        </pre>

          <pre className='pre'>
          <code className='code'>
            <span className='const'>const </span>
            <span className='varname'>payload</span>
            {
              ` = {
  _id:user._id.`}
            <span className='function'>toHexString(), </span><br/>
            {
                `  username:user.username
   } `}
            </code>
        </pre>

          <pre className='pre'>
          <code className='code'>
          <span className='const'>const </span>
            <span className='varname'>token</span>
            {` = jwt.`}<span className='function'>sign</span>{`(
    payload,
    secret,
   {expiresIn: "1h" }).`}
            <span className='function'>
              toString()
            </span>
           </code>
        </pre>

          <pre className='pre'>
          <code className='code'>
            <span className='const'>const</span>
            <span className='varname'> userWithToken</span>
            {` = db
  .`}
            collection
            {`("`}
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
     {/* </div>*/}


      <h3>2). Use token from mongoDB and set token in http header (express)</h3>
      <div className='text__code'>
        <pre className='pre'>
          <code className='code'>
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
            {` = loginUser(
            `}
            <span className='varname'>password,</span>
            <span className='varname'>email</span>{`)
  `}<span className='const'>const</span>{` `}
      <span className='varname'>token</span>{` = user.tokens[0].token
  res.`}<span className='function'>header</span>{`("`}
            <span className='string'>Authorization</span>
            {`",
             `}
            <span className='varname'>token</span>
            {`).`}
            <span className='function'>send</span>
            {`(`}
            <span className='varname'>user</span>{`)
 } catch (err) {
   return res.`}
          <span className='function'>status</span>
            {`(400).`}
          <span className='function'>send</span>
            {`(err)
        }
      })`}
          </code>
        </pre>
      </div>

      <h3>3). Use token from header, after login and verify token</h3>
      <p>Note: If used SSL insted secret key we used private.key to sign JWT and public.key to verify it</p>
      <p>If verify token from header is O.K (token and secret in db is equal in header), decoded  id from token and use to find user in MongoDB</p>


      <div className='text__code'>
       <pre className='pre'>
          <code className='code'>
            {
              `try {
 `}<span className='const'>const</span>
            {` `}
            <span className='varname'>token</span>
            {` = req
     .`}
            <span className='function'>header</span>
            {`("`}
            <span className='string'>Authorization</span>
            {`")
 `}<span className='const'>const</span>
            {` `}
            <span className='varname'>decoded</span>
            {` = jwt
     .`}
            <span className='function'>verify</span>
            {`(`}
            <span className='varname'>token,secret</span>
            {`)
 `}<span className='const'>const</span>
            {` `}
    <span className='varname'>_id</span>
            {`= ObjectID(decoded._id)
 `}<span className='const'>const</span>
            {` `}
            <span className='varname'>user</span>
            {`= db.collection("`}
            <span className='string'>users</span>
            {`")
     .findOne({_id})
    return `}
    <span className='varname'>user</span>
            {`
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
        <li>How use token when refresh page</li>
        <li>How make private route(view only login user)</li>
      </ul>
      <h3>3). Get token from server side</h3>

      <div className='text__code'>
        <pre className='pre'>
          <code className='code'>
            {
              ``}<span className='const'>const</span>{` `}
              <span className='varname'>loginUser</span>
            {` = (user) =>
                dispatch => {
   axios
    .post("`}<span className='string'>api/users/login</span>
            {`",user)
    .then(res => {
    `}<span className='const'>const</span>
            {` `}
            <span className='varname'>token</span>
            {` = res
            .data.tokens[0].token
 `}
            <span className='comment'>(//use from mongoDB)</span>
            {`
    `}
            <span className='const'>const</span>
            {` `}
            <span className='varname'>username</span>
            {` = res
            .data.username
      `}<span className='function'>setCookie</span>
            {`(cookieName,token,15)
 `}
            <span className='comment'>(//set token in cookie)</span>
            {`
      `}
            <span className='function'>setAuthToken</span>
            {
              `(token)
 `}
            <span className='comment'>(//set token in react)</span>{`
      dispatch(`}<span className='function'>setCurrentUser</span>
            {`(token))        `}
            {`
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
        <pre className='pre'>
          <code className='code'>
            {
              ``}<span className='const'>const</span>
            {` `}<span className='varname'>setAuthToken</span>
            {` = token => {
  if (`}<span className='varname'>token</span>{`) {
    axios.`}<span className='function'>create</span>{`({
`}<span className='comment'>(//60 sec timeout)</span>{`
      timeout: 60000,
`}<span className='comment'>(//keepAlive pools and reuses</span>{`
`}<span className='comment'>TCP connections, so it's faster)</span>{`
   httpAgent: new http
         .Agent({ keepAlive: true }),
   httpsAgent: new https
         .Agent({ keepAlive: true }),

`}<span className='comment'>(//follow up to 10 HTTP</span>{`
   `}<span className='comment'>3xx redirects)</span>{`
   maxRedirects: 10,

`}<span className='comment'>(//cap the maximum content</span>{`
   `}<span className='comment'>length we'll accept to 50MBs)</span>{`
   maxContentLength: 50 * 1000 * 1000
    });
`}
    <span className='comment'>(// Apply to every request)</span>{`
   axios.defaults
     .headers
     .common['Authorization'] = token;
  } else {
`}
    <span className='comment'>(// Delete auth header)</span>{`
    delete axios
      .defaults
      .headers
      .common['Authorization'];
  }
};`}
          </code>
        </pre>
      </div>


      <h3>5). Set and get and delete cookie</h3>
      <div className='text__code'>
        <pre className='pre'>
          <code className='code'>
            {``}<span className='comment'>(// set cookie)</span>{`
`}<span className='const'>const</span>{` `}
   <span className='varname'>setCookie</span>
            {` = (name,value,days)
                => {
`}<span className='const'>let</span>{` `}
  <span className='varname'>expires</span>{` = "";
  if (days) {
    `}<span className='const'>let</span>{` `}
    <span className='varname'>date</span>{` = new Date();
    `}<span className='varname'>date</span>
            {`.`}
            <span className='function'>setTime</span>
            {`(`}<span className='varname'>date</span>
            {`.`}<span className='function'>getTime</span>
            {`()
            + (days*24*60*60*1000));
    `}<span className='varname'>expires</span>
            {` = `}<span className='string'>"; expires="</span>
            {` +
                 `}<span className='varname'>date</span>
            {`.`}<span className='function'>toUTCString</span>{`();
  }
  document.cookie = name + "`}
  <span className='string'>=</span>
            {`" +
          `}<span className='string'>(value || "</span>
            {`")  +
                 expires + "`}
            <span className='string'>; path=/</span>{`";
}

`}<span className='comment'>(// get cookie)</span>{`
`}<span className='const'>const</span>
            {` `}<span className='varname'>getCookie
          </span>{` = (name) => {
  `}<span className='const'>const</span>
            {` `}<span className='varname'>cookieArray</span>
            {` = document.`}
            <span className='varname'>cookie</span>
            {`
            .`}
            <span className='function'>split</span>{`('`}
            <span className='string'>;</span>
            {`')
  `}<span className='const'>const</span>
            {` `}<span className='varname'>cookie
          </span>{` = `}<span className='varname'>cookieArray</span>
            {`
            .`}
            <span className='function'>filter</span>{`((cookie) =>
  name === `}
  <span className='varname'>cookie</span>{`.`}
  <span className='function'>substring</span>
            {`(0,`}<span className='varname'>cookie</span>
            {`
            .`}<span className='function'>indexOf</span>
            {`('='))
            .`}<span className='function'>trim</span>
            {`())
            .`}<span className='function'>toString</span>
            {`()
  return `}<span className='varname'>cookie</span>
            {`
            .`}<span className='function'>substring</span>
            {`(`}<span className='varname'>cookie</span>
            {`
            .`}<span className='function'>indexOf</span>
            {`('`}<span className='string'>=</span>{`')+1)
}

`}<span className='comment'>(// delete cookie)</span>{`
`}<span className='const'>const</span>
            {` `}
            <span className='varname'>eraseCookie</span>
            {` = (name) => {
  document.`}
  <span className='varname'>cookie</span>
            {` = name +
            '`}
            <span className='string'>=; Max-Age=-99999999;</span>
            {`';
}`}
          </code>
        </pre>
      </div>


      <h3>6).What shall we do when refresh page ??</h3>
      <div className='text__code'>
        <pre className='pre'>
          <code className='code'>
            {
              ` `}<span className='const'>const</span>
            {` cookieName = 'my-proposal'
 `}<span className='const'>const</span>
            {` token = getCookie(cookieName)

 if (!`}
   <span className='function'>isEmpty</span>{`(token)){
`}<span className='comment'>(//verify end decode token)</span>{`
    `}<span className='const'>let</span>
            {` `}<span className='varname'>decoded</span>
            {` = jwt.`}<span className='function'>verify</span>
            {`(
            `}<span className='varname'>token,</span>{`
            `}<span className='varname'>secret,</span>{`
            (err,decoded) => {
      if (err){
        return err
      }
      return `}<span className='varname'>decoded</span>{`
    })
`}<span className='comment'>(//set token)</span>{`
    `}<span className='function'>setAuthToken</span>
            {`(`}<span className='varname'>token</span>{`);
`}<span className='comment'>(//set user if token exist)</span>{`
    `}<span className='varname'>store</span>
            {`.dispatch(
    `}
            <span className='function'>setCurrentUser</span>
            {`(`}<span className='varname'>token</span>{`));
`}<span className='comment'>(//using user's creds from mongo)</span>{`
    `}<span className='varname'>store</span>
            {`.dispatch(
    `}
            <span className='function'>getCurrentUser</span>
            {`(decoded.username));
    `}<span className='function'>const</span>
            {` `}
            <span className='varname'>currentTime</span>
            {` = `}<span className='function'>Date</span>
            {`.now();
      if (decoded.exp < currentTime) {
        `}<span className='varname'>store</span>
            {`.dispatch(`}
            <span className='function'>logoutUser</span>
            {`());
        window.location.href = '/';
      }
    }`
            }
          </code>
        </pre>
      </div>


      <h3>7).Make private route in React</h3>
      <div className='text__code'>
        <pre className='pre'>
          <code className='code'>
            {
              ``}<span className='const'>const</span>
            {` `}<span className='varname'>PrivateRoute</span>
            {` =
({ `}<span className='varname'>component</span>
            {`: Component,
              authenticate,
              ...rest }) => (
<`}<span className='varname'>Route</span>{`
  {...rest}
  render={props =>
      `}<span className='varname'>authenticate</span>{`
      .isAuthenticate === true ? (
        <`}<span className='varname'>Component</span>
            {` {...props} />
      ) : (
        <`}<span className='varname'>Redirect</span>
            {` to="`}<span className='string'>/</span>
            {`" />
      )
    }
  />
);
`}<span className='const'>const</span>{` `}
<span className='varname'>mapStateToProps</span>{` = state => {
  return {
    `}<span className='varname'>authenticate</span>
            {`:state.authenticate
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
