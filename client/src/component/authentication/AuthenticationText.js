import React, { Component } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/styles/prism';

class AuthenticationText extends Component {

  render () {
    const tokenInMongodb = 'const user= {\n' +
      '  _id: ObjectId(),\n' +
      '  username: "string"\n' +
      '    }\n' +
      'const payload = {\n' +
      '  _id:user._id.toHexString(), \n' +
      '  username:user.username\n' +
      '   } \n' +
      'const token = jwt.sign(payload,secret,{expiresIn: "1h"}).toString()\n' +
      'const userWithToken = db.collection("users").findOneAndUpdate(\n' +
      '    {_id:user._id},\n' +
      '    {$set: {tokens:[{ token }]}},\n' +
      '    {returnOriginal: false}\n' +
      '  )'
    const useTokenFromMongoDB = 'router.post(\'/login\',(req,res) => {\n' +
      'const { email,password } = req.body\n' +
      ' try {\n' +
      '   const user = loginUser(password,email)\n' +
      '   const token = user.tokens[0].token\n' +
      '   res.header("Authorization",token).send(user)\n' +
      ' } catch (err) {\n' +
      '   return res.status(400).send(err)\n' +
      '   }\n' +
      ' })'
    const useTokenFromHeader = 'try {\n' +
      '  const token = req.header("Authorization")\n' +
      '  const decoded = jwt.verify(token,secret)\n' +
      '  const _id= ObjectID(decoded._id)\n' +
      '  return db.collection("users").findOne({_id})\n' +
      '} catch (err) {\n' +
      '  throw err\n' +
      '}'
    const getTokenFromServer = 'const loginUser = (user) => dispatch => {\n' +
      '  axios.post("api/users/login",user)\n' +
      '    .then(res => {\n' +
      '      const token = res.data.tokens[0].token //use from mongoDB\n' +
      '      setAuthToken(token)                    //set token in react\n' +
      '      dispatch(setCurrentUser(token))})\n' +
      '    .catch(err => dispatch({\n' +
      '      type:\'GET_ERRORS\',\n' +
      '      errors:err.response.data\n' +
      '    }))\n' +
      '}'
    const setTokenInHeaderFromClient = 'const setAuthToken = token => {\n' +
      '  if (token) {\n' +
      '    axios.create({          \n' +
      '      timeout: 60000,\n' +
      '      httpAgent: new http.Agent({ keepAlive: true }), \n' +
      '      httpsAgent: new https.Agent({ keepAlive: true }),\n' +
      '      maxRedirects: 10,\n' +
      '      maxContentLength: 50 * 1000 * 1000\n' +
      '  });\n' +
      '    axios.defaults.headers.common[\'Authorization\'] = token;\n' +
      '  } else {\n' +
      '    delete axios.defaults.headers.common[\'Authorization\'];\n' +
      '  }\n' +
      '};'
    const setGetCookie = 'const setCookie = (name,value,days) => {\n' +
      '  let expires = "";\n' +
      '  if (days) {\n' +
      '    let date = new Date();\n' +
      '    date.setTime(date.getTime() + (days*24*60*60*1000));\n' +
      '    expires = "; expires=" + date.toUTCString();\n' +
      '  }\n' +
      '  document.cookie = name + "=" + (value || "")  + expires + "; path=/";\n' +
      '}\n' +
      '\n' +
      '\n' +
      'const getCookie = (name) => {\n' +
      '  const cookieArray = document.cookie.split(\';\')\n' +
      '  const cookie = cookieArray\n' +
      '    .filter((cookie) => name === cookie.substring(0,cookie.indexOf(\'=\'))\n' +
      '      .trim())\n' +
      '    .toString()\n' +
      '  return cookie\n' +
      '    .substring(cookie.indexOf(\'=\')+1)\n' +
      '}\n' +
      '\n' +
      '\n' +
      'const eraseCookie = (name) => {\n' +
      '  document.cookie = name + \'=; Max-Age=-99999999;\';\n' +
      '}'
    const refreshPage = 'if (!isEmpty(token)){\n' +
      '\n' +
      '  let decoded  = jwt.decode(token);\n' +
      '  setAuthToken(token);\n' +
      '  store.dispatch(setCurrentUser(token));\n' +
      '  store.dispatch(getCurrentUser(decoded.username));\n' +
      '  const currentTime = Date.now() / 1000;\n' +
      '  if (decoded.exp < currentTime) {\n' +
      '    store.dispatch(logoutUser());\n' +
      '    window.location.href = \'/\';\n' +
      '  }\n' +
      '}'
    const privateRoute = 'const PrivateRoute = ({ component: Component, authenticate, ...rest }) => (\n' +
      '    <Route\n' +
      '      {...rest}\n' +
      '      render={props => authenticate.isAuthenticate === true ? (\n' +
      '          <Component {...props} />\n' +
      '        ) : (\n' +
      '          <Redirect to="/" />\n' +
      '        )\n' +
      '      }\n' +
      '    />\n' +
      '  );\n' +
      'const mapStateToProps = state => {\n' +
      '  return {\n' +
      '    authenticate:state.authenticate\n' +
      '  }\n' +
      '};'


    return (
      <div className='private'>
        <h3>What is JSON Web Token</h3>
        <p>JSON Web Token is a JSON-based open standard for creating access tokens. Server could generate a token that
          has the claim logged in, and provide that to a client. The client could then use that token to prove that it
          is logged in . The tokens are signed by one party's private key (optional but recommended), so that both
          parties are able to verify that the token is legitimate.</p>
        <p>In authentication, when the user successfully logs in using their credentials, a JSON Web Token will be
          returned and must be saved locally (better cookie then local storage), instead of the traditional approach of
          creating a session in the server and returning a cookie.</p>

        <h2>Server Side</h2>

        <h3>1). store token in mongodb</h3>

          <SyntaxHighlighter
            language='javascript'
            style={tomorrow}
            wrapLines={true}
          >
            {tokenInMongodb}
          </SyntaxHighlighter>

        <h3>2). Use token from mongoDB and set token in http header (express)</h3>
        <SyntaxHighlighter
          language='javascript'
          style={tomorrow}
          wrapLines={true}
        >
          {useTokenFromMongoDB}
        </SyntaxHighlighter>

        <h3>3). Use token from header, after login and verify token</h3>
        <p>Note: If used SSL insted secret key we used private.key to sign JWT and public.key to verify it</p>
        <p>If verify token from header is O.K (token and secret in db is equal in header), decoded id from token and use
          to find user in MongoDB</p>
        <SyntaxHighlighter
          language='javascript'
          style={tomorrow}
          wrapLines={true}
        >
          {useTokenFromHeader}
        </SyntaxHighlighter>

        <h2>Client Side</h2>
        <ul>
          <li>How to use token in React ???</li>
          <li>Apply header to every request</li>
          <li>Where store token on client side: cookie, local storage or reuse from DB ??</li>
          <li>Set token in cookie and how reuse it</li>
          <li>How use token when refresh page</li>
          <li>How make private route(view only login user)</li>
        </ul>


        <h3>4). Get token from server side</h3>

        <SyntaxHighlighter
          language='javascript'
          style={tomorrow}
          wrapLines={true}
        >
          {getTokenFromServer}
        </SyntaxHighlighter>


        <h3>5). Set token in header from client side</h3>
        <SyntaxHighlighter
          language='javascript'
          style={tomorrow}
          wrapLines={true}
        >
          {setTokenInHeaderFromClient}
        </SyntaxHighlighter>

        <h3>6). Set and get and delete cookie</h3>
        <SyntaxHighlighter
          language='javascript'
          style={tomorrow}
          wrapLines={true}
        >
          {setGetCookie}
        </SyntaxHighlighter>


        <h3>7).What shall we do when refresh page ??</h3>
        <SyntaxHighlighter
          language='javascript'
          style={tomorrow}
          wrapLines={true}
        >
          {refreshPage}
        </SyntaxHighlighter>

        <h3>7).Make private route in React</h3>
        <SyntaxHighlighter
          language='javascript'
          style={tomorrow}
          wrapLines={true}
        >
          {privateRoute}
        </SyntaxHighlighter>
      </div>
    )
  }
}

export default AuthenticationText
