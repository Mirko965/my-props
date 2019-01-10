1). store token in mongodb

<pre>
<code>

const user= {
  _id: ObjectId(),
  username: "string"
    }
const payload = {
  _id:user._id.toHexString(), 
  username:user.username
   } 
const token = jwt.sign(payload,secret,{expiresIn: "1h"}).toString()
const userWithToken = db.collection("users").findOneAndUpdate(
    {_id:user._id},
    {$set: {tokens:[{ token }]}},
    {returnOriginal: false}
  )

</code>
</pre>

2). Use token from mongoDB and set token in http header (express)
<pre>
<code>

router.post('/login',(req,res) => {
const { email,password } = req.body
 try {
   const user = loginUser(password,email)
   const token = user.tokens[0].token
   res.header("Authorization",token).send(user)
 } catch (err) {
   return res.status(400).send(err)
   }
 })
 
</pre>
</code>

3). Use token from header, after login and verify token
<pre>
<code>
try {
  const token = req.header("Authorization")
  const decoded = jwt.verify(token,secret)
  const _id= ObjectID(decoded._id)
  return db.collection("users").findOne({_id})
} catch (err) {
  throw err
}
</pre>
</code>


4). Get token from server side

<pre>
<code>
const loginUser = (user) => dispatch => {
  axios.post("api/users/login",user)
    .then(res => {
      const token = res.data.tokens[0].token //use from mongoDB
      setAuthToken(token)                    //set token in react
      dispatch(setCurrentUser(token))})
    .catch(err => dispatch({
      type:'GET_ERRORS',
      errors:err.response.data
    }))
}
</pre>
</code

5). Set token in header from client side
<pre>
<code>
const setAuthToken = token => {
  if (token) {
    axios.create({          
      timeout: 60000,
      httpAgent: new http.Agent({ keepAlive: true }), 
      httpsAgent: new https.Agent({ keepAlive: true }),
      maxRedirects: 10,
      maxContentLength: 50 * 1000 * 1000
  });
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
</pre>
</code>

6). Set and get and delete cookie
<pre>
<code>
const setCookie = (name,value,days) => {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}


const getCookie = (name) => {
  const cookieArray = document.cookie.split(';')
  const cookie = cookieArray
    .filter((cookie) => name === cookie.substring(0,cookie.indexOf('='))
      .trim())
    .toString()
  return cookie
    .substring(cookie.indexOf('=')+1)
}


const eraseCookie = (name) => {
  document.cookie = name + '=; Max-Age=-99999999;';
}
</pre>
</code>


7).What shall we do when refresh page ??
<pre>
<code>
if (!isEmpty(token)){

  let decoded  = jwt.decode(token);
  setAuthToken(token);
  store.dispatch(setCurrentUser(token));
  store.dispatch(getCurrentUser(decoded.username));
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = '/';
  }
}
</pre>
</code>

8).Make private route in React
const PrivateRoute = ({ component: Component, authenticate, ...rest }) => (
    <Route
      {...rest}
      render={props => authenticate.isAuthenticate === true ? (
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






<pre>
<code>
try {
 const token = req.header("Authorization")
 const decoded = jwt.verify(token,secret)
 const _id= ObjectID(decoded._id)
 return db.collection("users").findOne({_id})
  } catch (err) {
    throw err
  }
</pre>
</code>



<h3>What is JSON Web Token</h3>
<p>JSON Web Token is a JSON-based open standard for creating access tokens. Server could generate a token that has the claim logged in, and provide that to a client. The client could then use that token to prove that it is logged in . The tokens are signed by one party's private key (optional but recommended), so that both parties are able to verify that the token is legitimate.</p>
<p>In authentication, when the user successfully logs in using their credentials, a JSON Web Token will be returned and must be saved locally ,better cookie then local storage, instead of the traditional approach of creating a session in the server and returning a cookie.</p>

<h5>How to sign</h5>
1
<pre>
<code>const payload = {_id:user._id.toHexString(),username:user.username}</code><span> - store token in mongoDB</span> 
<code>const token = jwt.sign(payload,secret,{ expiresIn: 60 * 60 * 24 * 10 }).toString()</code>
<code>db.collection('users').findOneAndUpdate{_id:user{$set: {tokens:[{token}]}}}</code>
</pre>
2
<p>Use token from mongoDB and set token in http header (express)</p>
<code>
router.post('/login',(req,res) => {
   const { email,password } = req.body    
   try {    
      const user = loginUser(email, password)                    
      const token = user.tokens[0].token
      res.header('Authorization', token).send(user)
        } catch (err) {
          return res.status(400).send(err)
        }
      })
      </p>             
3
<p>use token from header, after login</p>

<p>in mongo</p>
<pre>
<code>const decoded = jwt.verify(token, secret)</code>
<code>const _id = ObjectID(decoded._id)</code>
</pre>
<h3>Note: We used private.key to sign JWT and public.key to verify it</h3>
<p>If Verify token from header is ok(token and secret in db is equal in header),decoded _id from token and use to find user</p>
<code>findByToken =  db.collection('users').findOne({_id})</code>
<p>_id decoded from token. if there is not token, or it is wrong, user will not find</p>


<pre>
<code>
const authenticate = (req,res,next) => {
  try {
    const token = req.header('Authorization')
    if (token){
      const user = findByToken(token)
      req.user = user
      next()
    } else {
      next()
    }
  } catch (e) {
    res.status(401)
    next()
  }
}
</code>
</pre>

<p>Function authenticate is middleware in express</p>
<pre>
<code>
router.get('/me', authenticate, (req,res) => {
   const token = req.token
  try {
    const user = await getUserByToken(token)
    return res.send(user)
  } catch (e) {
     return res.status(401).send(e)
  }
})
</code>
</pre>
  
<h3>Client Side</h3>
<ul>
<li>How to use token in React ???</li>
<li>Apply header to every request</li>
<li>Where store token on client side: cookie, local storage or reuse from DB ??</li>
<li>Set token in cookie and how reuse it</li>
<li>How use token when refreshe page</li>
<li>How make private route(wiev only login user)</li>
</ul>   

<h4>Use token from server side</h4>
<pre>
<code>
const loginUser = (user) => dispatch => {
  axios.post('api/users/login',user)
    .then(res => {
      const token = res.data.tokens[0].token  //use from monoDB
      const username = res.data.username
      setCookie(cookieName,token,15)
      setAuthToken(token)                    //set token in react
      dispatch(setCurrentUser(token))        //authenticated user
    })
    .catch(err => dispatch({
      type:'GET_ERRORS',
      errors:err.response.data
  }))
}
</code>
</pre>
<h3>Set token in react</h3>
<pre>
<code>
const setAuthToken = token => {
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
};
</code>
</pre>

<h4>Set and get token from cookie</h4>
<pre>
<code>
1 set cookie
const setCookie = (name,value,days) => {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

2 get cookie
const getCookie = (name) => {
  const cookieArray = document.cookie.split(';')
  const cookie = cookieArray.filter((cookie) => name === cookie.substring(0,cookie.indexOf('=')).trim()).toString()
  return cookie.substring(cookie.indexOf('=')+1)
}

3 delete cookie
const eraseCookie = (name) => {
  document.cookie = name+'=; Max-Age=-99999999;';
}
</code>
</pre>
 
<h4>What will do when refresh page ??</h4> 
<pre>
<code>
 const cookieName = 'my-proposal'                                
 const token = getCookie(cookieName)                            //get cookie

   if (!isEmpty(token)){                                        //verify end decode token
      let decoded = jwt.verify(token,secret,(err,decoded) => {
        if (err){
          console.log(err.message)
        }
        return decoded
      })
      setAuthToken(token); //set token
      store.dispatch(setCurrentUser(token));                    //set user if token exist
      store.dispatch(getCurrentUser(decoded.username));         //using user's credentials from mongo
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = '/';
      }
    }
</code>
</pre>

<h4>Make private route in React</h4>
<pre>
<code>
const PrivateRoute = ({ component: Component, authenticate, ...rest }) => (
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
</code>
</pre>
